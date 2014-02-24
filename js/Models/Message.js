Cloudwalkers.Models.Message = Backbone.Model.extend({
	
	'typestring' : "messages",

	'initialize' : function ()
	{			
		// Deprecated?
		//this.on ('change', this.afterChange);

		if (typeof (this.attributes.parent) != 'undefined')
		{
			this.set ('parentmodel', new Cloudwalkers.Models.Message (this.attributes.parent));
			this.get ('parentmodel').trigger ('change');
		}
	},
	
	'parse' : function(response)
	{	
		// A new object
		if (typeof response == "number") return response = {id: response};
		
		
		else {
		
			// Is it a child message?
			if (response.message) response = response.message;
			
			// Handle fresh loads
			this.stamp(response);
			this.checkloaded(response);
		}
		
		return response;
	},
	
	'checkloaded' : function (response)
	{
		if(response.objectType) setTimeout(function(model){ model.trigger('loaded'); }, 1, this);
	},
	
	'filterData' : function (type, data)
	{	
	
		// Handle loading messages
		if(!this.get("objectType")) return this.attributes;
		
		var trending = data.trending;
		var data = {iconview: data.iconview};

		$.extend(data, this.attributes, {iconview: false}); 

		// Stream		
		var stream = Cloudwalkers.Session.getStream(this.get("stream"));
		
		if(stream)
		{
			data.icon = stream.get("network").icon;
			data.networktoken = stream.get("network").token;
			data.networkdescription = stream.get("name");
			data.url = this.link? this.link: "#" + type + "/" + stream.get("channels")[0];
			
		} else data.url = this.link;

		
		// Attachments and media
		if(this.get("attachments"))
		{
			var attachments = this.get("attachments");
			
			// Media
			data.media = attachments[attachments.length -1];
			data.media = (data.media.type == "image")? "picture" : data.media.type;
			
			// Attachments
			data.attached = {};
			$.each(attachments, function(n, object){ data.attached[object.type] = object });
		
		} else data.media = "reorder";
		
		// Type dependancies	
		if(type == "full")
		{
			data.url = null;
			
			// Date
			if(data.date)
			{
				data.fulldate = moment(data.date).format("DD MMM YYYY HH:mm");
				data.dateonly = moment(data.date).format("DD MMM YYYY");
				data.time = moment(data.date).format("HH:mm");
			}
			
			// Actions
			if(!this.actions)
				this.actions = new Cloudwalkers.Collections.Actions(false, {parent: this});
			
			data.actions = this.actions.rendertokens();
		}
		
		// Add trending parameter
		if(trending)
		{
			data.istrending = true;
			data.trending = (this.get("engagement") < 1000)? this.get("engagement"): "+999";
			data.iconview = true;
			data.time = this.get("engagement");
		}
		
		// Add limited text
		data.body.intro = data.body.plaintext? data.body.plaintext.substr(0, 72): "...";

		return data;
	},

	'location' : function ()
	{
		return "#";
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
                            
                            // Hack
							window.location.reload();
                            
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
                    self.destroy ({success:function(){
	                    
	                    // Hack
						window.location.reload();
	                    
                    }});
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
	},

	'messageAction' : function (action)
	{
		console.log (action);

		if (action == null)
		{
			console.log ('Action not found: ' + actiontoken);
			return;
		}

		var targetmodel = this;

		if (typeof (action.target) != 'undefined')
		{
			targetmodel = action.target;

			if (typeof (action.originalaction) != 'undefined')
			{
				action = action.originalaction;
			}
		}

		if (typeof (action.callback) != 'undefined')
		{
			action.callback (targetmodel);
		}
		else
		{
			if (action)
			{
				if (action.type == 'dialog')
				{
					var view = new Cloudwalkers.Views.ActionParameters ({
						'message' : targetmodel,
						'action' : action
					});
					Cloudwalkers.RootView.popup (view);
				}
				else if (action.type == 'simple')
				{
					targetmodel.act (action, {}, function (){});
				}

				else if (action.type == 'write')
				{
					/*
					Cloudwalkers.RootView.writeDialog
						(
							targetmodel,
							action
						);
					*/
					var view = new Cloudwalkers.Views.ActionParameters ({
						'message' : targetmodel,
						'action' : action
					});
					Cloudwalkers.RootView.popup (view);
				}
			}
		}
	}
});


