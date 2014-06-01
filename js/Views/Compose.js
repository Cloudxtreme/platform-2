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
	},
	
	'options' : {
		false :			["editor","link","images","campaign","schedule","repeat"],
		'twitter' :		["editor","images","link","campaign","schedule","repeat"],
		'facebook' :	["editor","fullbody","link","images","campaign","schedule","repeat"],
		'linkedin' :	["editor","link","images","campaign","schedule","repeat"],
		'tumblr' :		["subject","editor","fullbody","link","images","campaign","schedule","repeat"],
		'google-plus' :	["editor","fullbody","link","images","campaign","schedule","repeat"],
		'youtube' :		["subject","editor","fullbody","link","video","campaign","schedule","repeat"],
		'blog' :		["subject","editor","fullbody","link","images","campaign","schedule","repeat"],
		'group' :		["editor","images","link","campaign","schedule","repeat"],
		'mobile-phone':	["editor","schedule","repeat"],
		
		// Actions
		'comment' : ["editor"],
		'reply' : ["editor"],
		'dm' : ["editor"],
		'retweet' : ["icon"],
		'like' : ["icon","schedule"],
		'favorite' : ["icon"],
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
		
		'click .add-file' : 'addfile',
		'click .add-snapshot' : 'addsnapshot',
		'change [data-collapsable=images] input' : 'listentofiles',
		'click .photo-booth' : 'listentobooth',
		'click li.images-thumb' : 'removefile',
		
		'blur [data-collapsable=link] input' : 'listentolink',
		
		'change select.campaign-list' : 'listentocampaign',
		'blur .campaign-name' : 'listentoaddcampaign',
		'click .add-campaign' : 'toggleaddcampaign',
		
		'click .schedule-entry' : 'monitorschedule',
		'blur [data-collapsable=schedule] input, [data-collapsable=repeat] input' : 'monitorschedule',
		'change [data-collapsable=schedule] select, [data-collapsable=repeat] select' : 'monitorschedule',
		'changeDate input' : 'monitorschedule',
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
			this.draft = this.reference.clone();
		
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
			this.draft = this.model;
			this.setDraft();			
		}
		
		// Draft message
		if(!this.draft)
		{
			// The draft message
			this.draft = new Cloudwalkers.Models.Message({"variations": [], "attachments": [], "streams": [], "body": {}, "schedule": {}});
			// Listen to validation
			this.listenTo(this.draft, "invalid", this.invalid);
		}

		this.loadListeners(this.draft, ['request', 'sync']);

		//Twitter reply
		//This is a hack indeed...What better way to make this?
		if(this.type == 'reply' && this.reference.get("networktoken") == 'twitter'){
			var parameters = this.action.parameters[0];
			this.draft.set('body', { html : Mustache.render(parameters.value, {from: this.reference.get("from")[0]})});
		}
		
	},

	'render' : function ()
	{

		// Collect data
		var params ={
			streams:	this.actionstreams.length? this.actionstreams: this.streams.models,			
			title:		this.titles[this.type],
			campaigns:	Cloudwalkers.Session.getAccount().get("campaigns"),
			actionview: this.actionview? this.type: false
		};
		
		// Create view
		var view = Mustache.render(Templates.compose, params);
		this.$el.html (view);
		
		// Append Editor
		this.editor = new Cloudwalkers.Views.Editor({draft: this.draft, parent: this});
		this.$el.find("[data-type=post]").append(this.editor.render().el);

		// Listen to editor triggers
		this.listenTo(this.editor, "imageadded", this.addimage);
		this.listenTo(this.editor, "contentadded", this.monitor);

		// Add Chosen
		this.$el.find(".campaign-list").chosen({width: "50%"});
		
		// Add Datepicker
		this.$el.find('#delay-date, #repeat-until').datepicker({format: 'dd-mm-yyyy'});

		// Add Datepicker and Timepicker
		this.picker = this.$el.find('#delay-date, #repeat-until').datepicker({format: 'dd-mm-yyyy', orientation: "auto"});
		this.$el.find('#delay-time').timepicker({template: 'dropdown', minuteStep:5, showMeridian: false});
		
		//this.$container = this.$el.find ('.modal-footer');
		this.$loadercontainer = this.$el.find ('.modal-footer');

		//Update the content with default/variation/draft data
		this.togglesubcontent();
		this.trigger("rendered");
		return this;
	},
	
	'editstreams' : function (model)
	{
		var action = model.get("actions").filter(function(act) { if(act.token == model.token) return act.streams })[0];
		
		this.actionstreams = [];
		for(n in action.streams) this.actionstreams.push(Cloudwalkers.Session.getStream(action.streams[n]));	
		
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
		
		var streamid = this.activestream ? this.activestream.id : false;
		var content = target.text() || target.val();
		var object = target.attr("data-option") || "subject";

		if(object == 'body')
			content = {'html' : content};
		
		//if there is already a variation insert the text into it, otherwise add it
		if(streamid)	this.draft.setvariation(streamid, object, content);
		else 			this.draft.set(object, content);
	},
	
	'toggleoption' : function (e)
	{	
		var $btn = $(e.currentTarget);
		var option = $btn.data("toggle");
		var collapsable = $btn.parent().toggleClass("collapsed");
		
		// Summarize
		if(collapsable.hasClass("collapsed") && this["summarize" + option])
		
			this["summarize" + option]();
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
			$tabs.append('<div class="stream-tab" data-stream="'+ id +'"><i class="icon-'+ stream.get("network").icon +'"></i> '+ stream.get("defaultname") +'</div>');
			
			// Add to draft
			streamids.push(id);
			
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
		}
		
		$btn.toggleClass("inactive active");
			
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
		this.togglesubcontent(stream);
	},
	
	'togglesubcontent' : function (stream)
	{ 	
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
		this.$el.find(".modal-body").get(0).className = "modal-body";
		this.$el.find(".modal-body").addClass(icon + "-theme");

		// Subject
		if (options.indexOf("subject") >= 0)	this.$el.find("[data-option=subject].hidden").removeClass("hidden");
		else									this.$el.find("[data-option=subject]").addClass("hidden");

		// Editor
		if (options.indexOf("editor") >= 0)		this.$el.find("#editor.hidden").removeClass("hidden");
		else									this.$el.find("#editor").addClass("hidden");
		
		// Full Body
		if (options.indexOf("fullbody") >= 0)	this.$el.find("[data-option=limit]").addClass("hidden");
		else									this.$el.find("[data-option=limit].hidden").removeClass("hidden");
		
		// Icon
		if (options.indexOf("icon") >= 0)		this.$el.find("[data-type=icon]").removeClass("hidden").find("i").get(0).className = "icon-" + this.icons[this.type];
		else									this.$el.find("[data-type=icon]").addClass("hidden");
		
		// Toggle options
		this.closealloptions();
		
		this.toggleimages(options.indexOf("images") >= 0, options.indexOf("multiple") >= 0);
		
		this.togglelink(options.indexOf("link") >= 0);
		
		this.togglecampaign(options.indexOf("campaign") >= 0);
		
		this.toggleschedule(options.indexOf("schedule") >= 0);
		
		this.togglerepeat(options.indexOf("repeat") >= 0);
		
		// Update content, images and links
		this.trigger("update:stream", this.draft.getvariation(id, 'body') || id);
		this.updatesubject();
		this.updateimages();
		this.summarizelink();
		
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
			if (!f.type.match('image.*')) continue;
			
			var reader = new FileReader();
			
			reader.onload = (function(file)
			{	return function(e)
				{	
					self.addimage({type: 'image', data: e.target.result, name: file.name});

			}})(f);
			
			reader.readAsDataURL(f);
		}	
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
	},

	//Add to summary
	'summarizeimages' : function(image)
	{
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
	'updateimages' : function()
	{	
		var streamid = this.activestream ? this.activestream.id : false;
		var summary = this.$el.find("[data-collapsable=images] .summary").empty();
		var picturescontainer = this.$el.find("ul.pictures-container").empty();
		var addbtn = '<li class="add-file">+</li>';
		var images = [];

		//Add variation images
		if(streamid && this.draft.getvariation(streamid,'image')){
			var imgs = this.draft.getvariation(streamid, 'image');
			$.each(imgs, function(i, image){
				this.summarizeimages(image);
				this.listimage(image);
			}.bind(this));
		}

		//Add default images
		if(this.draft.get("attachments")){
			imgs = this.draft.get("attachments").filter(function(el){ if(el.type == "image") return el; });
			$.each(imgs, function(i, image){
				this.summarizeimages(image);
				this.listimage(image);
			}.bind(this));
		}

		picturescontainer.append(addbtn);
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
		
		this.draft.attach({type: 'image', data: result, name: moment().unix()});
		
		// Hide Photo Booth
		this.$el.find(".photo-booth").addClass("hidden");
	},
	
	'removefile' : function (e)
	{	
		var streamid = this.activestream ? this.activestream.id : false;
		var image = $(e.currentTarget).remove();
		var attachs;

		if(streamid)	attachs = this.draft.getvariation(streamid).attachments;
		else 			attachs = this.draft.get("attachments");
		
		for (n in attachs)
			if(attachs[n].type == 'image' && attachs[n].name == image.data("filename"))		attachs.splice(n,1); 

		//Remove from the summary interface
		this.$el.find('[data-collapsable=images] .summary [data-filename="'+image.data('filename')+'"]').remove();
	},
	
	/**
	 *	Options: Link
	**/
	
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
	
		this.draft.set("campaign", Number(result));
		
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
		
		Cloudwalkers.Session.getAccount().addcampaign(result, function(account)
		{
			var campaigns = account.get("campaigns");
			
			this.draft.set("campaign", campaigns[campaigns.length -1].id);
			
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

	'parsemoment' : function(selector)
	{
		var field = $(selector);
		
		// Prevent empty
		if(!field.val()) return null;
		
		var date = moment(field.val(), ["DD-MM-YYYY","DD-MM-YY","DD/MM/YYYY","DD/MM/YY","DDMMYYYY","YYYYMMDD","MM-DD-YYYY","MM-DD-YY"]);
		
		// Validate
		if(!date.isValid()) return undefined;
		
		// Future-check
		return date.unix() < moment().unix()? undefined: date;
	},
	
	'monitorschedule' : function(e, element)
	{
		
		var field = element || $(e.currentTarget);
		var scheduled = this.draft.get("schedule");
		
		var entry = field.data("set")? field: field.parents("[data-set]").eq(0);
		var set = entry.data("set");
		
		
		// Schedule Now
		if(set == "now")
		{
			// UI
			this.toggleschedentry("[data-set=in], [data-set=on]").toggleschedentry("[data-set=now]", true);
			$("[data-set=on] input").val("");
			$("[data-set=in] select").val(600);
			
			// Data
			this.draft.set("schedule", {repeat: scheduled.repeat || {}});
		 
		} else
		
		// Schedule In
		if(set == "in")
		{
			// UI
			this.toggleschedentry("[data-set=now], [data-set=on]").toggleschedentry("[data-set=in]", true);
			$("[data-set=on] input").val("");

		} else
		
		// Schedule On
		if(set == "on")
		{
			// UI
			this.toggleschedentry("[data-set=now], [data-set=in]").toggleschedentry("[data-set=on]", true);
			$("[data-set=in] select").val(600);

			// Data
			if (this.parsemoment("#delay-date") === undefined)
			{
				this.picker.datepicker('hide').val("");
				Cloudwalkers.RootView.alert("Please set your Schedule to a date in the future");
			}
		
		} else
		
		// Repeat every
		if(set == "every")
		{
			// UI
			var active = field.data("set")? !entry.hasClass("inactive"): false;
			
			this.toggleschedentry("[data-set=every]", !active);
			
			this.toggleschedentry(active?
				"[data-set=repeat], [data-set=until]": (Number($("#repeat-amount").val())? "[data-set=repeat]": "[data-set=until]")
			, !active);
			
			// Data
			$("#repeat-interval").val(active? 0: (Number($("#repeat-interval").val())? $("#repeat-interval").val(): 1));
			if(active)
			{
				$("#repeat-amount").val(0);
				$("#repeat-until").val("");
			}
			
		} else
		
		// Repeat repeat
		if(set == "repeat")
		{
			this.toggleschedentry("[data-set=every], [data-set=repeat]", true).toggleschedentry("[data-set=until]", false);
			
			// Data
			if(!Number($("#repeat-interval").val())) $("#repeat-interval").val(1);
			if(!Number($("#repeat-amount").val()))   $("#repeat-amount").val(1);
			$("#repeat-until").val("");
						
		} else
		
		// Repeat until
		if(set == "until")
		{
			this.toggleschedentry("[data-set=every], [data-set=until]", true).toggleschedentry("[data-set=repeat]", false);
			
			// Data
			if(!Number($("#repeat-interval").val())) $("#repeat-interval").val(1);
			$("#repeat-amount").val(0);	
		}
		
		// Collect the data
		this.parsescheduled();
		e.stopPropagation();
		
		return this;
	},
	
	'parsescheduled' : function()
	{
		var scheduled = this.draft.get("schedule");
		
		var select = this.$el.find("section[data-collapsable] .schedule-entry").not(".inactive")
			.find("#delay-select, #delay-date, #delay-time, #repeat-interval, #every-select, #every-select-weekday, #repeat-amount, #repeat-until");
		
		// Schedule
		if (select.filter("#delay-select").val())
			scheduled.date = moment().add('seconds', $("#delay-select").val()).unix();
		
		else if (select.filter("#delay-date").val())
		{
			var date = this.parsemoment("#delay-date");
			if (select.filter("#delay-date").val())	var time = $("#delay-date").val().split(":");
			if (time.length > 1) 					date.add('minutes', Number(time[0])*60 + Number(time[1]));
			
			scheduled.date = date.unix();
		} 
		
		// Repeat
		if (select.filter("#repeat-interval").val())
		{
			if (!scheduled.repeat) scheduled.repeat = {interval: 604800};
			scheduled.repeat.interval = $("#repeat-interval").val()? $("#repeat-interval").val() *$("#every-select").val() *3600 : 0;
			if($("#every-select-weekday").val()) scheduled.repeat.weekdays = [$("#every-select-weekday").val()];
			
			// Some altering
			// To-do : single/multiple description
			// $("#every-select option").each(function(){ this.html(this.data( $("#repeat-interval").val() == 1? "single": "multiple")) });
			 $("#every-select-weekday").attr("disabled", scheduled.repeat.interval < 604800);
			
			scheduled.repeat.amount = Number(select.filter("#repeat-amount").val())? Number($("#repeat-amount").val()): false;
			scheduled.repeat.until =  select.filter("#repeat-until").val()? moment($("#repeat-until").val(), ["DD-MM-YYYY","DD-MM-YY","DD/MM/YYYY"]).unix(): false;			
		}
		
		return scheduled;
	},
	
	'togglebesttime' : function(e)
	{
		$(e.currentTarget).toggleClass("inactive");
		
		if ($(e.currentTarget).hasClass("inactive"))	$("#delay-time").attr("disabled", false);
		else											$("#delay-time").attr("disabled", true).val("");
			
		this.draft.get("schedule").besttimetopost = !$(e.currentTarget).hasClass("inactive");
		
		return this;
	},
	
	'summarizeschedule' : function ()
	{
		// Collect the data
		var scheduled = this.parsescheduled();
		
		var summary = this.$el.find("[data-collapsable=schedule] .summary").empty();
		
		if(scheduled.date)
		{
			var time = scheduled.besttimetopost? "Best time to post": moment.unix(scheduled.date).format("HH:mm");
			summary.html("<span><i class='icon-time'></i> " + moment.unix(scheduled.date).format("dddd, D MMMM YYYY") + "<em class='negative'>" + time + "</em></span>");
		}
		
		// Refresh repeat summary
		this.summarizerepeat();
				
		return this;
	},
	
	'summarizerepeat' : function()
	{
				
		// Collect the data
		var scheduled = this.parsescheduled();
		
		// Emergency breaks
		if(!scheduled.repeat) return this;
		
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
		
		if(times) summary.html("<span>" + times + " times " + (end? "<em class='negative'>until " + end.format("dddd, D MMMM YYYY") + "</em>": "") + "</span>");
						
		return this;
	},
	

	/**
	 *	Finalize
	**/
	
	'preview' : function()
	{
		// Animate compose view
		this.$el.addClass("preview-mode");
	
		// Create new preview object
		this.preview = new Cloudwalkers.Views.Preview({model: this.draft, network: this.network, previewtype: 'default', streamid: this.activestream.id});
		
		// Add preview view to Compose
		this.$el.find('.preview-container').append(this.preview.render().el);
		
	},
	
	'endpreview' : function()
	{
		// Remove preview pane
		this.preview.remove();
		
		// Animate compose view
		this.$el.removeClass("preview-mode");
	},
	
	'save' : function(status)
	{
		// Prevent empty patch
		if (!this.draft.validateCustom()) return Cloudwalkers.RootView.information ("Not saved", "You need a bit of content.", this.$el.find(".modal-footer"));

		//Disables footer action
		this.disablefooter();

		if(!status || !_.isString(status))	status = "draft";

		this.draft.save({status: status}, {patch: this.draft.id? true: false, success: this.thankyou.bind(this)});
	},
	
	'post' : function()
	{		
		// Prevent empty post
		if (!this.draft.validateCustom()) return Cloudwalkers.RootView.information ("Not saved", "You need a bit of content.", this.$el.find(".modal-footer"));

		//Disables footer action
		this.disablefooter();

		// Redirect streamless to draft
		if(!this.draft.get("streams").length) this.save("scheduled");
		
		// Or just post
		else this.draft.save({status: "scheduled"}, {patch: this.draft.id? true: false, success: this.thankyou.bind(this)});
		
	},
	
	'postaction' : function()
	{		
		var streamids = [];
		
		this.$el.find(".action-tabs div").each(function() { streamids.push($(this).data("stream"))});
		
		// Check stream selection
		if (!streamids.length)
			return Cloudwalkers.RootView.information ("Not saved", "Select at least 1 network", this.$el.find(".modal-footer"));
		
		// Check text if required
		if (this.options[this.type].indexOf("editor") >= 0 && !this.draft.get("body").html)
			return Cloudwalkers.RootView.information ("Not saved", "Provide some text first", this.$el.find(".modal-footer"));
		
		//Disables footer action
		this.disablefooter();
		
		// Create & Save
		var postaction = this.reference.actions.create({streams: streamids, message: this.draft.get("body").html, actiontype: this.type}, {success: this.thankyou.bind(this)});
		this.loadListeners(postaction, ['request:action', 'sync']);
		postaction.trigger("request:action");
	},
	
	'thankyou' : function()
	{
		this.$el.addClass("thank-you");
		setTimeout(function(){ this.$el.modal('hide'); }.bind(this), 1000);
	},

	'disablefooter' : function()
	{
		this.$el.find(".modal-footer .btn").attr("disabled", true);
	},
	
	'invalid' : function(model, error)
	{
		Cloudwalkers.RootView.alert(model.get("title") + " " + error);
	}

});