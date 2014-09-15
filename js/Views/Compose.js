/**
 *	Compose
 *	probably the most important view.
 *
**/

Cloudwalkers.Views.Compose = Backbone.View.extend({
	
	'id' : "compose",
	'className' : "modal hide",
	'type' : "post",
	'network' : "default",
	'actionstreams': [],
	'actionview': false,
	'minutestep': 5,
	'maxfilesize' : 3000000,
	'besttimes' : {},
	
	'titles' : {
		'post' :	"Write Post",
		'edit' :	"Edit Post",
		'share' :	"Share message",
		'comment' :	"Write Comment",
		'reply' :	"Write Reply",
		'dm' :		"Write Message",
		'retweet' :	"Retweet",
		'like' :	"Like",
		'favourite': "Favourite",
		'plusone':	"Plus one",
		'default' : "Compose"
	},
	'translated_titles' : {
	},

	'limitations' : {

	},
	
	'options' : {
		false :			["editor","images","campaign","schedule","repeat"],
		'twitter' :		["editor","images","campaign","schedule","repeat"],
		'facebook' :	["editor","fullbody","images","campaign","schedule","repeat"],
		'linkedin' :	["editor","fullbody","images","campaign","schedule","repeat"],
		'tumblr' :		["subject","editor","fullbody","images","campaign","schedule","repeat"],
		'google-plus' :	["editor","fullbody","images","campaign","schedule","repeat"],
		'youtube' :		["subject","editor","fullbody","video","campaign","schedule","repeat"],
		'blog' :		["subject","editor","fullbody","images","campaign","schedule","repeat"],
		'group' :		["editor","images","campaign","schedule","repeat"],
		'mobile-phone':	["editor","schedule","repeat"],
		
		// Actions
		'comment' : ["editor", "canned"],
		'reply' : 	["editor", "canned"],
		'dm' : 		["editor", "canned"],
		'resend' : 	["editor", "canned"],
		'retweet' : ["icon"],
		'like' : 	["icon"],
		'favorite' :["icon"],
		'plusone' : ["icon"]
	},
	
	'icons' : {
		'retweet' : 'retweet', 'like' : 'thumbs-up', 'favorite' : 'star', 'plusone' : 'plus-square'
	},
	
	'events' : {
		'click li[data-streams]' : 'togglestreams',
		'click .stream-tabs div' : 'togglestream',
		'click [data-toggle]' : 'toggleoption',
		
		'keyup [data-option] input' : 'monitor',
		'change [data-option] #compose-content' : 'monitor',
		'keyup [data-option] #compose-content' : 'monitor',
		'paste [data-option] #compose-content' : 'triggerpaste',
		'blur [data-option] #compose-content' : 'triggerblur',
		
		'click .add-file' : 'addfile',
		'click .add-snapshot' : 'addsnapshot',
		'change [data-collapsable=images] input' : 'listentofiles',
		'click .photo-booth' : 'listentobooth',
		'click li.images-thumb' : 'removefile',
		
		'blur [data-collapsable=link] input' : 'listentolink',
		
		'change select.campaign-list' : 'listentocampaign',
		'change select.canned-list' : 'listentocanned',
		'blur .campaign-name' : 'listentoaddcampaign',
		'click .add-campaign' : 'toggleaddcampaign',
		
		'click .schedule-entry' : 'monitorschedule',
		'blur [data-collapsable=schedule] input, [data-collapsable=repeat] input'  : 'monitorschedule',
		
		//'change [data-collapsable=schedule] select, [data-collapsable=repeat] select' : 'monitorschedule',
		//'change [data-collapsable=schedule] #delay-time' : 'monitorschedule',
		//'changeDate input' : 'monitorschedule',
		//'change #delay-select, [data-collapsable=repeat] select' : 'monitorschedule',
		'change .schedule-group select' : 'monitorschedule',
		'click .schedule-group input' : 'monitorschedule',

		'click [data-set=on] .btn-white' : 'togglebesttime',

		'click .end-preview' : 'endpreview',
		'click #previewbtn' : 'preview',
		'click #save' : 'save',
		'click #post' : 'post',
		'click #action, [data-type=icon] > i' : 'postaction'
	},

	/*
	* togglesubcontent()	: Toggles between streams && activates their specific contents (images, links & content)
	*
	* listentofiles()		: Whenever a file is added
	* addimage()			: Adds an image to a variation or to default, and to all the UI elements
	* summarizeimage()		: Adds an image to the summary list
	* listimage()			: Adds an image to the picture list
	* updateimages()		: Updates all the images scope & interface according to context (network or default)
	* removefile()			: Removes a file from the interface & from the scope
	*/
	
	'initialize' : function (options)
	{
		// Parameters
		if(options) $.extend(this, options);
		
		// Available Streams
		this.streams = Cloudwalkers.Session.getChannel ('outgoing').streams;
		
		// Proccess actions
		if(this.action) this.type = this.action.get("token");
		
		if(this.action && this.type == "share")
		{
			// Clone, but filter out unwanted data.
			this.draft = this.reference.cloneSanitized();
			this.draft.attributes.variations = [];
			
		} else if(this.action && this.type == "resend")
		{
			// Clone, but filter out unwanted data.
			this.draft = this.reference.cloneSanitized(true);
			this.draft.attributes.variations = [];

			var streams = this.draft.get("streams");

			for(n in streams)
				streams[n] = streams[n].id? streams[n].id: streams[n];
			
		} else if(this.action && this.reference)
		{	
			// Get action dynamics
			this.action.parent = this.reference;
			this.actionstreams = [];
			this.actionview = true;
			
			this.listenTo(this.action, "change", this.editstreams)
			this.action.fetch();
					
		} else if(this.model)
		{	
			this.type = "edit";
			this.state = 'loading';
			this.draft = this.model.clone();

			if (this.draft.get("streams").length)
				this.initstream = this.draft.get("streams")[0].id;
			
			// Get Draft variations
			this.draft.fetch({endpoint: "original", success: this.original.bind(this)});
		}
		
		// Draft message
		if(!this.draft)
		{	
			// The draft message
			this.draft = new Cloudwalkers.Models.Message({"variations": [], "attachments": [], "streams": [], "body": {}, "schedule": {}});
			// Listen to validation
			this.listenTo(this.draft, "invalid", this.invalid);
		}

		this.loadmylisteners();

		//Twitter reply
		//This is a hack indeed...What better way to make this?
		if(this.type == 'reply' && this.reference.get("networktoken") == 'twitter'){
			var parameters = this.action.parameters[0];
			this.draft.set('body', { html : Mustache.render(parameters.value, {from: this.reference.get("from")[0]})});
		}
		
		this.censurecompose();

		// Translate Titles
		this.translateTitles();	

	},

	'loadmylisteners' : function()
	{
		this.loadListeners(this.draft, ['request', 'sync'], true);
	},

	'censurecompose' : function()
	{
		// Block on global level
		var blocklist = [];

		var globalcheck = {
			'MESSAGE_OUT_ATTACHMENTS' 	: ['images'],
			'MESSAGE_OUT_SCHEDULE'		: ['schedule'],
			'MESSAGE_OUT_REPEAT'		: ['repeat'],
			'CAMPAIGN_CREATE'			: ['campaign']
		}

		// Create block functionality array
		$.each(globalcheck, function(permission, features)
		{	
			if(!Cloudwalkers.Session.isAuthorized(permission))
				blocklist = _.union(blocklist, features);			
		})
		
		// Apply blockage
		$.each(this.options, function(token, features)
		{	
			this.options[token] = _.difference(features, blocklist);
		}.bind(this))
		
	},
	
	'original' : function ()
	{	
		var variations;

		var schedule = this.draft.get("schedule");

		// Convert dates to unix
		if (schedule && schedule.date)	schedule.date = moment(schedule.date).unix();
		if (schedule && schedule.repeat && schedule.repeat.until)	schedule.repeat.until = moment(schedule.repeat.until).unix();

		if (variations = this.draft.get("variations"))
		{
			$.each(variations, function(i, variation)
			{
				if(variation.schedule && variation.schedule.date)
					variation.schedule.date = moment(variation.schedule.date).unix();

				if(variation.schedule && !variation.schedule.date)
					variation.schedule.now = true;

				if(variation.schedule && variation.schedule.repeat && variation.schedule.repeat.until)
					variation.schedule.repeat.until = moment(variation.schedule.repeat.until).unix();

				//Hack to force only one image
				if(variation.attachments && variation.attachments.length)
					variation.attachments = [variation.attachments.pop()]
				
			})
		}

		this.state = 'loaded';

		// Render for editor
		this.render();
		
		// Render selected tab
		this.$el.find("[data-stream=" + this.initstream + "]").click();

	},

	'render' : function ()
	{	
		// Collect data
		var params ={
			streams:	this.actionstreams.length? this.actionstreams: this.streams.models,			
			title:		this.translated_titles[this.type],
			campaigns:	Cloudwalkers.Session.getAccount().get("campaigns"),
			canned: 	this.option("canned")? Cloudwalkers.Session.getCannedResponses().models: null,
			actionview: this.actionview? this.type: false,
		};

		
		//Only add loading state when editing
		if(this.type == "edit")	params.type = this.type;

		//Mustache Translate Render
		this.mustacheTranslateRender(params);

		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(params);
		
		// Create view
		var view = Mustache.render(Templates.compose, params);

		this.$el.html (view);		
		
		if(this.state == 'loading')	this.disablefooter();

		// Append Editor
		if(!this.editor) this.editor = new Cloudwalkers.Views.Editor({draft: this.draft, parent: this});
		this.$el.find("[data-type=post]").append(this.editor.render().el);

		// Listen to editor triggers
		this.listenTo(this.editor, "imageadded", this.listentourlfiles);
		this.listenTo(this.editor, "change:content", this.monitor);

		// Add Chosen
		this.$el.find(".campaign-list").chosen({width: "50%"});
		this.$el.find(".canned-list").chosen({width: "100%"});
		
		// Add Datepicker
		this.$el.find('#delay-date, #repeat-until').datepicker({format: 'dd-mm-yyyy', weekStart: 1});

		// Add Datepicker and Timepicker
		this.datepicker = this.$el.find('#delay-date, #repeat-until').datepicker({format: 'dd-mm-yyyy', orientation: "auto"});
		this.timepicker = this.$el.find('#delay-time').timepicker({template: 'dropdown', minuteStep:this.minutestep, showMeridian: false});
		//this.timepicker = this.$el.find('#delay-time').timepicker({template: 'dropdown', minuteStep:5, showMeridian: false});

		//Timechange triggers the draft update
		this.timepicker.on('show.timepicker', function (e) { this.monitorschedule(e);}.bind(this));
		this.timepicker.on('hide.timepicker', function (e) { this.monitorschedule(e);}.bind(this));
		
		//this.$container = this.$el.find ('.modal-footer');
		this.$loadercontainer = this.$el.find ('.modal-footer');

		//Remove loading state with nice transition
		if(this.state == 'loaded')	this.$el.find('.modal-body').addClass('loaded');

		//Update the content with default/variation/draft data
		if(this.draft.get("variations") !== undefined || this.type == 'share')
		{
			this.defaultstreams();
			this.togglesubcontent();
			this.trigger("rendered");
		}
		
		return this;
	},
	
	'option' : function (token)
	{	
		var options = this.options[this.type];
		
		return options? options.indexOf(token) >= 0: false; 
	},

	'restarttime' : function()
 	{	
 		var minutes = this.minutestep * Math.ceil(moment().minute() / this.minutestep);
 		var hours = moment().hour();
 		
 		this.$el.find('#delay-time').timepicker('setTime', hours +':'+ minutes);
 	},

 	'restartdate' : function()
 	{	
 		$(this.datepicker.get(0)).datepicker('update', moment.unix().format("DD/MM/YYYY"));	
 	},
	
	'editstreams' : function (model)
	{
		var action = model.get("actions").filter(function(act) { if(act.token == model.token) return act.streams })[0];
		
		this.actionstreams = [];
		for(n in action.streams){
			if(Cloudwalkers.Session.getStream(action.streams[n]))
				this.actionstreams.push(Cloudwalkers.Session.getStream(action.streams[n]));		
		} 
		
		// Render streamlist and activate first stream
		this.render();
		this.$el.find("aside li").eq(0).click();
	},
	
	'monitor' : function (e)
	{	
		if(!e)
			var target = this.$el.find('#compose-content');
		else
			var target = $(e.target); 

		this.editor.trigger('change:editor', e);
		
		var streamid = this.activestream ? this.activestream.id : false;
		var content = target.html() || target.val();
		var plaincontent = target.text();
		var object = target.attr("data-option");

		if(object == 'body')
			content = {'html' : content, 'plaintext' : plaincontent};
		
		//if there is already a variation insert the text into it, otherwise add it
		if(streamid)	this.draft.setvariation(streamid, object, content);
		else 			this.draft.set(object, content);
	},

	'updatelimitations' : function(streamid, update)
	{	
		if(!streamid){
			this.editor.trigger('update:limit', 0);
			return;
		}

		var stream = Cloudwalkers.Session.getStream(streamid);
		var limitations = stream.getlimitations();
		var numimages = 0;
		
		//Add all variation images
		if(streamid && this.draft.getvariation(streamid,'image')){
			var imgs = this.draft.getvariation(streamid, 'image');
			
			$.each(imgs, function(i, image){
				numimages += this.draft.getvariation(streamid, 'image').length;
			}.bind(this));
		}
		// Temporary: prevent multiple adds
		// Add defaults (if ther wasn't any variation image already added)
		else if(this.draft.get("attachments")){
			imgs = this.draft.get("attachments").filter(function(el){ if(el.type == "image") return el; });
			$.each(imgs, function(i, image){

				//The image should be excluded
				//if(streamid && this.draft.checkexclude(streamid, i))
				if(streamid && this.draft.checkexclude(streamid, i))
					return true; //Continue

				numimages ++;

			}.bind(this));
		}

		if(numimages && limitations['picture-url-length'])
			this.editor.trigger('update:limit', limitations['picture-url-length'].limit, update); //Hack for only 1 image max
			//this.editor.trigger('update:limit', numimages * limitations['picture-url-length'].limit, update);
		else
			this.editor.trigger('update:limit', 0, update);
	},
	
	'toggleoption' : function (e)
	{	
		var $btn = $(e.currentTarget);
		var option = $btn.data("toggle");
		var collapsable = $btn.parent().toggleClass("collapsed");
		
		// Summarize
		if(collapsable.hasClass("collapsed") && this["summarize" + option])
		
			this["summarize" + option]();

		//Hack -> refresh ui to clean black line glitch
		this.$el.addClass('hidden');
		this.$el.removeClass('hidden')
	},
	
	'closealloptions' : function ()
	{
		// All open collapsables
		var collapsibles = this.$el.find("[data-collapsable]")
			.not(".collapsed")
			.addClass("collapsed")
			.each( function(n, collapsible)
			{
				this["summarize" + $(collapsible).data("collapsable")]();
				
			}.bind(this));
	},

	'defaultstreams' : function()
	{
		var streams = this.draft.get("streams");
		
		if(streams) streams.forEach(function (el)
		{	
			this.$el.find("li[data-streams=" + (el.id? el.id : el) + "]").click();
		
		}.bind(this));
		
		/*var variations = this.draft.get("variations");
		if(!variations)	return;
		$.each(variations, function(i, variation){
			this.$el.find("li[data-streams="+variation.stream+"]").click();
		}.bind(this));*/
	},
	
	'addstreamtab' : function (stream)
	{
		this.$el.find(".tabs-container > section")
		
		.append('<div class="stream-tab" data-stream="'+ stream.id +'"><i class="icon-'+ stream.get("network").icon +'"></i> '+ stream.get("defaultname") +'</div>');
	},
	
	'togglestreams' : function (e)
	{
		var $tabs = this.$el.find(".tabs-container > section");
		var $btn = $(e.currentTarget);
		var id = $btn.data("streams");

		var stream = Cloudwalkers.Session.getStream(id);
		var streamids = this.draft.get("streams") || [];
		
		// Switch buttons and tabs
		if(!$btn.hasClass("active"))
		{
			this.addstreamtab(stream);
			
			// Add to draft
			if(streamids.indexOf(id) < 0) streamids.push(id);
			
		} else {
			this.$el.find("[data-stream="+ id +"]").remove();
			
			// Shift active stream
			if(!$tabs.find("div.active").size())
			{
				var activediv = this.$el.find(".stream-tabs div").eq(0);
				var activeid = activediv.data('stream');
				
				activediv.addClass('active');

				// Trigger update (necessary?)
				this.trigger("update:streams", streamids);
			}
			
			// Remove from draft
			streamids.splice(streamids.indexOf(id), 1);

			//Remove variations
			this.draft.removevariation(id);
		}
		
		$btn.toggleClass("inactive active");

		// Is the scrolbar visible?
		if(this.isscrolling())
			this.$el.find('.stream-tabs').addClass('scrolling');
		else
			this.$el.find('.stream-tabs').removeClass('scrolling');			
	},
	
	'togglestream' : function (e)
	{	
	
		var $btn = $(e.currentTarget);
		var id = $btn.data("stream");
		var stream = id? Cloudwalkers.Session.getStream(id): false;

		this.$el.find(".stream-tabs div.active").removeClass('active social-icon-colors');
		
		$btn.addClass('active social-icon-colors');
		
		// Toggle subcontent
		// Trigger update
		

		this.toggleschedentry("[data-set=now], [data-set=in]").toggleschedentry("[data-set=on]", true);
			//$("[data-set=on] input").val("");
		this.togglesubcontent(stream);
	},
	
	'togglesubcontent' : function (stream)
	{ 	//console.log(this.streams, this.draft.get("variations"));
		this.activestream = stream;
	
		if(this.actionview)
		{
			var options = this.options[this.type];
			var network = false;
			
		} else {
			
			// Get the right network
			var network = stream? stream.get("network").token: false;
			var icon = stream? stream.get('network').icon: 'default';
			var options = this.options[network];
			var id = stream? stream.id: false;	
		}
		
		this.network = network;

		// Enable/disable preview
		this.$el.find("#previewbtn").attr("disabled", this.network? false: true);
		//var input = this.getinput(network, id);
		
		// Add network icon (fields)
		if(!this.$el.find(".modal-body").hasClass('loading')){
			this.$el.find(".modal-body").get(0).className = "modal-body";
			this.$el.find(".modal-body").addClass(icon + "-theme");
		}
		

		// Subject
		if (options.indexOf("subject") >= 0)	this.$el.find("[data-option=subject].hidden").removeClass("hidden");
		else									this.$el.find("[data-option=subject]").addClass("hidden");

		// Editor
		if (options.indexOf("editor") >= 0)		this.$el.find("#editor.hidden").removeClass("hidden");
		else									this.$el.find("#editor").addClass("hidden");

		// Icon
		if (options.indexOf("canned") >= 0)		this.$el.find("[data-type=canned]").removeClass("hidden");
		else									this.$el.find("[data-type=canned]").addClass("hidden");
		
		// Full Body
		if (options.indexOf("fullbody") >= 0)	this.$el.find("[data-option=limit]").addClass("hidden");
		else									this.$el.find("[data-option=limit].hidden").removeClass("hidden");
		
		// Icon
		if (options.indexOf("icon") >= 0)		this.$el.find("[data-type=icon]").removeClass("hidden").find("i").get(0).className = "icon-" + this.icons[this.type];
		else									this.$el.find("[data-type=icon]").addClass("hidden");
		
		// Toggle options
		this.updateschedule();

		this.closealloptions();
		
		this.toggleimages(options.indexOf("images") >= 0, options.indexOf("multiple") >= 0);
		
		this.togglecampaign(options.indexOf("campaign") >= 0);
		
		this.toggleschedule(options.indexOf("schedule") >= 0);
		
		this.togglerepeat(options.indexOf("repeat") >= 0);

		this.updatesubject();

		this.updateimages();

		this.summarizeschedule();

		this.updatelimitations(stream? stream.id: null)

		// Update content, images and links
		this.trigger("update:stream", {id : id, data : this.draft.getvariation(id, 'body')});
	},

	'updatesubject' : function()
	{	
		var streamid = this.activestream ? this.activestream.id : false;
		var subjectinput = this.$el.find("[data-option=subject] > input").empty();
		var subject;
		
		if(streamid && this.draft.getvariation(streamid, 'subject'))
			subject = this.draft.getvariation(streamid, 'subject');
		else if(this.draft.get("subject"))
			subject = this.draft.get("subject") || "";

		subjectinput.val(subject);
	},
		
	/**
	 *	Options: Images
	**/

	'addfile' : function (e) { $("[data-collapsable=images] input").click(); },
	
	// Add the objects to variation or default
	'listentofiles' : function (e)
	{	
		// Find and iterate the file
		var streamid = this.activestream ? this.activestream.id : false;
		var files = e.target.files;
		var draft = this.draft;
		var self = this;

		for (var i = 0, f; f = files[i]; i++)
		{	
			// Check type
			if (!f.type.match(/^image\/(gif|jpg|jpeg|png)$/i))
			{
				this.showerror('Upload failed: ', 'only .jpg .jpeg .png and .gif extensions supported');
				continue;
			} 
			if (f.size > this.maxfilesize)
			{	
				this.showerror('Upload failed: ', 'image size exceeds 3mb');
				continue;
			}
			var reader = new FileReader();
			
			reader.onload = (function(file)
			{	return function(e)
				{	
					self.addimage({type: 'image', data: e.target.result, name: file.name});
					self.updatelimitations(streamid, true);
					self.editor.trigger("change:charlength");

			}})(f);
			
			reader.readAsDataURL(f);
			//Upload only one image
			break;
		}	
	},

	'listentourlfiles' : function(image)
	{	
		var streamid = this.activestream ? this.activestream.id : false;
		var numimages = 0;
		
		if(streamid && this.draft.getvariation(streamid,'image'))
			numimages += this.draft.getvariation(streamid, 'image').length;
		
		if(this.draft.get("attachments")){
			imgs = this.draft.get("attachments").filter(function(el){ if(el.type == "image") return el; });
			numimages += imgs.length
		}
		
		if(!numimages)	this.addimage(image);
	},

	// Add to the variation or the default
	'addimage' : function(image){
		var streamid = this.activestream ? this.activestream.id : false;

		if(streamid)
			this.draft.setvariation(streamid, 'image', image);
		else
			this.draft.attach(image);
					
		this.summarizeimages(image);
		this.listimage(image);

		//Allow only one image
		this.disableimages();
	},

	//Add to summary
	'summarizeimages' : function(image)
	{
		if(!image)
			return;

		var url = image.data || image.url;
		var summary = this.$el.find("[data-collapsable=images] .summary");

		$("<li></li>").prependTo(summary).attr("data-filename", image.name).css('background-image', "url(" + url + ")");
	},

	//Add to UI
	'listimage' : function(image)
	{	
		var url = image.data || image.url;
		var draft = this.draft;
		var picturescontainer = this.$el.find("ul.pictures-container");
		
		// Add to view
		var snapshot = $("<li></li>").prependTo(picturescontainer).attr("data-filename", image.name).addClass('images-thumb').css('background-image', "url(" + url + ")");
	},

	//Adds images to the UI
	'updateimages' : function ()
	{	
		var streamid = this.activestream ? this.activestream.id : false;
		var summary = this.$el.find("[data-collapsable=images] .summary").empty();
		var picturescontainer = this.$el.find("ul.pictures-container").empty();
		var snapscontainer = this.$el.find("ul.snapshots-container").empty();
		var images = [];

		//Add all variation images
		if(streamid && this.draft.getvariation(streamid,'image') && this.draft.getvariation(streamid,'image').length){
			var imgs = this.draft.getvariation(streamid, 'image');
			
			$.each(imgs, function(i, image){
				this.summarizeimages(image);
				this.listimage(image);
			}.bind(this));
		}
		// Temporary: prevent multiple adds
		// Add defaults (if ther wasn't any variation image already added)
		else if(this.draft.get("attachments")){
			imgs = this.draft.get("attachments").filter(function(el){ if(el.type == "image") return el; });
			$.each(imgs, function(i, image){

				//The image should be excluded
				//if(streamid && this.draft.checkexclude(streamid, i))
				if(streamid && this.draft.checkexclude(streamid, i))
					return true; //Continue

				this.summarizeimages(image);
				this.listimage(image);

			}.bind(this));
		}

		//Prevent more than one image
		if(picturescontainer.find('li.images-thumb').length == 0)
			this.enableimages();			

	},

	'toggleimages' : function(visible, multiple)
	{	
		// Open options
		var collapsable = this.$el.find("[data-collapsable=images]")[visible? "removeClass": "addClass"]("hidden");
	},
		
	'addsnapshot' : function (e)
	{	
		// Show Photo Booth
		this.$el.find(".photo-booth").removeClass("hidden");
		
		if(!this.media)
			this.media = new MediaClass({video: true});
		
		this.media.start();
	},
	
	'listentobooth' : function ()
	{	
		// Emergency Break
		if(!this.media) return;
		
		var result = this.media.snapshot();
		var snapshot = $("<li></li>").prependTo("ul.snapshots-container").attr("data-filename", moment().unix()).addClass('images-thumb').css('background-image', "url(" + result + ")");
		
		//Remove add button
		this.disableimages();

		this.draft.attach({type: 'image', data: result, name: moment().unix()});
		
		// Hide Photo Booth
		this.$el.find(".photo-booth").addClass("hidden");
	},
	
	'removefile' : function (e)
	{	
		var streamid = this.activestream ? this.activestream.id : false;
		var image = $(e.currentTarget).remove();
		var attachs = this.draft.get("attachments") || [];
		var attachindex;
		
		
		//Is it in the default attachments?
		for (n in attachs){
			if(attachs[n].type == 'image' && attachs[n].name == image.data("filename")){
				attachindex = parseInt(n);
				break;
			}
		}
		
		if(!streamid){
			attachs.splice(attachindex,1);

			//Remove this entry from all variations's exclude list
			if(this.draft.get("variations"))
			{
				$.each(this.draft.get("variations"), function(n, variation)
				{
					if(variation.excludes)
						variation.excludes.attachments = _.difference(variation.excludes.attachments, [attachindex])
				});				
			}
		}
		else{
			this.draft.removevarimg(streamid, _.isNumber(attachindex)? attachindex: image.data("filename"));
			this.updatelimitations(streamid, true);
			this.editor.trigger("change:charlength");
		}


		//Remove from the summary interface
		this.$el.find('[data-collapsable=images] .summary [data-filename="'+image.data('filename')+'"]').remove();

		//Re-add the add button
		if(this.$el.find('ul.pictures-container li.images-thumb').length == 0)
			this.enableimages();
	},

	'enableimages' : function(){

		var addbtn = '<li class="add-file">+</li>';
		var addsnap = '<li class="add-snapshot">+</li>';

		this.$el.find("ul.pictures-container").append(addbtn);
		this.$el.find("ul.snapshots-container").append(addsnap);
	},

	'disableimages' : function(){

		this.$el.find('li.add-file').remove();
		this.$el.find('li.add-snapshot').remove();
	},
	

	/**
	 *	Options: Campaign
	**/
	
	'togglecampaign' : function(visible)
	{
		// Open options
		var collapsable = this.$el.find("[data-collapsable=campaign]")[visible? "removeClass": "addClass"]("hidden");
		
		return this;
	},
	
	'summarizecampaign' : function()
	{
		// Campaign value
		var campaignid = this.draft.get("campaign");
		var summary = this.$el.find("[data-collapsable=campaign] .summary").empty();
		
		if(campaignid)
		{
			var campaign = Cloudwalkers.Session.getAccount().get("campaigns").filter(function(cmp){ if(cmp.id == campaignid) return cmp; }).shift();
			summary.html("<span>" + campaign.name + "</span>");
		}
				
		return this;
	},
	
	'listentocampaign' : function (e)
	{
		// Campaign id
		var result = $(e.currentTarget).val();
		var campaignname = $(".chosen-single > span").get(0).textContent;

		if(result == 0)	this.removecampaign();
		else			{this.draft.set("campaign", Number(result)); this.trigger('update:campaign',campaignname); }
		
		this.summarizecampaign().$el.find("[data-collapsable=campaign]").addClass("collapsed");
	},
	
	'toggleaddcampaign' : function()
	{
		this.$el.find(".chosen-container, .campaign-name").toggleClass("hidden");
		
		return this;
	},
	
	'listentoaddcampaign' : function (e)
	{
		var result = $(e.currentTarget).val();
		var campaignname = $(".chosen-single > span").get(0).textContent;
		
		Cloudwalkers.Session.getAccount().addcampaign(result, function(account)
		{
			var campaigns = account.get("campaigns");
			
			this.draft.set("campaign", campaigns[campaigns.length -1].id);
			this.trigger('update:campaign', campaigns[campaigns.length -1].name);
			
			// Close it
			this.reloadcampaigns(campaigns);
			this.summarizecampaign().$el.find("[data-collapsable=campaign]").addClass("collapsed");
	
		}.bind(this));
	},
	
	'reloadcampaigns' : function(campaigns)
	{
		// Clear campaign select
		var select = this.$el.find(".campaign-list").empty();
		
		// Update options
		for(n in campaigns) select.append($("<option value='"+ campaigns[n].id +"'>"+ campaigns[n].name +"</option>"));
		
		select.trigger('chosen:updated');
		
	},

	'removecampaign' : function(){

		if(this.draft.get("campaign")){
			delete this.draft.attributes.campaign;
			this.trigger('update:campaign', null);
		}
	},
	
	
	/**
	 *	Options: Schedule
	**/
	
	'toggleschedule' : function(visible)
	{
		// Open options
		var collapsable = this.$el.find("[data-collapsable=schedule]")[visible? "removeClass": "addClass"]("hidden");
		
		return this;
	},
	
	'togglerepeat' : function(visible)
	{
		// Open options
		var collapsable = this.$el.find("[data-collapsable=repeat]")[visible? "removeClass": "addClass"]("hidden");
		
		return this;
	},
	
	'toggleschedentry' : function(selector, pos)
	{
		$(selector)[pos? "removeClass": "addClass"]("inactive").find("label")
			[pos? "removeClass": "addClass"]("icon-circle-blank")[pos? "addClass": "removeClass"]("icon-ok-circle");
		
		return this;
	},

	'parsemoment' : function(seldate, seltime)
	{
		/*var seldate = $(selectordate);
		var seltime = $(selectortime);

		if(!seltime.val())
 			this.restarttime();
		
		// Prevent empty
		if(!seldate.val() || !seltime.val()) return null;*/
		
		var date = moment(seldate.val(), ["DD-MM-YYYY","DD-MM-YY","DD/MM/YYYY","DD/MM/YY","DDMMYYYY","YYYYMMDD","MM-DD-YYYY","MM-DD-YY"]);
		var time = seltime ? seltime.val().split(":") : null;
		var newdate = _.clone(date);

		if (time && time.length > 1) 
			newdate.add('minutes', Number(time[0])*60 + Number(time[1]));
		
		return newdate.isValid()? newdate : undefined;
	},

	'parsescheduledate' : function(selectordate, selectortime)
	{
		var seldate = $(selectordate);
		var seltime = $(selectortime);
		
		if(!seltime.val())
 			this.restarttime();

 		if(!seldate.val())
 			this.restartdate();

 		// Prevent empty
		if(!seldate.val() || !seltime.val()) return null;

		var newdate = this.parsemoment(seldate, seltime);

		// Validate
		//if(newdate && newdate.unix() > moment().unix()) 	return newdate;
		//else												return undefined;

		return newdate;
		
	},	

	'parserepeatdate' : function(selectordate)
	{
		var seldate = $(selectordate);

		if(!seldate.val()) return null;

		var newdate = this.parsemoment(seldate);

		// Validate
		if(!newdate)	return undefined;

		// Is there a schedule?
		//if(this.$el.find('#delay-date').val())	return newdate.unix() < this.parsescheduledate("#delay-date", "#delay-time").unix() ? undefined: newdate;
		//else 									return newdate.unix() < moment().unix()? undefined: newdate;

	},
	
	/* Called on stream toggle */
	
	'updateschedule' : function(){
		
		var schedule;
		
		if(!(schedule = this.draft.original(this.activestream, "schedule")))
			 schedule = this.draft.original(null, "schedule");
			
		// Clean all
		this.toggleschedentry(".schedule-group [data-set]", false).toggleschedentry("[data-set=now], [data-set=onlyonce]", true);
		
		$("#delay-date, #delay-time, #repeat-interval, #repeat-amount, #repeat-until").val("").attr("disabled", false);
		$("#repeat-interval, #repeat-amount").val(0)
		$("[data-set=in] .btn-white").addClass("inactive");
		$("#delay-select").val(600);
		$("#every-select").val(168);
		$("#every-select-weekday").val(0).attr("disabled", false);
		
		// Update schedule time & date values on the UI 
		if(schedule && schedule.date && schedule.settings && schedule.settings.delayselect)
		{	
			this.toggleschedentry("[data-set=now]").toggleschedentry("[data-set=in]", true);
			$("#delay-select").val(schedule.settings.delayselect);
		}
		
		else if(schedule && schedule.date)
		{	
			this.toggleschedentry("[data-set=now]").toggleschedentry("[data-set=on]", true);
			
			$(this.datepicker.get(0)).datepicker('update', moment.unix(schedule.date).format("DD/MM/YYYY"));	
			this.timepicker.timepicker('setTime', moment.unix(schedule.date).format("HH:mm"));	

			if(schedule.besttimetopost){
				
				var element = this.$el.find("[data-set=on] .btn-white");
		
				if (element.hasClass("inactive"))	element.toggleClass("inactive");
				
				$("#delay-time").attr("disabled", true);			
				
			}
		}

		if(schedule && schedule.repeat)
		{
			// Reverse engineer interval
			if(schedule.repeat.interval)
			{
				this.toggleschedentry("[data-set=onlyonce]").toggleschedentry("[data-set=every]", true);
				
				[720,168,24,1].some(function(itv) {
					
					var sum = schedule.repeat.interval /itv /3600;
	
					if(Math.round(sum) == sum)
					{
						$("#repeat-interval").val(sum);
						$("#every-select").val(itv);
						
						return true;
					}
				});
			}
			
			if (schedule.repeat.weekdays && schedule.repeat.weekdays.length)
				$("#every-select-weekday").val(schedule.repeat.weekdays[0]);
			
			
			if(schedule.repeat.amount)
			{
				this.toggleschedentry("[data-set=onlyonce]").toggleschedentry("[data-set=repeat]", true);
				$("#repeat-amount").val(schedule.repeat.amount);
			}
			
			if(schedule.repeat.until)
			{
				this.toggleschedentry("[data-set=now]").toggleschedentry("[data-set=until]", true);
				$(this.datepicker.get(1)).datepicker('update', moment.unix(schedule.repeat.until).format("DD/MM/YYYY"));
			}
					

			//var repsettings = schedule.repeat.settings || {};

			/*if (schedule.repeat.interval){
				this.toggleschedentry("[data-set=onlyonce], " + (schedule.repeat.amount? "[data-set=until]": "[data-set=repeat]"), false);
				this.toggleschedentry("[data-set=every], " + (schedule.repeat.amount? "[data-set=repeat]": "[data-set=until]"), true);
			}*/
		}
	},
	
	/* Called on input update */
	
	'monitorschedule' : function(e, element)
	{	
		// Various data
		var field = element || $(e.currentTarget);
		var entry = field.data("set")? field: field.parents("[data-set]").eq(0);
		var set = entry.data("set");
		
		// Get variation/default info
		var schedule;
		
		if(!(schedule = this.draft.original(this.activestream, "schedule")))
			 schedule = {repeat:{}};
			
		// clear now default
		if(schedule.now) delete schedule.now;
		
		// Schedule Now
		if(set == "now")
		{
			this.toggleschedentry("[data-set=in], [data-set=on]").toggleschedentry("[data-set=now]", true);
			$("[data-set=on] input").val("").attr("disabled", false);
			$("[data-set=in] select").val(600);
			$("[data-set=in] .btn-white").addClass("inactive");
			
			// Data
			schedule = {repeat: schedule.repeat, now: true};
		 
		} else
		
		// Schedule In
		if(set == "in")
		{
			this.toggleschedentry("[data-set=now], [data-set=on]").toggleschedentry("[data-set=in]", true);
			$("[data-set=on] input").val("").attr("disabled", false);
			$("[data-set=in] .btn-white").addClass("inactive");

		} else
		
		// Schedule On
		if(set == "on")
		{
			this.toggleschedentry("[data-set=now], [data-set=in]").toggleschedentry("[data-set=on]", true);
			$("[data-set=in] select").val(600);

			this.parsescheduledate("#delay-date", "#delay-time");
			// Data
			/*if (this.parsescheduledate("#delay-date", "#delay-time") === undefined)
			{
				this.datepicker.datepicker('hide');
				this.$el.find("#delay-date").val("");
				Cloudwalkers.RootView.alert("Please set your Schedule to a date in the future");
			}*/
			
			// Force clean "in"
			if(schedule.settings && schedule.settings.delayselect) delete schedule.settings.delayselect;
		
		} else
		
		// No repeat
		if(set == "onlyonce")
		{
			this.toggleschedentry("[data-set=onlyonce]", true).toggleschedentry("[data-set=repeat], [data-set=until], [data-set=every]", false);
			
			// Data
			$("#repeat-interval, #repeat-amount").val(0);
			$("#every-select").val(600);
			$("#every-select-weekday").val(0).attr("disabled", false);
			$("#repeat-until").val("");
			
			// Data
			delete schedule.repeat;
						
		} else
		
		// Repeat every
		if(set == "every")
		{
			this.toggleschedentry("[data-set=every]", true).toggleschedentry("[data-set=onlyonce]", false);
			
		} else
		
		// Repeat repeat
		if(set == "repeat")
		{
			this.toggleschedentry("[data-set=every], [data-set=repeat]", true).toggleschedentry("[data-set=onlyonce], [data-set=until]", false);
			
			// Data
			if(!Number($("#repeat-interval").val())) $("#repeat-interval").val(1);
			if(!Number($("#repeat-amount").val()))   $("#repeat-amount").val(1);
			$("#repeat-until").val("");
						
		} else
		
		// Repeat until
		if(set == "until")
		{
			this.toggleschedentry("[data-set=every], [data-set=until]", true).toggleschedentry("[data-set=onlyonce], [data-set=repeat]", false);
			
			// Data
			if(!Number($("#repeat-interval").val())) $("#repeat-interval").val(1);
			$("#repeat-amount").val(0);	

			// Data
			/*if (this.parserepeatdate("#repeat-until") === undefined)
			{	
				this.datepicker.datepicker('hide');
				this.$el.find("#repeat-until").val("");
				Cloudwalkers.RootView.alert("Please set your Schedule to a date in the future");
			}*/
		}
		
		// Set the data
		this.draft.original(this.activestream, "schedule", schedule);
		
		// Collect the data
		this.parsescheduled();
		e.stopPropagation();
		
		return this;
	},
		
	'togglebesttime' : function(e)
	{	
		var schedule;
		
		if(!(schedule = this.draft.original(this.activestream, "schedule")))
			 schedule = {repeat:{}};
		
		$(e.currentTarget).toggleClass("inactive");
		
		if ($(e.currentTarget).hasClass("inactive"))	$("#delay-time").attr("disabled", false);
		else											$("#delay-time").attr("disabled", true);
		//else											$("#delay-time").attr("disabled", true).val("");
			
		schedule.besttimetopost = !$(e.currentTarget).hasClass("inactive");
		
		// Set the data
		this.draft.original(this.activestream, "schedule", schedule);

		// Fetch
		/*if(this.activestream && !this.hasbesttime()){
			var stream = Cloudwalkers.Session.getStream(this.activestream.id);

			this.listenToOnce(stream, 'sync', this.setbesttime);
			stream.fetch({endpoint: "besttimetopost"});
		}*/
		
		return this;
	},

	'setbesttime' : function(besttimes)
	{
		//console.log(besttimes)
	},

	'hasbesttime' : function()
	{	
		var streamid = this.activestream? this.activestream.id: false;
		var stream = streamid ? this.streams.models.filter(function(el){  return el.id == streamid}): false;
		
		return stream.length? stream[0].get("bestTimeToPost"): false;
	},
	
	/* Parse schedule values */
	
	'parsescheduled' : function()
	{	
		
		// Get variation/default info
		var schedule;
		
		if(!(schedule = this.draft.original(this.activestream, "schedule")))
			 schedule = {repeat:{}};

		if (!schedule.settings) schedule.settings = {};
		
		var select = this.$el.find("section[data-collapsable] .schedule-entry").not(".inactive")
			.find("#delay-select, #delay-date, #delay-time, #repeat-interval, #every-select, #every-select-weekday, #repeat-amount, #repeat-until");
		
		// Schedule In
		if (select.filter("#delay-select").val())
		{
			schedule.settings.delayselect = $("#delay-select").val();
			schedule.date = moment().add('seconds', schedule.settings.delayselect).unix();
		}
		
		else if (select.filter("#delay-date").val())
		{
			var date = this.parsescheduledate("#delay-date", "#delay-time");
	
			/*if (select.filter("#delay-date").val())	var time = $("#delay-time").val().split(":");
			if (time.length > 1) 					date.add('minutes', Number(time[0])*60 + Number(time[1]));*/
			
			
			if(date) schedule.date = date.unix();				
			
			if(select.filter("#delay-time").is('[disabled=disabled]'))	schedule.besttimetopost = true;	
		} 
		
		// Repeat
		if (select.filter("#repeat-interval").val())
		{
			if (!schedule.repeat) schedule.repeat = {interval: 604800};
			schedule.repeat.interval = $("#repeat-interval").val()? $("#repeat-interval").val() *$("#every-select").val() *3600 : 0;
			if($("#every-select-weekday").val()) schedule.repeat.weekdays = [$("#every-select-weekday").val()];
			
			// Some altering
			// To-do : single/multiple description
			// $("#every-select option").each(function(){ this.html(this.data( $("#repeat-interval").val() == 1? "single": "multiple")) });
			 $("#every-select-weekday").attr("disabled", $("#every-select").val() < 168);
			
			schedule.repeat.amount = Number(select.filter("#repeat-amount").val())? Number($("#repeat-amount").val()): false;
			schedule.repeat.until =  select.filter("#repeat-until").val()? moment($("#repeat-until").val(), ["DD-MM-YYYY","DD-MM-YY","DD/MM/YYYY"]).unix(): false;			

			//Create temporary object to store variation settings
			/*var repsettings = {};

			repsettings.interval = $("#repeat-interval").val() || null;
			repsettings.every = $("#every-select").val() || null;
			repsettings.everyweek = $("#every-select-weekday").val() || null;

			schedule.repeat.settings = repsettings;*/

		}

		return schedule;
	},
	
	'summarizeschedule' : function ()
	{	
		// Translations
		this.translate_best_time_to_post = this.translateString("best_time_to_post");

		// Collect the data
		var scheduled = this.parsescheduled();
		var summary = this.$el.find("[data-collapsable=schedule] .summary").empty()
		
		if(scheduled && scheduled.date)
		{
			var time = scheduled.besttimetopost? this.translate_best_time_to_post: moment.unix(scheduled.date).format("HH:mm");
			summary.html("<span><i class='icon-time'></i> " + moment.unix(scheduled.date).format("dddd, D MMMM YYYY") + "<em class='negative'>" + time + "</em></span>");
		}
		
		// Refresh repeat summary
		this.summarizerepeat();
				
		return this;
	},
	
	'summarizerepeat' : function()
	{

		//Mustache Translate Summarize Repeat
		this.mustacheTranslateSummarizeRepeat(this);

		// Collect the data
		var scheduled = this.parsescheduled();
		
		if(scheduled && !scheduled.repeat)
			this.$el.find("[data-collapsable=repeat] .summary").empty();

		// Emergency breaks
		if(!scheduled || !scheduled.repeat) return this;
		
		var summary = this.$el.find("[data-collapsable=repeat] .summary").empty();
		var start = scheduled.date? moment.unix(scheduled.date): moment();
		
		// Based on until
		if (scheduled.repeat.until)
		{
			var end = moment.unix(scheduled.repeat.until);
			var span = end.diff(start)/1000;
			var times = Math.round(span/scheduled.repeat.interval);
		}
		
		// Based on repeat
		else if (scheduled.repeat.interval)
		{
			var times = scheduled.repeat.amount;
			var end = start.clone().add('seconds', times * scheduled.repeat.interval);
		}

		if(times) summary.html("<span>" + times + " " + this.translate_times + " " + (end? "<em class='negative'>" + this.translate_until + " " + end.format("dddd, D MMMM YYYY") + "</em>": "") + "</span>");
		else if(scheduled.repeat.interval)
		{
			var sum, intv;
			
			[720,168,24,1].some(function(itv) {
					
				sum = scheduled.repeat.interval /itv /3600;
				intv = itv;
				if(Math.round(sum) == sum) return true;
			});	
			
			var weekdays = {1: this.translate_hours, 24: this.translate_days, 168: this.translate_weeks, 720: this.translate_months};
			
			
			summary.html("<span>" + this.translate_endless_repeat_every + " " + sum + " " + weekdays[intv]);
		
		}				
		return this;
	},

	/**
	 *	Canned
	**/

	/*'fetchcanned' : function()
	{		
		if(this.options[this.type] && !this.options[this.type].indexOf('canned'))
			return null;

		if(Cloudwalkers.Session.getCannedResponses().touched)
			return Cloudwalkers.Session.getCannedResponses().models;
		
		// Fetch once
		var canned = new Cloudwalkers.Collections.CannedResponses();
		canned.fetch();

		this.listenTo(canned, 'sync', this.rendercanned);
	},

	'rendercanned' : function(canned)
	{	
		Cloudwalkers.Session.getCannedResponses().touched = true;

		this.$el.find("[data-type=canned] .collapsable-content").html(Mustache.render(Templates.cannedresponsesdrop, {canned: canned.models}));
		this.$el.find(".canned-list").chosen({width: "100%"});
		this.$el.find(".canned-list").chosen({no_results_text: "Oops, nothing found!"}); 
		this.$el.find("[data-type=canned] .collapsable-content").removeClass('loading');
	},*/
	
	'listentocanned' : function (e)
	{
		// Message id
		var result = $(e.currentTarget).val();
		var cannedtext = $(".chosen-single > span").get(0).textContent;

		if(result != 0){
			var canned = Cloudwalkers.Session.getCannedResponses();
			var response = canned.models.filter(function(el){ if(el.id == result) return el; });
			var responsehtml = response[0]? response[0].get("body").html: null;

			if(responsehtml)
				this.trigger("replace:content", responsehtml)
		}
	},

	
	/**
	 *	Finalize
	**/
	
	'preview' : function()
	{
		// Animate compose view
		this.$el.addClass("switch-mode");

		// Create new preview object
		this.preview = new Cloudwalkers.Views.Preview({model: this.draft.clone(), previewtype: 'default', streamid: this.activestream.id});
		
		// Add preview view to Compose
		this.$el.find('.switch-container').append(this.preview.render().el);
		
	},
	
	'endpreview' : function()
	{
		// Remove preview pane
		this.preview.remove();
		
		// Animate compose view
		this.$el.removeClass("switch-mode");
	},
	
	'save' : function(status)
	{	
		// Prevent empty patch
		//if (!this.draft.validateCustom()) return Cloudwalkers.RootView.information ("Not saved", "You need a bit of content.", this.$el.find(".modal-footer"));

		var error;
 
 		if(error = this.draft.validateCustom(['streams', 'schedule']))
 			return this.showerror("Not saved: ", error);
		
		//Disables footer action
		this.disablefooter();

		if(!status || !_.isString(status))	status = "draft";
		
		this.draft.sanitizepost();
		
		if(this.draft.id)	this.draft.save({
			body: this.draft.get("body"), 
			attachments: this.draft.get("attachments"), 
			variations: this.draft.get("variations"), 
			streams: this.draft.get("streams"), 
			schedule: this.draft.get("schedule"), 
			update: true
		}, {patch: true, endpoint: "original", success: this.thankyou.bind(this, 'save'), error: this.oops.bind(this, 'save', status)});

		else this.draft.save({status: status}, {success: this.thankyou.bind(this, 'save'), error: this.oops.bind(this, 'save', status)});
	},
	
	'post' : function()
	{	
		// Prevent empty post
		//if (!this.draft.validateCustom()) return Cloudwalkers.RootView.information ("Not saved:", "You need a bit of content.", this.$el.find(".modal-footer"));
		//if (this.$el.find('.stream-tabs .stream-tab').length <= 1) return Cloudwalkers.RootView.information ("Not posted:", "Please select a network first.", this.$el.find(".modal-footer"));

		var error;
 
		if(error = this.draft.validateCustom())
 			return this.showerror(this.translateString("not_posted") + ": ", error);

		//Disables footer action
		this.disablefooter();
		
		this.draft.sanitizepost();
		
		// Redirect streamless to draft
		if(!this.draft.get("streams").length) this.save("scheduled");
		
		// Update a Patch
		else if(this.draft.id){
			//console.log("right before the save:", this.draft.get('variations'));
			this.draft.save({
				body: this.draft.get("body"), 
				attachments : this.draft.get("attachments"),
				variations: this.draft.get("variations"), 
				streams: this.draft.get("streams"), 
				status: "scheduled", 
				schedule: this.draft.get("schedule"), 
				update: true
			}, {patch: true, endpoint: "original", success: this.thankyou.bind(this, 'post'), error: this.oops.bind(this, 'post')});			
		} 
		
		// Or just post
		else this.draft.save({status: "scheduled"}, {success: this.thankyou.bind(this, 'post'), error: this.oops.bind(this, 'post')});
		
		
		//this.draft.save({status: "scheduled"}, {patch: this.draft.id? true: false, success: this.thankyou.bind(this)});
		
	},
	
	'postaction' : function()
	{		
		var streamids = [];
		var checkblock = 'content';
		var error;
		var params;
		
		this.$el.find(".action-tabs div").each(function() { streamids.push($(this).data("stream"))});
		
		// Check stream selection
		//if (!streamids.length)
		//	return Cloudwalkers.RootView.information ("Not saved", "Select at least 1 network", this.$el.find(".modal-footer"));
		
		// Check text if required
		if (this.options[this.type].indexOf("editor") >= 0 && !this.draft.get("body").html)
			checkblock = false;

		if(error = this.draft.validateCustom([checkblock]))
 			return this.showerror(this.translateString("not_posted") + ": ", error);
		
		//Disables footer action
		this.disablefooter();

		// Canned respose
		if(this.$el.find("[data-type=canned] input").is(':checked'))

			Cloudwalkers.Session.getCannedResponses().create({body: {plaintext: this.draft.get("body").plaintext}, status: "CANNED"});

		// Create & Save
		var postaction = this.reference.actions.create({
			parameters: params? params: null, 
			streams: streamids, 
			message: this.draft.get("body").html, 
			actiontype: this.type
			}, 
			{success: this.thankyou.bind(this, null), error: this.oops.bind(this, 'saveaction')}
		);

		this.loadListeners(postaction, ['request:action', 'sync']);
		postaction.trigger("request:action");
	},
	
	'thankyou' : function(action)
	{
		var thanks = Mustache.render(Templates.thankyou);

		setTimeout(function()
		{
			// Animate compose view
			this.$el.addClass("switch-mode").addClass('thanks');

			// Add preview view to Compose
			this.$el.find('.switch-container').append(thanks);
			setTimeout(function(){ this.$el.modal('hide'); }.bind(this), 1000);
		}.bind(this),400);
		
		// After sales service 
		if(this.type == "edit")
		{	
			var varn = this.draft.get("variations");
			
			if(varn && varn.length) varn.forEach(function(el)
			{ 
				if(el.id) 
				{	
					if(action && action == 'post')
						Cloudwalkers.RootView.trigger("added:message", this.draft);

					Cloudwalkers.Session.getMessage(el.id).fetch({success: function(mess){ mess.trigger("change")}});
				}
			}.bind(this));
			
			else this.model.fetch()	
		}
		
		if(this.type == "post")
			Cloudwalkers.RootView.trigger("added:message", this.draft);

		Cloudwalkers.RootView.trigger(this.type.concat(":success"), this.type);
	},

	'showerror' : function(title, error)
	{
		Cloudwalkers.RootView.information (title, error, this.$el.find(".modal-footer"));
	},
	'oops' : function(action, status)
	{
		Cloudwalkers.RootView.confirm 
			(
				'An error ocurred while posting your message. Do you want to retry?',
				function () { 
					this.loadmylisteners();
					action == 'save'? this.save(status): this.post(); }.bind(this),
				function () { this.$el.modal('hide'); }.bind(this)
			);
	},

	'disablefooter' : function()
	{	
		this.$el.find(".modal-footer .btn").attr("disabled", true);
	},
	
	'invalid' : function(model, error)
	{
		Cloudwalkers.RootView.alert(model.get("title") + " " + error);
	},

	/*
	In case we need to figure out the height of the scrollbar
	It seams all are 17px

	'scrollbarwidth' : function(){

		var outer = document.createElement("div");
	    outer.style.visibility = "hidden";
	    outer.style.width = "100px";
	    document.body.appendChild(outer);
	    
	    var widthNoScroll = outer.offsetWidth;
	    // force scrollbars
	    outer.style.overflow = "scroll";
	    
	    // add innerdiv
	    var inner = document.createElement("div");
	    inner.style.width = "100%";
	    outer.appendChild(inner);        
	    
	    var widthWithScroll = inner.offsetWidth;
	    
	    // remove divs
	    outer.parentNode.removeChild(outer);
	    
	    return widthNoScroll - widthWithScroll;
	},*/
	
	'isscrolling' : function(){		
		
		if(this.$el.find('.stream-tabs').length)
			return this.$el.find('.stream-tabs')[0].scrollWidth > this.$el.find('.stream-tabs').width();
		else if(this.$el.find('.action-tabs').length)
			return this.$el.find('.action-tabs')[0].scrollWidth > this.$el.find('.action-tabs').width();
	},

	'triggerpaste' : function(e) { this.editor.trigger('paste:content', e); },
	'triggerblur' : function() { this.editor.trigger('blur:content'); },

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},
	'translateTitles' : function(translatedata)
	{
		
		for(k in this.titles)
		{
            this.translated_titles[k] = this.translateString(this.titles[k]);
		}
	},

	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"networks",
			"default",
			"subject",
			"images",
			"photo_booth",
			"pictures",
			"camera",
			"campaign",
			"no_campaign",
			"schedule",
			"now",
			"in",
			"mins",
			"hour",
			"hours",
			"day",
			"week",
			"on",
			"best_time",
			"repeat",
			"no_repeat",
			"every",
			"days",
			"weeks",
			"months",
			"select_a_day",
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday",
			"sunday",
			"doesnt_matter",
			"times",
			"until",
			"save",
			"preview",
			"post",
			"save_this_as_a_response_template"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	},
	
	'mustacheTranslateSummarizeRepeat' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"times",
			"until",
			"endless_repeat_every",
			"hours",
			"days",
			"weeks",
			"months"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}
});


	/**
	 *	Options: Link
	**
	
	//this.togglelink(options.indexOf("link") >= 0);
	//this.summarizelink();
	
	'togglelink' : function(visible)
	{
		// Open options
		var collapsable = this.$el.find("[data-collapsable=link]")[visible? "removeClass": "addClass"]("hidden");
		
		return this;
	},
	
	// Update link object
	'listentolink' : function (e)
	{	
		var streamid = this.activestream ? this.activestream.id : false;
		var link = $(e.currentTarget).val();

		if(streamid){ 
			this.draft.setvariation(streamid, 'link', {type:'link', url:link});
		}else{
			var links = this.draft.get("attachments").filter(function(el){ if(el.type == "link") return el; });
			if(links.length) links[0].url = link;
			else this.draft.attach({type: 'link', url: link});
		}		
		
		this.summarizelink();
	},

	// Write link object in the interface
	'summarizelink' : function(){

		var streamid = this.activestream ? this.activestream.id : false;
		var summary = this.$el.find("[data-collapsable=link] .summary").empty();
		var linkinput = this.$el.find("[data-collapsable=link] input");
		var link;

		if(streamid && this.draft.getvariation(streamid,'link') && this.draft.getvariation(streamid,'link').length > 0){
			//There is a link in the variation
			link = this.draft.getvariation(streamid, 'link');
			link = link[0].url;

		} else if(this.draft.get("attachments"))
		{
			//This is the default stream
			links = this.draft.get("attachments").filter(function(el){ if(el.type == "link") return el; });
			link = links[0] ? links[0].url : false;

		} else return;
		
		if(link)
		{
			summary.html("<span>" + link + "</span>");
			linkinput.val(link);
		}
		
		return this;
	},
*/	
