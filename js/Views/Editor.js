/**
 *	Editor
 *	Document your functions before writing them.
 *
**/

Cloudwalkers.Views.Editor = Backbone.View.extend({
	
	'id' : "editor",
	'className' : "clearfix",
	'oldUrl' : "",
	'urldata' : {},
	'currentUrl' : false,
	'restrictedstreams' : {'twitter' :140, 'linkedin' : 700},
	//'restrictedstreams' : ['twitter', 'default'],

	
	'events' : {
		/*'click li[data-streams]' : 'togglestreams',
		
		'blur [data-option] input' : 'monitor',
		'blur [data-option] textarea' : 'monitor',
		'keyup [data-option] textarea' : 'monitor',
		*/
		//'keydown #compose-content' : 'filterurl',
		//'keyup #compose-content' : 'filterurl',
		'blur #compose-content' : 'listentochange',
		'keyup #compose-content' : 'listentochange',
		'paste #compose-content' : 'listentochange',

		'click #swaplink' : 'swaplink',
		'keydown #composeplaceholder' : 'updatecontainer',

		/* Oembed data types */
		'click [data-type="title"] i' : 'addoetitle',
		'click [data-type="content"] i' : 'addoecontent',
		'click [data-type="image"] i' : 'addoeimg',
	},


	/*
	* listentochange()		: Triggers the whole process when the content is changed	
	* setdefaultcontent()	: Simple way to add content from outside the view (compose)	
	* filterurl() 			: Monitors the content for url input & renders it's content
	* getcursorposition() 	: Gets the cursor position
	* setcursorposition() 	: Sets the cursor position
	* greyout() 			: Parses the content to grey out extra characters
	* parsecontent() 		: Parses the content to refresh the url styes
	* updatecontainer() 	: Triggers all the text & counters updates
	* updatecounter() 		: Updates the charcount
	* swaplink() 			: Swaps link from shortened to normal
	* togglecontent() 		: Toggles between variations text
	* addoetitle/content/img : triggers content adition back to the compose view
	*
	*/
	
	'initialize' : function (options)
	{
		// Parameters
		if(options) $.extend(this, options);
		
		// Add listeners to
		dis = this;
		//this.listenTo(this.parent, "update:streams", function(stream){console.log(stream);});
		this.listenTo(this.parent, "update:stream", function(data){dis.togglecontent(data)});
		// this.listenTo(this.draft, "update:link");
		
	},

	'render' : function ()
	{
		// Get smallest char restriction
		var maxchars = Math.min.apply(Math, _.values(this.restrictedstreams));
		this.restrictedstreams['default'] = maxchars;

		var data = {maxchars : maxchars};
		this.$el.html (Mustache.render (Templates.editor, data));
		this.contentcontainer = this.$el.find('#compose-content');

		this.setdefaultcontent(this.draft.body);

		//Inits the network as default
		this.network = 'default';

		return this;
	},
	
	
	/*   Code from Compose.js   */
	
	/*'monitor' : function (e)
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
		//this.$el.find("[data-option=limit]").html(140 -val.length).removeClass("color-notice color-warning").addClass(val.length < 130? "": (val.length < 140? "color-notice": "color-warning"));
		
		// Link
		var val = this.$el.find("[data-option=link] input").val();
		if(!streamid || (streamid && body && body.html != val)) input.link = val;
		
		// Update draft
		if (streamid)	this.draft.variation(streamid, input);
		else 			this.draft.set(input);
	},*/

	'listentochange' : function(){

		var currentcontent = this.contentcontainer.html();
		
		if(this.lastcontent && this.lastcontent !== currentcontent){
			this.filterurl();
			this.lastcontent = currentcontent;
		}

		if(!this.lastcontent)	this.lastcontent = currentcontent;
	},

	'setdefaultcontent' : function(content){
		this.contentcontainer.html(content);
		this.listentochange();
	},

	'filterurl' : function(){

		// ARE YOU KIDDING ME?!
		var url_pattern = /(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/img;

		var content = this.contentcontainer.html();
		var url = content.match(url_pattern);

		if(url && !this.currentUrl){

			this.oldUrl = url[0];
			//UGLY hack to make sure the url is right
			while(this.oldUrl.indexOf("ht") != 0)	this.oldUrl = this.oldUrl.substr(1);
			
			$.getJSON( 'http://devapi.cloudwalkers.be/urlshortener/shorten?', {
	            'url' : this.oldUrl,
	            'output' : 'jsonp',
	            'format': "json"
	        })
	        .done(function( data ) {
	            if (data.shortUrl)
	            {	
	                this.urldata = {newurl: data.shortUrl, oldurl: this.oldUrl};

					var oembed = '<div><a href="'+this.oldUrl+'" class="oembed"></a></div>';	            
					var formatedcontent = content.replace(this.oldUrl, Mustache.render (Templates.composeurltag, {url : this.urldata.newurl}));
					
					this.$el.find('#out').empty().html(oembed);
					this.contentcontainer.empty().html(formatedcontent);
					//the URL tag's content
					this.$el.find('#urltag').empty().html(Mustache.render (Templates.composeurl, {url: this.urldata.newurl}));
					
					this.currentUrl = this.urldata.newurl;
					
					this.$el.find(".oembed").oembed(null, null, this.embed).each(function(){
						this.def.done(function(){
							$('#out').addClass('expanded');
							this.updatecontainer();
						});
					});
	            }
	        }.bind(this));
		}
		

		if(!url){
			//removes the preview & waits for another URL
			this.$el.find('#out').empty();
			this.currentUrl = false;	
		}

		//Update the container
		this.updatecontainer();

	},

	'getcursosposition' : function(e){

	    var cursorpos = 0;
	    var doc = e.ownerDocument || e.document;
	    var win = doc.defaultView || doc.parentWindow;
	    var sel;
	    var html = "";

	    if (typeof win.getSelection != "undefined") {

	        var range = win.getSelection().getRangeAt(0);
	        var preCaretRange = range.cloneRange();
	        preCaretRange.selectNodeContents(e);
	        preCaretRange.setEnd(range.endContainer, range.endOffset);
	        cursorpos = preCaretRange.toString().length;

	    }else if((sel = doc.selection) && sel.type != "Control") {
	        var textRange = sel.createRange();
	        var preCaretTextRange = doc.body.createTextRange();
	        preCaretTextRange.moveToElementText(e);
	        preCaretTextRange.setEndPoint("EndToEnd", textRange);
	        cursorpos = preCaretTextRange.text.length;
	    }
		//console.log("get",cursorpos);
		return cursorpos;
	},

	'setcursosposition' : function(cursorpos){

		var el = this.contentcontainer.get(0);
		var nodelength = 0;
		var currentnode;

		//Map the node sizes
		$.each(el.childNodes, function(i, node){
			if(node.length)	nodelength = node.length
			else if (node.id)	nodelength = node.outerText.length;
			else if (node.childNodes[0].length) nodelength = node.childNodes[0].length;
			else return true;
			
			if(nodelength >= cursorpos){
				currentnode = node;
				return false;
			}else{
				cursorpos -= nodelength;
				return true;
			}

		});
		
		var range = document.createRange();
		var sel = window.getSelection();

		if(currentnode)
			var node = currentnode.childNodes[0] ? currentnode.childNodes[0] : currentnode;
		else
			return false;
		
		range.setStart(node, cursorpos);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);

	},

	'greyout' : function(extrachars, limit){
		
		var extra = this.contentcontainer.text().slice(extrachars);
		var notextra = this.contentcontainer.text().slice(0, limit);
		var content;

		if(this.currentUrl)
			notextra = this.parsecontent(notextra);

		content = notextra+'<span id="extrachars" contenteditable="true">'+extra+'</span>';


		return content;
	},

	// Placeholder = false as default
	'parsecontent' : function(cont, placeholder){

		var urltag = '';

		if(this.currentUrl && !placeholder)
			urltag = ('<span id="urltag" contenteditable="true">'+this.currentUrl+'<i class="icon-link" id="swaplink"></i></span>');
		if(this.currentUrl && placeholder) //Unfinished
			urltag = ('<div id="urltag placehold"><span contenteditable=false>'+this.currentUrl+'<i class="icon-link" id="swaplink"></i></span></div>');

		var content = cont.replace(this.currentUrl, urltag);	

		return content;
	},

	'updatecontainer' : function(){
		
		var charcount = this.contentcontainer.text().length;
		var total = this.restrictedstreams[this.network] - charcount;
		var placeholder = this.contentcontainer.find('#composeplaceholder');
		var content;
		var cursorpos = this.getcursosposition(this.contentcontainer.get(0));
		
		//There is a placeholder in the content
		if(placeholder.length > 0)
			content = this.parsecontent(placeholder.html(), true);

		//It's a restricted network & over char limit
		if(total && total < 0)
			content = this.greyout(total, this.restrictedstreams[this.network]);
		
		//Just update the content
		else
			content = this.parsecontent(this.contentcontainer.text());
		
		this.contentcontainer.empty().html(content);
		this.setcursosposition(cursorpos);
		this.updatecounter(total);

		return total;
	},

	'updatecounter' : function(chars){
		if(chars < 0)	chars = 0

		this.$el.find('.limit-counter').empty().html(chars);
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
		this.updatecontainer();
	},

	'togglecontent' : function(data){
		
		if(data){
			var stream = _.isObject(data) ? data.stream : data;
			var val = data.body ? data.body.html : null;
			var network = stream? Cloudwalkers.Session.getStream(stream).get("network").token: false;
		}

		this.network = network ? network : 'default'; //Keep track of what network we are viewing
		
		if(network && !val){	//Tab with the default's text
			this.contentcontainer.empty().html(Mustache.render(Templates.composeplaceholder, {content: this.draft.get("body").html}));
			this.updatecounter(this.restrictedstreams[this.network] - this.contentcontainer.text().length);
		}else if(!data){		//Tab without any specific content
			this.contentcontainer.empty().html(this.draft.get("body").html);
			this.updatecontainer();
		}else{					//Tab with specific content
			if(!val) val.html = "";

			this.contentcontainer.empty().html(val);
			this.updatecontainer();
		}
		
	},

	'addoetitle' : function(e){
		var text = e.currentTarget.innerText;
		//add tittle
	},

	'addoecontent' : function(e){
		var text = e.currentTarget.parentElement.parentElement.innerText;
		var content = this.contentcontainer.html();
		content = content+'<br/>'+text;

		this.contentcontainer.html(content);
		this.updatecontainer();

		this.trigger("contentadded");
	},	

	'addoeimg' : function(e){
		var imgurl = this.$el.find('[data-type="image"] img').get(0).src;
		this.trigger("imageadded", imgurl);
	}

	
	
	/*	
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
			//if (this.draft.get("body").html) this.$el.find("[data-option=limit]").html(140 -this.draft.get("body").html.length);
		
		} else
		{
			if(!val.html) val.html = "";
			
			this.$el.find("[data-option=fullbody] textarea").val(val.html);
			//this.$el.find("[data-option=limit]").html(140 -val.html.length);
		}
		
		// Toggle options
		this.closealloptions();
		
		this.toggleimages(options.indexOf("images") >= 0, options.indexOf("multiple") >= 0);
		
		this.togglelink(options.indexOf("link") >= 0);

	},*/

});