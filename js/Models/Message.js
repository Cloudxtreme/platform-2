Cloudwalkers.Models.Message = Backbone.Model.extend({
	
	'typestring' : "messages",
	'limits' : {'twitter' :140, 'linkedin' : 700},

	/*
	*
	* setvariation() 	: Update exiting or generate new variation
	* getvartiation()	: Get some variation data
	* removevarimg()	: Removes an image from a variation
	*
	*/

	'initialize' : function ()
	{			
		// Deprecated?
		//this.on ('change', this.afterChange);
		
		// Ping
		//this.on('outdated', this.fetch);

		if (typeof (this.attributes.parent) != 'undefined')
		{
			this.set ('parentmodel', new Cloudwalkers.Models.Message (this.attributes.parent));
			this.get ('parentmodel').trigger ('change');
		}
		
		// Actions
		this.actions = new Cloudwalkers.Collections.Actions(false, {parent: this});
		
		// Children
		this.notifications = new Cloudwalkers.Collections.Notifications(false, {parent: this});
	},
	
	'url' : function (params)
    {
        if(!this.id)
        	return CONFIG_BASE_URL + 'json/accounts/' + Cloudwalkers.Session.getAccount().id + "/" + this.typestring;
        
        return this.endpoint?
        
        	CONFIG_BASE_URL + 'json/' + this.typestring + '/' + this.id + this.endpoint :
        	CONFIG_BASE_URL + 'json/' + this.typestring + '/' + this.id;
    },

	'parse' : function(response)
	{	
		// A new object
		if (typeof response == "number") return response = {id: response};
		
		
		else {
		
			// Is it a child message?
			if (response.message) response = response.message;
			
			// Handle fresh loads
			response = this.filterData(response);
			
			this.stamp(response);
			this.checkloaded(response);
		}
		
		return response;
	},
	
	'sync' : function (method, model, options)
	{
		
		this.endpoint = (options.endpoint)? "/" + options.endpoint: false;
		
		// Hack
		if(method == "update") return false;
		
		return Backbone.sync(method, model, options);
	},

	/* Validations */
	// Checkblock : what validations to block
	'validateCustom' : function (checkblock)
	{	
		//Check for any content	
		if(!this.hascontent() && checkblock != 'content')			return "You need a bit of content.";
		if(!this.checkcontent())									return "One or more networks exceed the character limit.";
		if(!this.get("streams").length && checkblock != 'streams')	return "Please select a network first.";
	},

	'hascontent' : function()
	{
		var result;

		// Default
		if(this.get("attachments") && this.get("attachments").length)	return this.get("attachments").length;
		if(this.get("body").plaintext)									return this.get("body").plaintext.length;

		// Variations
		if(this.get("variations") && this.get("variations").length){
			$.each(this.get("variations"), function(n, variation)
			{
				if(variation.attachments && variation.attachments.length){
					result = variation.attachments.length;
					return false;
				}

				if(variation.body && variation.body.plaintext){
					result = variation.body.plaintext.length
					return false;
				}

			}.bind(this));

			return result;
		}
	},

	'checkcontent' : function()
	{					
		//Hardcoded smallest limit. Get it dinamically
		var smallestlimit = 140;
		var result = 1;
		var variation;
									
		/*if(this.get("body").plaintext){
			if(smallestlimit - this.get("body").plaintext.length < 0)
				return false;
		}*/			

		// Variations
		if(this.get("streams") && this.get("streams").length){
			$.each(this.get("streams"), function(n, stream)
			{	
				var network = Cloudwalkers.Session.getStream(stream).get("network");
				var limit = network.limitations['max-length']? network.limitations['max-length'].limit : null;
				
				if(!limit)	return true;
				
				//Find the variation with that id, if not, use the default's limit
				if(variation = this.getvariation(stream)){
					if(variation.body && variation.body.plaintext){

						result = limit - variation.body.plaintext.length;
						if(result < 0)	return false;
						else			return true;
					}
				}else{
					if(this.get("body") && this.get("body").plaintext){
						result = limit - this.get("body").plaintext.length;
						if(result < 0)
							return false;
					}
				}

				

			}.bind(this));			
		}

		return result > 0;
	},

	/* !Validations */
	
	'sanitizepost' : function ()
	{
		// Remove body HTML
		if(this.attributes.body.html)  delete this.attributes.body.html;
		
		// Variations sanitize
		if(this.attributes.variations) this.attributes.variations.forEach(function(varn, n)
		{
			// Clean body
			if(varn.body)
			{
				if(!varn.body.plaintext) delete varn.body;
				else if(varn.body.html) delete varn.body.html;
			}
			
			// Clean zombie variations
			if (this.attributes.streams.indexOf(varn.stream) < 0)
				this.attributes.variations.splice(n, 1);
			
		}.bind(this));
	}, 
	
	
	
	'cloneSanitized' : function ()
	{
		var model = this.clone();
		
		if (model.attributes.date)				delete model.attributes.date;
		if (model.attributes.from)				delete model.attributes.from;
		if (model.attributes.stream)			delete model.attributes.stream;
		
		model.attributes.streams = [];
		
		// A clone shouldn't have an id
		if(model.id)
		{
			delete model.id; delete model.attributes.id;
		}
	
		return model;	
	},
	
	'checkloaded' : function (response)
	{
		if(response.objectType) setTimeout(function(model){ model.trigger('loaded'); }, 1, this);
	},
	
	'filterData' : function (response)
	{	
		// Set up filtered data
		var filtered = {};
		var values = ["id", "objectType", "actiontokens", "subject", "body", "date", "engagement", "from", "read", "stream", "streams", "attachments", "parent", "statistics", "canHaveChildren", "children_count", "schedule", "variations"]
		
		$.each(values, function(n, value){ if(response[value] !== undefined) filtered[value] = response[value]});
		

		// Stream		
		var stream = Cloudwalkers.Session.getStream(response.stream);
		
		if(stream)
		{
			filtered.icon = stream.get("network").icon;
			filtered.networktoken = stream.get("network").token;
			filtered.networkdescription = stream.get("name");	
		}

		// Attachments and media
		if(response.attachments)
		{			
			// Media
			if(response.attachments.length)
			{
				filtered.media = response.attachments[response.attachments.length -1];
				filtered.media = (filtered.media.type == "image")? "picture" : filtered.media.type;
			}
			
			// Attachments
			filtered.attached = {};
			$.each(response.attachments, function(n, object){ filtered.attached[object.type] = object });
		
		} else filtered.media = "reorder";
		
		// If trending
		if(response.engagement) filtered.trending = response.engagement < 1000? response.engagement: "+999";
		
		// If scheduled
		if(filtered.schedule) filtered.scheduledate = moment(filtered.schedule.date).format("DD MMM YYYY HH:mm");
		
		// Add limited text
		if(response.body) filtered.body.intro = response.body.plaintext? response.body.plaintext.substr(0, 72): "...";
		
		// Date
		if(response.date)
		{
			filtered.fulldate = moment(response.date).format("DD MMM YYYY HH:mm");
			filtered.dateonly = moment(response.date).format("DD MMM YYYY");
			filtered.time = moment(response.date).format("HH:mm");
		}


		return filtered;
	},
	//Temp hack for viewcontact endpoint
	'generateintro' : function()
	{
		if(this.get("body") && !this.get("body").intro)
			this.attributes.body.intro = this.get("body").plaintext.substr(0, 72);

	},

	'filterActions' : function ()
	{	
		if(!this.get("actiontokens")) return [];
		
		return this.actions.rendertokens();
	},
	
	'filterCalReadable' : function ()
	{
		var loaded = (this.get("objectType"));
		var media =  loaded && this.get("media") != "reorder";
		
		if(!this.calNode) this.calNode = {id: this.id};
		
		// Calendar node elements
		this.calNode.start = loaded? $.fullCalendar.moment(this.get("date")): $.fullCalendar.moment(); /*new Date(this.get("date")): new Date()*/
		this.calNode.title = loaded? (this.get("title")? this.get("title"): this.get("body").plaintext).substring(0, media? 12: 16): "...";
		this.calNode.className = loaded? this.get("networktoken") + '-color': 'hidden';
		this.calNode.networkdescription = loaded? this.get("networkdescription"): null;
		this.calNode.intro = loaded? this.get("body").intro: null;
		this.calNode.icon = loaded? this.get("icon"): null;
		this.calNode.media = media? this.get("media"): null;
		
		// Prettify intro
		if(loaded && this.calNode.intro.length >= 72) this.calNode.intro += "...";
		
		return this;
	},
	
	'attach' : function (attach, index, streamid)
	{	
		var attachments = this.get("attachments") || [];
		
		var response = (index && attachments[index])?	$.extend(attachments[index], attach) :
														attachments.push(attach);
			
		this.set({attachments: attachments});
		
		return response;
	},
	
	'unattach' : function (index)
	{
		var attachments = this.get("attachments") || [];
		
		// Remove attachment
		attachments.splice(index, 1);
	},
	
	'addcampaign' : function ()
	{
		
		
		
		//Cloudwalkers.Session.getAccount().get("campaigns").filter(function(cmp){ if(cmp.id == campaignid) return cmp; }).shift();
	},
	
	/*'getOriginal' : function ()
	{
		
	},*/
	
	/*Variation functions*/

	'setvariation' : function(stream, key, value)
	{	
		var variations = this.get("variations") || [];
		var variation = variations.filter(function(el){ if(el.stream == stream) return el; });

		if(variation.length == 0)	//Add new variation
		{ 	
			variation = {'stream' : stream};

			if(key == 'image' || key == 'link'){
				var attachments = [value];
				variation['attachments'] = attachments;
			}else if(key){
				variation[key] = value;
			}

			variations.push(variation);
		}
		else					//Update variation
		{	
			variation = variation[0];
			if(key == 'image' || key == 'link'){
				var attachments = variation.attachments || [];
				if(attachments.length == 0 && key == 'image'){
					attachments.push(value);
					variation['attachments'] = attachments;					
				}else if(key == 'image'){
					attachments.push(value);
				}else{ 
					var link = attachments.filter(function(el){ if(el.type == 'link') return el; });
					if(link.length > 0)	link[0].url = value.url;
					else if(attachments.length != 0)	variation.attachments.push(value);
					else								variation.attachments = [value];
				}
			}else{
				variation[key] = value;
			}	
		}

		return variation;

	},
	
	'getvariation' : function (stream, key)
	{	
		// Get variation object
		var variations = this.get("variations") || []
		var variation = _.findWhere(variations, {'stream': stream});
		
		if(key == 'image' || key == 'link'){
			if(variation && variation.attachments)
				return variation.attachments.filter(function(el){ if(el.type == key) return el; });		
		}else if(variation && variation[key]){
			return variation[key];
		}else if(variation && !key){
			return variation;
		}else{
			return ;
		}	
		
	},
	
	'original' : function (stream, key, input)
	{	
		// Variation or self
		var variations = this.get("variations")? this.get("variations").filter(function(vr){ return stream && vr.stream == stream.id }): [];
		var variation = (stream)? (variations.length? variations[0]: {stream: stream.id}) : this.attributes; 
		
		// Set
		if (input !== undefined)
		{
			variation[key] = input;
			if(stream && !variations.length) this.get("variations").push(variation);
		}
		
		// Get
		return variation[key];
	},
	
	'removevariation' : function(streamid)
	{
		var variations = this.get("variations");
		if(!variations)	return;

		$.each(variations, function(n, variation)
		{
			if(variation.stream == streamid){
				variations.splice(n,1);
				return false;
			}
		});
	},

	'removevarimg' : function(streamid, image){
		//If image is an object it means it's meant to exclude

		var variation = this.getvariation(streamid)
		var attachments = variation? variation.attachments : [];

		if(_.isNumber(image)){	// It's a default iamge
			
			this.addexclude(streamid, image)			
		}else{			console.log(image)		// It's a variation image
			for(n in attachments){
				if(attachments[n].type == 'image' && attachments[n].name == image) 
					attachments.splice(n,1);
			}
		}
	},

	'addexclude' : function(streamid, index){
	
		var variation = this.getvariation(streamid) || this.setvariation(streamid);
		var excludes = variation.excludes;

		if(variation.excludes)
			variation.excludes.push(index);
		else
			variation.excludes = [index];
	},

	'checkexclude' : function(streamid, index){

		var variation = this.getvariation(streamid);
		var excludes;

		if(!variation)	return false;
		else			excludes = variation.excludes;

		if(excludes){
			
			for(n in excludes){
				if(excludes[n] == index)
					return true;
			}
		}

		//There are no excludes
		return false;

	},
			

	/* End variation functions */
	
	/*'filterData' : function (type, data)
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
	},*/

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
                            
                           self.trigger("destroy", {wait: true})
                           // self.trigger ("destroy", self, self.collection);
                            
                            // Hack
							//window.location.reload();
                            
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
						 self.trigger ("destroy", self, self.collection);
						//window.location.reload();
	                    
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

	'hasAttachement' : function(type){

		if (typeof (this.attributes.attachments) != 'undefined')
		{
			for (var i = 0; i < this.attributes.attachments.length; i ++)
			{
				attachment = this.attributes.attachments[i];
				
				if (attachment.type == type)	return this.attributes.attachments[i];
			}
			return false;
		}
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
					Cloudwalkers.RootView.writeDialog
						(
							targetmodel,
							action
						);
				}
			}
		}
	},

	'hasattachements' : function(){
		if(this.get("attachments"))
			return this.get("attachments").length > 0;
	},

	'hasschedule' : function(){
		if(this.get("schedule"))
			return Object.getOwnPropertyNames(this.get("schedule")).length > 0;
	},

	/*'hascontent' : function(){
		return Object.getOwnPropertyNames(this.get("body")).length > 0;
	}*/
});


