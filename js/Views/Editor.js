/**
 *	Editor
 *	Document your functions before writing them.
 *
**/

Cloudwalkers.Views.Editor = Backbone.View.extend({
	
	'id' : "editor",
	'className' : "clearfix",
	
	'events' : {
		/*'click li[data-streams]' : 'togglestreams',
		
		'blur [data-option] input' : 'monitor',
		'blur [data-option] textarea' : 'monitor',
		'keyup [data-option] textarea' : 'monitor',
		
		'keyup #info' : 'showembed'*/
	},
	
	'initialize' : function (options)
	{
		// Parameters
		if(options) $.extend(this, options);
		
		// Add listeners to
		// this.listenTo(this.draft, "update:streams");
		// this.listenTo(this.draft, "update:stream");
		// this.listenTo(this.draft, "update:link");
		
	},

	'render' : function ()
	{
		
		var data = {};
		
		this.$el.html (Mustache.render (Templates.editor, data));
		
		return this;
	},
	
	
	/*   Code from Compose.js   */
	
	'monitor' : function (e)
	{
		// Stream
		var streamid = this.activestream? this.activestream.id: false;
		var input = {body: {}};
		
		// Subject
		var val = this.$el.find("[data-option=subject] input").val();
		if(!streamid || (streamid && this.draft.variation(streamid, "subject") != val)) input.subject = val;
		
		// Body (will be extended with a shadow body)
		var val = this.$el.find("[data-option=fullbody] textarea").val();
		var body = this.draft.variation(streamid, "body");
		
		if(!streamid || (streamid && body && body.html != val)) input.body.html = val;
		
		// Limit counter
		this.$el.find("[data-option=limit]").html(140 -val.length).removeClass("color-notice color-warning").addClass(val.length < 130? "": (val.length < 140? "color-notice": "color-warning"));
		
		// Link
		var val = this.$el.find("[data-option=link] input").val();
		if(!streamid || (streamid && body && body.html != val)) input.link = val;
		
		// Update draft
		if (streamid)	this.draft.variation(streamid, input);
		else 			this.draft.set(input);
	},

	'showembed' : function(){
		
		tagdata = [];
		eventdata = [];
		var scriptruns = [];
		var text = $('#info').val();
		text = $('<span>'+text+'</span>').text(); //strip html
		text = text.replace(/(\s|>|^)(https?:[^\s<]*)/igm,'$1<div><a href="$2" class="oembed">$2</a></div>');
		text = text.replace(/(\s|>|^)(mailto:[^\s<]*)/igm,'$1<div><a href="$2" class="oembed">$2</a></div>');
		
		$('#out').empty().html(text);
		
		$(".oembed").oembed(null,{
			apikeys: {
				//etsy : 'd0jq4lmfi5bjbrxq2etulmjr',
				amazon : 'caterwall-20',
				//eventbrite: 'SKOFRBQRGNQW5VAS6P',
			},
			//maxHeight: 200, maxWidth:300
		});
	},
	
		
	'togglesubcontent' : function (stream)
	{
		this.activestream = stream;
		
		// Get the right network
		var network = stream? stream.get("network").token: false;
		var icon = stream? stream.get('network').icon: 'default';
		var options = this.options[network];
		var id = stream? stream.id: false;
		
		this.network = network;

		//Disable button for preview "default" messages
		var previewbtn = this.$el.find("#previewbtn")[0];
		previewbtn.disabled = this.network ? false : true;
		
		//var input = this.getinput(network, id);
		
		// Add network icon
		this.$el.find(".modal-body").get(0).className = "modal-body";
		this.$el.find(".modal-body").addClass(icon + "-theme");
		
		// Subject
		if (options.indexOf("subject") >= 0)
		{
			this.$el.find("[data-option=subject].hidden").removeClass("hidden");
			
			var val = network?	this.draft.variation(id, "subject"): this.draft.get("subject");
			
			if(network && !val)	this.$el.find("[data-option=subject] input").val("").attr("placeholder", this.draft.get("subject"));
			else 				this.$el.find("[data-option=subject] input").val(val);
		
		} else					this.$el.find("[data-option=subject]").addClass("hidden");


		// Full Body
		if (options.indexOf("fullbody") >= 0)	this.$el.find("[data-option=limit]").addClass("hidden");
		else									this.$el.find("[data-option=limit].hidden").removeClass("hidden");
		
		var val = network? this.draft.variation(id, "body"): this.draft.get("body");
		
		if(network && (!val || !val.html))
		{
			this.$el.find("[data-option=fullbody] textarea").val("").attr("placeholder", this.draft.get("body").html);
			if (this.draft.get("body").html) this.$el.find("[data-option=limit]").html(140 -this.draft.get("body").html.length);
		
		} else
		{
			if(!val.html) val.html = "";
			
			this.$el.find("[data-option=fullbody] textarea").val(val.html);
			this.$el.find("[data-option=limit]").html(140 -val.html.length);
		}
		
		// Toggle options
		this.closealloptions();
		
		this.toggleimages(options.indexOf("images") >= 0, options.indexOf("multiple") >= 0);
		
		this.togglelink(options.indexOf("link") >= 0);

	}
});