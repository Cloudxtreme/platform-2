/**
 *	Editor
 *	Document your functions before writing them.
 *
**/

Cloudwalkers.Views.Editor = Backbone.View.extend({
	
	'id' : "editor",
	'className' : "clearfix",
	'hasUrl' : false,
	'oldUrl' : "",
	'urldata' : {},
	'currentUrl' : null,
	'maxchars' : 140,

	
	'events' : {
		/*'click li[data-streams]' : 'togglestreams',
		
		'blur [data-option] input' : 'monitor',
		'blur [data-option] textarea' : 'monitor',
		'keyup [data-option] textarea' : 'monitor',
		*/
		'keyup #compose-content' : 'showembed',
		'keydown #compose-content' : 'showembed',
		'click #swaplink' : 'swaplink'
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
		//Max chars are hardcoded?
		var data = {maxchars : this.maxchars};
		
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
		
		dis = this;
		//tagdata = [];
		//eventdata = [];
		//var scriptruns = [];
		var content = this.$el.find('#compose-content').html();
		var url = content.match(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\//);
		
		if(url && !this.hasUrl){
			this.oldUrl = url[0];
			
			$.getJSON( 'http://wlk.rs/api/shorten?callback=?', {
	            'url' : this.oldUrl,
	            'output' : 'jsonp',
	            'format': "json"
	        })
	        .done(function( data ) {
	            if (data.shortUrl)
	            {
	                dis.urldata = {newurl: data.shortUrl, oldurl: dis.oldUrl};
	                dis.currentUrl = dis.urldata.newurl;

	                var oembed = content.replace(/(\s|>|^)(https?:[^\s<]*)/igm,'$1<div><a href="$2" class="oembed"></a></div>');
	                //the URL tag's container
					var formatedcontent = content.replace(/(\s|>|^)(https?:[^\s<]*)/igm, Mustache.render (Templates.composeurltag, {url : dis.urldata.newurl}));
					
					dis.$el.find('#out').empty().html(oembed);
					dis.$el.find('#compose-content').empty().html(formatedcontent);
					//the URL tag's content
					dis.$el.find('#urltag').empty().html(Mustache.render (Templates.composeurl, {url: dis.urldata.newurl}));
					dis.movecursor(dis.$el.find('#urltag').get(0));
					
					//Prevents the content to be re-rendered again
					dis.hasUrl = true;
					
					dis.$el.find(".oembed").oembed().each(function(){
						this.def.done(function(){
							$('#out').addClass('expanded');
						});
					});
	            }
	        });
		}

		if(!url){
			//removes the preview & waits for another URL
			this.$el.find('#out').empty();
			this.hasUrl = false;	
		} 

		this.updatecharcount();
	},

	//Moves the cursor to the end of the generated shorter url
	'movecursor' : function (node) {
	    
	    if (typeof window.getSelection != "undefined") {
	        var range = document.createRange();
	        range.setStartAfter(node);
	        range.collapse(true);
	        var selection = window.getSelection();
	        selection.removeAllRanges();
	        selection.addRange(range);
	    }
	},

	'updatecharcount' : function(e){
		var container = this.$el.find('#compose-content');	
		this.$el.find('.limit-counter').empty().html(this.maxchars - container.text().length);

	},

	//Swaps between full url & shortened url
	'swaplink' : function(){

		var url;
		
		if(this.currentUrl == this.urldata.newurl)
			url = this.urldata.oldurl;
		else
			url = this.urldata.newurl

		this.$el.find('#urltag').empty().html(Mustache.render (Templates.composeurl, {url: url}));
		this.currentUrl = url;
		this.movecursor(dis.$el.find('#urltag').get(0));
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

	},

});