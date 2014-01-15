Cloudwalkers.Models.Message = Backbone.Model.extend({

    'url' : function (params)
    {
        return this.endpoint?
        
        	CONFIG_BASE_URL + 'json/message/' + this.id + this.endpoint :
        	CONFIG_BASE_URL + 'json/message/' + this.id;
    },

	'initialize' : function ()
	{
		this.on ('change', this.afterChange);

		if (typeof (this.attributes.parent) != 'undefined')
		{
			this.set ('parentmodel', new Cloudwalkers.Models.Message (this.attributes.parent));
			this.get ('parentmodel').trigger ('change');
		}
		else
		{
			this.trigger ('change');
		}

		//this.addInternalActions ();
	},
	
	'parse' : function(response)
	{	
		if(typeof response == "number") return {id: response};
		
		if(response.message) response = response.message;
		
		this.stamp(response);
		
		return response;
	},
	
	'sync' : function (method, model, options)
	{
		this.endpoint = (options.endpoint)? "/" + options.endpoint: false;

		return Backbone.sync(method, model, options);
	},
	
	'stamp' : function(params)
	{
		if (!params) params = {id: this.id};
		
		params.stamp = Math.round(new Date().getTime() *.001)
		
		Store.set("messages", params);
		
		return this;
	},
	
	'filterData' : function (type)
	{
		// Handle loading messages
		if(!this.get("date")) return this.attributes;
		
		var data = this.attributes;
		var stream = Cloudwalkers.Session.getStream(data.stream);
		
		if(data.attachments)
		{
			data.media = data.attachments[data.attachments.length -1];
			data.media.icon = (data.media.type == "image")? "picture" : data.media.type;
		
		} else data.media = {icon: "reorder"};
		
		if(stream)
		{
			data.icon = stream.get("network").icon;
			data.url = this.link? this.link: "#" + type + "/" + stream.get("channels")[0];
			
		} else data.url = this.link;
		
		if(type == "trending")
		{
			data.trending = (this.get("engagement") < 1000)? this.get("engagement"): "+999";
			data.date = null;
			data.iconview = true;
		
		} else if(type == "inbox")
		{
			data.url = null;
			data.media = {icon: data.icon};
			data.body.plaintext = data.body.plaintext? data.body.plaintext.substr(0, 72): "...";	
		
		} else if(type == "full")
		{
			data.url = null;
			data.share = this.filterShareData(stream);
			data.iconview = true;
			
			if(data.attachments)
			{
				data.attached = {};
				$.each(data.attachments, function(n, object){ data.attached[object.type] = object });
			}
		}

		return data;
	},

	'filterShareData' : function (stream)
	{
		var share = [];
		
		if(stream.get("network").token == "twitter")
		{
			// share.push({action: "favorite", icon: "star", name: "Favorite"});
			// share.push({action: "retweet", icon: "retweet", name: "Retweet"});
		}
		
		if(stream.get("network").token == "facebook")
		{
			share.push({action: "like", icon: "thumbs-up", name: "Like"});
			share.push({action: "comment", icon: "comment-alt", name: "Comment"});
		}
		
		if(stream.get("outgoing"))
		{
			share.push({action: "delete", icon: "remove", name: "Delete"});
			share.push({action: "reply", icon: "comment", name: "Reply"});
		}
		
		share.push({action: "internal-share", icon: "share-alt", name: "Share"});	

		return share;
	},
	
	'location' : function ()
	{
		return "#";
		
		/*if(this.link) return this.link;
		
		var channel = this.channel? this.channel: Cloudwalkers.Session.getChannel(this.collection.parentid);
		var stream = Cloudwalkers.Session.getStream(this.attributes.stream);
		
		return "#" + channel.get("type") + "/" + channel.id + "/0/" + stream.id + "/" + this.id;*/
	},
	
	
	'afterChange' : function ()
	{
		this.addInternalActions ();

		if (this.get ('parent'))
		{
			this.get ('parentmodel').set (this.get ('parent'));
		}
	},

	'getActionIcon' : function (action)
	{
		if (action.token == 'internal-share')
		{
			return 'share-alt';
		}

		else if (action.token == 'internal-edit')
		{
			return 'edit';
		}

		else if (action.token == 'internal-delete')
		{
			return 'remove';
		}

		else if (action.token == 'delete')
		{
			return 'remove';
		}

		else if (action.token == 'like')
		{
			return 'thumbs-up';
		}

		else if (action.token == 'unlike')
		{
			return 'thumbs-down';
		}

		else if (action.token == 'comment')
		{
			return 'comment-alt';
		}

		else if (action.token == 'reply')
		{
			return 'comment';
		}

		else if (action.token == 'retweet')
		{
			return 'retweet';
		}

		else if (action.token == 'dm')
		{
			return 'envelope';
		}

		else if (action.token == 'internal-reply')
		{
			return 'comment';
		}

		else if (action.token == 'favorite')
		{
			return 'star';
		}

		else if (action.token == 'unfavorite')
		{
			return 'star-empty';
		}

		return action.token;
	},

	'addInternalActions' : function ()
	{
		var self = this;

		// Check if we already have internals
		if (typeof (this.attributes.actions) != 'undefined')
		{
			for (var i = 0; i < this.attributes.actions.length; i ++)
			{
				if (this.attributes.actions[i].token.substr (0, 9) == 'internal-')
				{
					return;
				}
			}
		}
		else
		{
			this.attributes.actions = [];	
		}

		// Add "share" button
		if (this.attributes.type == 'INCOMING')
		{
			this.attributes.actions.push ({
				'name' : 'Share',
				'parameters' : [],
				'token' : 'internal-share',
				'callback' : function (message)
				{
					Cloudwalkers.RootView.shareMessage (message);
				}
			});
		}
		else if (this.attributes.type == 'OUTGOING')
		{
			this.attributes.actions.push ({
				'name' : 'Edit',
				'parameters' : [],
				'token' : 'internal-edit',
				'callback' : function (message)
				{
					Cloudwalkers.RootView.editMessage (self);
				}
			});

			this.attributes.actions.push ({
				'name' : 'Delete',
				'parameters' : [],
				'token' : 'internal-delete',
				'callback' : function (message)
				{
					self.deleteMessage ();
				}
			});
		}

		// see if we have a parent we can reply to
		var parent = this.get ('parentmodel');
		if (typeof (parent) != 'undefined' && parent)
		{
			var parentactions = parent.get ('actions');

			if (parentactions)
			{
				for (var i = 0; i < parentactions.length; i ++)	
				{
					if (parentactions[i].token == 'comment')
					{
						this.attributes.actions.push ({
							'name' : 'Reply',
							'token' : 'internal-reply',
							'target' : parent,
							'originalaction' : parentactions[i]
						});
					}
				}
			}
		}

		// Add action icons
		if (typeof (this.attributes.actions) != 'undefined')
		{
			for (var i = 0; i < this.attributes.actions.length; i ++)
			{
				this.attributes.actions[i].icon = this.getActionIcon (this.attributes.actions[i]);
			}
		}
	},

	'deleteMessage' : function ()
	{
		var self = this;

		// Repeat or skip?
		if (this.repeat ().repeat)
		{
			Cloudwalkers.RootView.dialog 
			(
				'Are you sure you want to remove this message?', 
				[
					{
						'label' : 'Skip once',
						'description' : 'Message will be skipped once',
						'token' : 'skip'
					},
					{
						'label' : 'Delete forever',
						'description' : 'Message will never be repeated',
						'token' : 'remove'
					}
				],
				function (response) 
				{
					var url = 'post/?' + response.token + '=' + self.get ('id');

					// Do the call
					jQuery.ajax
					({
						dataType:"json", 
						type:"get", 
						url: url, 
						success:function(objData)
						{
                            /*
							var collection = self.collection;

                            if (collection)
                            {
							    collection.reset ();
							    collection.fetch ();
                            }
                            */
                            self.trigger ("destroy", self, self.collection);
						}
					});
				}
			);
		}
		else
		{
			Cloudwalkers.RootView.confirm 
			(
				'Are you sure you want to remove this message?', 
				function () 
				{
                    self.destroy ();
                    //self.trigger ("destroy", self, self.collection);
				}
			);
		}
	},

	'humandate' : function (entry)
	{
		var date = (new Date(entry? entry: this.get ('date')));
		
		return Cloudwalkers.Utils.longdate (date);
	},

	'shortdate' : function ()
	{
		var date = this.date ();
		return Cloudwalkers.Utils.shortdate (date);
	},

	'time' : function ()
	{
		var date = this.date ();
		return Cloudwalkers.Utils.time (date);
	},

	'date' : function ()
	{
		return (new Date(this.get ('date')));
	},

	'getAction' : function (token)
	{
		
		var actions = this.get ('actions');
		for (var i = 0; i < actions.length; i ++)
		{
			if (actions[i].token == token)
			{
				return actions[i];
			}
		}
		return null;
	},

	// Execute an action, if possible with parameters
	'act' : function (action, parameters, callback)
	{
		
		Cloudwalkers.RootView.growl (action.name, "The " + action.token + " is planned with success.");
		
		var self = this;

		if (typeof (parameters) == 'undefined')
		{
			parameters = {};
		}

		var data = {
			'actions' : [
				{
					'token' : action.token,
					'parameters' : parameters
				}
			]
		};

		var url = CONFIG_BASE_URL + 'json/message/' + this.get ('id') + '?account=' + Cloudwalkers.Session.getAccount ().get ('id');

		// Do the call
		jQuery.ajax
		({
			data: JSON.stringify (data), 
			dataType:"json", 
			type:"put", 
			url: url, 
			processData : false,
			cache : false,
			success:function(objData)
			{
				if (objData.removed)
				{
					// Remove the message
                    /*
                    if (self.collection)
                    {
					    self.collection.remove (self);
                    }
                    */
                    self.trigger ("destroy", self, self.collection);
				}
				else
				{
					self.set (objData.message);
				}

                callback ();
			}
		});
	},

	'scheduledate' : function (showtext)
	{
		if (typeof (showtext) == 'undefined')
		{
			showtext = true;
		}

		var schedule = this.get ('schedule');
		
		if(!schedule) return false;

		if (showtext)
	
			return (schedule.date == 'ASAP')? schedule.date: this.humandate(schedule.date);

		else if (schedule.date == 'ASAP')

			return false;
		else
			return (new Date(schedule.date));

	},

	'calculateIntervalFromSeconds' : function (intervalSeconds)
	{
		var out = {};

		var intervalunits = 
		[ 
			{ 'unit' : 'minutes', 'value' : 60 }, 
			{ 'unit' : 'hours', 'value' : 60 * 60 }, 
			{ 'unit' : 'days', 'value' : 60 * 60 * 24 }, 
			{ 'unit' : 'weeks', 'value' : 60 * 60 * 24 * 7 }, 
			{ 'unit' : 'months', 'value' : 60 * 60 * 24 * 31 }
		];

		// First check for an exact match
		for (var i = intervalunits.length - 1; i >= 0; i --)
		{
			if ((intervalSeconds % intervalunits[i].value) == 0)
			{
				out.interval = Math.round (intervalSeconds / intervalunits[i].value);
				out.unit = intervalunits[i].unit;

				return out;
			}
		}

		// Then take the closest, most detailed value
		for (var i = 0; i < intervalunits.length; i ++)
		{
			if ((intervalSeconds / intervalunits[i].value) < 72)
			{
				out.interval = Math.round (intervalSeconds / intervalunits[i].value);
				out.unit = intervalunits[i].unit;

				return out;
			}
		}

		return false;
	},

	'repeat' : function ()
	{
		var schedule = this.get ('schedule');

		var out = {};

		out.repeat = false;
		out.weekdays = {};

		if (typeof (schedule) != 'undefined' && typeof (schedule.repeat) != 'undefined')
		{
			out.repeat = true;

			// Need some calculations here
			var intervalunit = this.calculateIntervalFromSeconds (schedule.repeat.interval);
			if (intervalunit)
			{
				out.interval = intervalunit.interval;
				out.unit = intervalunit.unit;
			}

			out.end = null;
			
			if (schedule.repeat.end)
			{
				out.end = new Date(schedule.repeat.end);
			}

			if (schedule.repeat.weekdays)
			{
				for (var i = 0; i < schedule.repeat.weekdays.length; i ++)
				{
					out.weekdays[schedule.repeat.weekdays[i]] = true;
				}
			}
		}

		return out;
	},

	'getStream' : function ()
	{
		if (this.get ('stream'))
		{
			return Cloudwalkers.Session.getAccount().streams.get(this.get ('stream'));
		}
		return null;
	},

	'getProcessedAttachments' : function ()
	{
		var attachments = [];
		var attachment;

		if (typeof (this.attributes.attachments) != 'undefined')
		{
			for (var i = 0; i < this.attributes.attachments.length; i ++)
			{
				attachment = this.attributes.attachments[i];

				if (attachment.type == 'link')
				{
					// Check if link is also available in page
					if (this.attributes.body.plaintext == null
						|| this.attributes.body.plaintext.indexOf (attachment.url) === -1)
					{
						// It is not, add it to the attachments.
						attachments.push (attachment);		
					}

				}
				else
				{
					attachments.push (attachment);
				}
			}
		}

		return attachments;
	},

	'setRead' : function ()
	{
		if (!this.get ('read'))
		{
			var url = CONFIG_BASE_URL + 'json/message/' + this.get ('id') + '/read/';

			// Do the call
			jQuery.ajax
			({
				type:"get", 
				url: url, 
				success:function(objData)
				{
				}
			});
		}
	},

	'shortBody' : function ()
	{
		var body = this.get ('body');

		if (!body.plaintext)
		{
			return {
				'html' : '',
				'plaintext' : ''
			};
		}

		var out = { 
			'html' : body.plaintext.substring (0, 100),
			'plaintext' : body.plaintext.substring (0, 100)
		};

		return out;
	}

});