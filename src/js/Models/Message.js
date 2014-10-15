define(
	['backbone',  'Collections/Actions', 'Collections/Notes', /*'Collections/Notifications', */, 
	 'Views/ActionParameters', 'Utilities/Utils'],
	
	function (Backbone, Actions, Notes, ActionParametersView, Utils)
	{	
		var Message = Backbone.Model.extend({
	
			typestring : "messages",
			limits : {'twitter' :140, 'linkedin' : 700},

			/*
			*
			* setvariation() 	: Update exiting or generate new variation
			* getvartiation()	: Get some variation data
			* removevarimg()	: Removes an image from a variation
			*
			*/

			initialize : function ()
			{	
				// MIGRATION -> was looping with notifications/notification	
				var Notifications = require('Collections/Notifications');
				
				// Ping
				//this.on('outdated', this.fetch);

				if (typeof (this.attributes.parent) != 'undefined')
				{
					this.set ('parentmodel', new Message (this.attributes.parent));
					this.get ('parentmodel').trigger ('change');
				}
				
				// Actions
				this.actions = new Actions(false, {parent: this});
				this.notes 	= new Notes(false, {parent: this});

				this.listenToOnce(this.notes, 'add', this.updatecollection.bind(this, this.notes));

				// Children
				this.notifications = new Notifications(false, {parent: this});
			},
			
			url : function (params)
		    {
		        if(!this.id){
		        	params = this.parameters;
		        	if(this.endpoint){
		        		return Cloudwalkers.Session.api + '/accounts/' + Cloudwalkers.Session.getAccount().id + "/" + this.typestring + this.endpoint + params;
		        	} else {
		        		return Cloudwalkers.Session.api + '/accounts/' + Cloudwalkers.Session.getAccount().id + "/" + this.typestring;
		        	}
		        }
		        	
		        
		        return this.endpoint?
		        
		        	Cloudwalkers.Session.api + '/' + this.typestring + '/' + this.id + this.endpoint :
		        	Cloudwalkers.Session.api + '/' + this.typestring + '/' + this.id;
		    },

			parse : function(response)
			{	
				// A new object
				if (typeof response == "number") return {id: response};
				
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
			
			stamp : function(params)
			{
				if (!params) params = {id: this.id};
				
				params.stamp = Math.round(new Date().getTime() *0.001)
				
				Store.set(this.typestring, params);
				
				return this;
			},
			
			sync : function (method, model, options)
			{
				this.endpoint = (options.endpoint)? "/" + options.endpoint: false;
				
				// Hack
				if(method == "update") return false;
				
				return Backbone.sync(method, model, options);
			},

			loaded : function(param)
			{
				return this.get(param? param: "objectType") !== undefined;
			},
			
			updatecollection : function(collection)
			{
				collection.updated = true;
			},

			updateactions : function(response)
			{
				var attributes = response.get("actionresult")? response.get("actionresult").models.update[0]: null;

				if(attributes)
					$.extend(this.attributes, attributes);
			},

			/* Validations */
			validateCustom : function (ignorelist)
			{	
				var error;

				//Check for any content	
				if(!this.hascontent() && $.inArray('content', ignorelist) < 0)
					return this.translateString("you_need_a_bit_of_content");

				if(!this.validatecontent())	
					return this.translateString("one_or_more_networks_exceed_the_character_limit");

				if(!this.get("streams").length && $.inArray('streams', ignorelist) < 0)
					return this.translateString("please_select_a_network_first");
			
				if((error = this.validateschedules()) && $.inArray('schedule', ignorelist) < 0)
					return error;
			},

			validateschedules : function()
			{
				var error;

				//Check in default
				error = this.validateschedule(this.get("schedule"));
				
				if(error)	return error;
				
				//Check in variations
				$.each(this.get("variations"), function(n, variation)
				{
					error = this.validateschedule(variation.schedule);
					
					if(error)	return false;	//Found error
					else		return true;	

				}.bind(this));
				
				return error;
			},

			validateschedule : function(schedule)
			{	
				if(!schedule)	return false;

				var scheduledate = schedule.date || null;
				var repeatuntil = schedule.repeat? schedule.repeat.until: null;

				if(scheduledate && scheduledate < moment().unix())
					return "One or more streams are scheduled into the past."

				if(scheduledate && repeatuntil && repeatuntil < scheduledate)
					return "One or more streams have the repeat date happening before the scheduled date."

				if(!scheduledate && repeatuntil && repeatuntil < moment().unix())
					return "One or more streams have the repeat date set to the past."

				return false;
			},

			hascontent : function()
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

			validatecontent : function()
			{					
				//Hardcoded smallest limit. Get it dinamically
				var smallestlimit = 140;
				var result = 1;
				var variation;	
				
				// Variations
				if(this.get("streams") && this.get("streams").length){
					$.each(this.get("streams"), function(n, stream)
					{	
						var network = Cloudwalkers.Session.getStream(stream).get("network");
						var limit = network.limitations['max-length']? network.limitations['max-length'].limit : null;
						
						if(!limit)	return true;
						
						variation = this.getvariation(stream)

						//Find the variation with that id, if not, use the default's limit
						if(variation){
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
			
			sanitizepost : function ()
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
			
			cloneSanitized : function (keepstreams)
			{	
				var model = new Message();
				$.extend(true, model, this);
				//var model = this.clone();
			
				if (model.attributes.date)				delete model.attributes.date;
				if (model.attributes.from)				delete model.attributes.from;

				if (model.attributes.stream && !keepstreams)
					delete model.attributes.stream;
				
				if(!keepstreams)
					model.attributes.streams = [];
				
				// A clone shouldn't have an id
				if(model.id)
				{
					delete model.id; delete model.attributes.id;
				}
				
				return model;	
			},

			checkloaded : function (response)
			{
				var model = this;
				if(response.objectType) setTimeout(function(){ model.trigger('loaded'); }, 1, this);
			},
			
			filterData : function (response)
			{	
				//In case it's a notification
				if(response.message && response.message.body)
					response = response.message;

				// Set up filtered data
				var filtered = {};
				var values = ["id", "objectType", "actiontokens", "subject", "body", "date", "engagement", "from", "read", "stream", "streams", "attachments", "parent", "statistics", "stats", "status", "canHaveChildren", "children_count", "schedule", "variations", "url"]
				
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
				filtered.body.intro = response.body.plaintext? response.body.plaintext.substr(0, 72): " ";
				
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
			generateintro : function()
			{
				if(this.get("body") && !this.get("body").intro)
					this.attributes.body.intro = this.get("body").plaintext.substr(0, 72);

			},

			filterActions : function ()
			{	
				if(!this.get("actiontokens")) return [];

				var tokens = this.actions.rendertokens();	
				
				tokens.map(function(t){
						
					if(t.token == 'note' && this.notes.updated)
						t.value = this.notes.length;
					
					return t;

				}.bind(this))
				
				return tokens;
			},
			
			filterCalReadable : function ()
			{
				var loaded = (this.get("objectType"));
				var media =  loaded && this.get("media") != "reorder";
				
				if(!this.calNode) this.calNode = {id: this.id};
				
				// Calendar node elements
				
				if(this.get("schedule")){
					this.calNode.start = loaded? $.fullCalendar.moment(this.get("scheduledate")): $.fullCalendar.moment();
				} else {
					this.calNode.start = loaded? $.fullCalendar.moment(this.get("date")): $.fullCalendar.moment(); /*new Date(this.get("date")): new Date()*/
				}
				
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
			
			attach : function (attach, index, streamid)
			{	
				var attachments = this.get("attachments") || [];
				
				var response = (index && attachments[index])?	$.extend(attachments[index], attach) :
																attachments.push(attach);
					
				this.set({attachments: attachments});
				
				return response;
			},
			
			unattach : function (index)
			{
				var attachments = this.get("attachments") || [];
				
				// Remove attachment
				attachments.splice(index, 1);
			},
			
			addcampaign : function () {},
			
			/*Variation functions*/

			setvariation : function(stream, key, value)
			{	
				var attachments;
				var variations = this.get("variations") || [];
				var variation = variations.filter(function(el){ if(el.stream == stream) return el; });

				if(variation.length === 0)	//Add new variation
				{ 	
					variation = {'stream' : stream};

					if(key == 'image' || key == 'link'){
						attachments = [value];
						variation.attachments = attachments;
					}else if(key){
						variation[key] = value;
					}

					variations.push(variation);
				}
				else					//Update variation
				{	
					variation = variation[0];
					if(key == 'image' || key == 'link'){
						attachments = variation.attachments || [];
						if(attachments.length === 0 && key == 'image'){
							attachments.push(value);
							variation.attachments = attachments;					
						}else if(key == 'image'){
							attachments.push(value);
						}else{ 
							var link = attachments.filter(function(el){ if(el.type == 'link') return el; });
							if(link.length > 0)	link[0].url = value.url;
							else if(attachments.length !== 0)	variation.attachments.push(value);
							else								variation.attachments = [value];
						}
					}else{
						variation[key] = value;
					}	
				}

				return variation;

			},
			
			getvariation : function (stream, key)
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
			
			original : function (stream, key, input)
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
			
			removevariation : function(streamid)
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

			removevarimg : function(streamid, image){
				//If image is an object it means it's meant to exclude

				var variation = this.getvariation(streamid);
				var attachments = variation? variation.attachments : [];

				if(_.isNumber(image)){	// It's a default iamge
					this.addexclude(streamid, image)			
				}else{					// It's a variation image
					for (var n in attachments){
						if(attachments[n].type == 'image' && attachments[n].name == image) 
							attachments.splice(n,1);
					}
				}
			},

			addexclude : function(streamid, index){

				var variation = this.getvariation(streamid) || this.setvariation(streamid);
				var excludes = variation.excludes;

				if(variation.excludes)
					variation.excludes.attachments.push(index);
				else
					variation.excludes = {attachments : [index]};
			},

			checkexclude : function(streamid, index){

				var variation = this.getvariation(streamid);
				var excludes;

				if(!variation)	return false;
				else			excludes = variation.excludes;

				if(excludes){
					for (var n in excludes.attachments){
						if(excludes.attachments[n] == index)
							return true;
					}
				}

				//There are no excludes
				return false;

			},

			location : function ()
			{
				return "#";
			},

			getActionIcon : function (action)
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


			deleteMessage : function ()
			{	
				// Repeat or skip?
				if (this.repeat ().repeat)
				{
					Cloudwalkers.RootView.dialog 
					(
						this.translateString('are_you_sure_you_want_to_remove_this_message'), 
						[
							{
								'label' : this.translateString('skip_once'),
								'description' : this.translateString('message_will_be_skipped_once'),
								'token' : 'skip'
							},
							{
								'label' : this.translateString('delete_forever'),
								'description' : this.translateString('message_will_never_be_repeated'),
								'token' : 'remove'
							}
						],

						this.deletetype.bind(this)
					);
				}
				else
				{
					Cloudwalkers.RootView.confirm 
					(
						this.translateString('are_you_sure_you_want_to_remove_this_message'), 
						function () 
						{
		                    this.destroy ({success: this.destroysuccess.bind(this)});
						}.bind(this)
					);
				}
			},

			deletetype : function(response)
			{	
				var endpoint;

				if(response.token == 'skip')
					this.save({trigger: Math.random()}, {patch: true, endpoint: 'skip', success: this.skipwatcher.bind(this)});

				if(response.token == 'remove')
					this.destroy({wait: true, success: this.destroysuccess.bind(this)});
			},

			destroysuccess : function()
			{
				//trigger destroy
				this.trigger ("destroyed", this, this.collection);
								
				//Keep the old code
				this.trigger ("destroy", this, this.collection);
			},

			skipwatcher : function(response)
			{
				if(response.get("status") == 'REMOVED')
					this.destroysuccess();
			},

			humandate : function (entry)
			{
				var date = (new Date(entry? entry: this.get ('date')));
				
				return Utils.longdate (date);
			},

			shortdate : function ()
			{
				var date = this.date ();
				return Utils.shortdate (date);
			},

			time : function ()
			{
				var date = this.date ();
				return Utils.time (date);
			},

			date : function ()
			{
				return (new Date(this.get ('date')));
			},

			getAction : function (token)
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
			act : function (action, parameters, callback)
			{
				
				Cloudwalkers.RootView.growl (action.name, this.translateString("the") + " " + action.token + " " + this.translateString("is_planned_with_success"));
				
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
		                    self.trigger ("destroy", self, self.collection);
		                    self.trigger ("destroyed", self, self.collection);
						}
						else
						{
							self.set (objData.message);
						}

		                callback ();
					}
				});
			},

			scheduledate : function (showtext)
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

			calculateIntervalFromSeconds : function (intervalSeconds)
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
					if ((intervalSeconds % intervalunits[i].value) === 0)
					{
						out.interval = Math.round (intervalSeconds / intervalunits[i].value);
						out.unit = intervalunits[i].unit;

						return out;
					}
				}

				// Then take the closest, most detailed value
				for (var j = 0; j < intervalunits.length; j ++)
				{
					if ((intervalSeconds / intervalunits[j].value) < 72)
					{
						out.interval = Math.round (intervalSeconds / intervalunits[j].value);
						out.unit = intervalunits[j].unit;

						return out;
					}
				}

				return false;
			},

			repeat : function ()
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

			getStream : function ()
			{
				if (this.get ('stream'))
				{
					return Cloudwalkers.Session.getAccount().streams.get(this.get ('stream'));
				}
				return null;
			},

			getProcessedAttachments : function ()
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
							if (this.attributes.body.plaintext == null || this.attributes.body.plaintext.indexOf (attachment.url) === -1)
							
								// It is not, add it to the attachments.
								attachments.push (attachment);
						}
						else
						{
							attachments.push (attachment);
						}
					}
				}

				return attachments;
			},

			hasAttachement : function(type){

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

			setRead : function ()
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

			shortBody : function ()
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

			messageAction : function (action)
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
							var view = new ActionParametersView ({
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

			hasattachements : function(){
				if(this.get("attachments"))
					return this.get("attachments").length > 0;
			},

			hasschedule : function(){
				if(this.get("schedule"))
					return Object.getOwnPropertyNames(this.get("schedule")).length > 0;
			},

			hasnotes : function()
			{
				var stats = this.get("stats");
				var notes;

				if(stats)
					return stats.notes
			},

			translateString : function(translatedata)
			{	
				// Translate String
				return Cloudwalkers.Polyglot.translate(translatedata);
			}
		});
		
		return Message;
});
