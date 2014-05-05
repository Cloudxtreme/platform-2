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
	'maxchars' : 100,

	
	'events' : {
		/*'click li[data-streams]' : 'togglestreams',
		
		'blur [data-option] input' : 'monitor',
		'blur [data-option] textarea' : 'monitor',
		'keyup [data-option] textarea' : 'monitor',
		*/
		'keydown #compose-content' : 'showembed',
		'keyup #compose-content' : 'showembed',
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
		var url = content.match(/(\s|>|^)(https?:[^\s<]*)/igm);
		//console.log(content);
		//Takes care of the extra chars
		var charcount = this.updatecharcount();
		if( charcount < 0){
			var cursorpos = this.getcursosposition(this.$el.find('#compose-content').get(0)); //Get cursor position
			this.greyout(charcount);
			this.setcursosposition(cursorpos);	//Set cursor position after re-writting content
		}

		if(url && !this.hasUrl){
			this.oldUrl = url[0];
			console.log("entrou");
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
					console.log(dis.urldata);
	                var oembed = content.replace(/(\s|>|^)(https?:[^\s<]*)/igm,'$1<div><a href="$2" class="oembed"></a></div>');
	                //the URL tag's container
					var formatedcontent = content.replace(/(\s|>|^)(https?:[^\s<]*)/igm, Mustache.render (Templates.composeurltag, {url : dis.urldata.newurl}));
					
					dis.$el.find('#out').empty().html(oembed);
					dis.$el.find('#compose-content').empty().html(formatedcontent);
					//the URL tag's content
					dis.$el.find('#urltag').empty().html(Mustache.render (Templates.composeurl, {url: dis.urldata.newurl}));
					
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

	},

	'getcursosposition' : function(element){

	    var caretOffset = 0;
	    var doc = element.ownerDocument || element.document;
	    var win = doc.defaultView || doc.parentWindow;
	    var sel;
	    if (typeof win.getSelection != "undefined") {
	        var range = win.getSelection().getRangeAt(0);
	        var preCaretRange = range.cloneRange();
	        preCaretRange.selectNodeContents(element);
	        preCaretRange.setEnd(range.endContainer, range.endOffset);
	        caretOffset = preCaretRange.toString().length;
	    } else if ( (sel = doc.selection) && sel.type != "Control") {
	        var textRange = sel.createRange();
	        var preCaretTextRange = doc.body.createTextRange();
	        preCaretTextRange.moveToElementText(element);
	        preCaretTextRange.setEndPoint("EndToEnd", textRange);
	        caretOffset = preCaretTextRange.text.length;
	    }
    
		return caretOffset;
	},

	'setcursosposition' : function(cursorpos){

		var el = this.$el.find("#compose-content").get(0);
		var nodelength = 0;
		var currentnode;

		//Map the node sizes
		$.each(el.childNodes, function(i, node){
			if(node.length)	nodelength = node.length
			else if (node.childNodes[0].length) nodelength = node.childNodes[0].length;
			else return true;

			if(nodelength > cursorpos){
				console.log("nodelength:",nodelength, cursorpos);
				currentnode = node;
				return false;
			}else{
				console.log("pivot:", cursorpos);
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

		console.log(el.childNodes);
		range.setStart(node, cursorpos);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	},

	'greyout' : function(extrachars){
		var extra = this.$el.find('#compose-content').text().slice(extrachars);
		var notextra = this.$el.find('#compose-content').text().slice(0, this.maxchars);
		notextra = this.parsecontent(notextra, this.currentUrl);
		this.$el.find('#compose-content').empty().html(notextra+'<span id="extrachars" contenteditable="true">'+extra+'</span>');
	},

	'parsecontent' : function(cont, url){

		var content = cont.replace(url,'');
		content = ('<a href="'+url+'" id="urltag"><span contenteditable=false>'+url+'<i class="icon-unlink" id="swaplink"></i></span></a>'+content);
		return content;
	},

	'updatecharcount' : function(){

		var container = this.$el.find('#compose-content');
		var charcount = container.text().length;
		var total = this.maxchars - charcount;
		
		if(total >= 0)
			this.$el.find('.limit-counter').empty().html(total);

		return total;
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