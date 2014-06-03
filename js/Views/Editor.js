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
	
	'urlprocessing' : false,
	'limit' : null,
	'content' : '',
	'pos' : 0,
	
	
	// Should be outside Editor, should be in compose
	'restrictedstreams' : {'twitter' :140, 'linkedin' : 700},
	//'restrictedstreams' : ['twitter', 'default'],
	
	'events' : {
		
		/*// Triggers
		'update:content' : 'render',
		'update:limit' : 'renderlimit',
		'append:content' : 'append',
		
		// Listen to $contenteditable
		'keyup #compose-content' : 'listentochange',
		'paste #compose-content' : 'listentochange',
		'blur #compose-content' : 'endchange',

		'click #swaplink' : 'swaplink',
		'keydown #composeplaceholder' : 'updatecontainer',*/

		/* Oembed data types */
		//'click [data-type="title"] i' : 'addoetitle',
		//'click [data-type="content"] i' : 'addoecontent',
		//'click [data-type="image"] i' : 'addoeimg',
	},
	
	// regex magic
	'xtrimmable' : /<[^>]*>|&nbsp;|\s/g,
	'xurlbasic' : /http|[w]{3}/g,
	'xshortens' : /http|[w]{3}/g,
	
	'xurlpattern' : /(^|\s|\r|\n|\u00a0)((https?:\/\/|[w]{3})?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)(\s|\r|\n|\u00a0)/gi,
	/*/(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/img,*/
	
	
	'initialize' : function (options)
	{
		// Parameters
		if(options) $.extend(this, options);
		
		// Add listeners to
		//dis = this;
		//this.listenTo(this.parent, "update:streams", function(stream){console.log(stream);});
		//this.listenTo(this.parent, "update:stream", function(data){dis.togglecontent(data)});
		
		// URL Shortener
		this.listenTo(Cloudwalkers.Session.UrlShortener, "sync", this.parseurl)
		
	},

	'render' : function (content)
	{
		// Data basics
		if(content !== undefined) this.content = content;
		
		// Do the render
		this.$el.html (Mustache.render (Templates.editor, {limit: this.limit}));
		
		this.$contenteditable = this.$el.find('#compose-content').eq(0);
		this.contenteditable  = this.$contenteditable.get(0);
		
		this.medium = new Medium({
			element: this.contenteditable,
			debug: true,
			modifier: 'auto',
			autoHR: false,
			mode: 'rich',
			modifiers: { 86: 'paste' },
			tags: {
				paragraph: 'p',
				innerLevel: ['a', 'b', 'u', 'i', 'img', 'strong']
			},
			cssClasses: {
				editor: 'Medium',
				pasteHook: 'Medium-paste-hook',
				placeholder: 'Medium-placeholder'
			}
		});
		
		//this.medium.utils.addEvent(this.medium.settings.element, 'change', function(e){ console.log("medium is changed", e) });
		
		this.medium.utils.addEvent(this.medium.settings.element, 'keyup', this.listentochange.bind(this));
		//utils.listenTo("change", function(e){ console.log("medium changed", e) });
		
		/*// Add content
		this.$contenteditable.html(this.content);
		if(this.content) this.listentochange();
		*/
		return this;
	},
	
	'append' : function (content)
	{
		if(!content) return;
		
		// Append content
		this.$contenteditable.append(content);
		this.listentochange();
	},
	
	'renderlimit' : function (limit)
	{
		if(typeof limit != "undefined") this.limit = limit;
	},
	
	'listentochange' : function(e) {

		var content = this.$contenteditable.html();
		
		if(this.content !== content)
		{
			this.pos = this.cursorpos();
			
			// Do the screen
			this.content = this.screen(content, e? e.keyCode: null);
			
			// Update
			this.$contenteditable.html(this.content);
			this.cursorpos(this.pos);
			
			this.trigger('change:content', this.content);
		}
	},
	
	/**
	 *	Screen
	 *
	 *	Test all filter options against content
	**/
	
	'screen' : function (content, keyCode)
	{
		// empty string
		if(!content.replace(this.xtrimmable, ""))
		{
			this.trigger("charcount", 0);
			return "";
		}
		
		
		// Filter url
		if(content.match(this.xurlbasic))	content = this.filterurl(content);
		
		// Filter limit
		if(this.limit)						content = this.filterlimit(content);
		
		// Filter enter
		// Is this needed for debug? If it is, check keyCode
		
		return content;
	},
	
	/* URL functions */
	
	'filterurl' : function(content){
		
		// Match url
		var url = content.match(this.xurlpattern);
		
		// Trim & request shortened
		if (url && !this.urlprocessing)
		{
			this.urlprocessing = true;
		
			url.forEach( function(str) { 
				Cloudwalkers.Session.UrlShortener.fetch({q: str.trim(), error: this.releaseurlprocessing});
			});
		}

		return content;
	},
	
	'parseurl' : function (model)
	{
		// URL still there?
		if (this.content.indexOf(model.longurl) < 0) return;
		
		this.urlprocessing = false;
		this.pos = this.cursorpos();
		
		// Replace url whith short tag
		this.content = this.content.replace(model.longurl, "<short data-url='" + model.longurl + "'>" + model.get("shortUrl") + "</short>");
		this.$contenteditable.html(this.content);
		this.cursorpos(this.pos);
		
		this.trigger('change:content', this.content);
	},
	
	'releaseurlprocessing' : function (){ this.urlprocessing = false; },
	
	'toggleurl' : function ()
	{
		//
	},
	
	'breakurl' : function ()
	{
		//
	},
	
	/* Limit functions */
	
	
	/* Cursor functions */
	
	'cursorpos' : function (pos)
	{
		// Basics
		var document = this.contenteditable.ownerDocument || this.contenteditable.document;
		var win = document.defaultView || document.parentWindow;
		var sel, range, preCaretRange, nodelength, currentnode;
		
		// Get cursor position
		if (pos === undefined)
		{
			pos = 0;
	
		    if (win.getSelection !== undefined)
		    {
				range = win.getSelection().getRangeAt(0);
				preCaretRange = range.cloneRange();
				preCaretRange.selectNodeContents(this.contenteditable);
				preCaretRange.setEnd(range.endContainer, range.endOffset);
				
				pos = preCaretRange.toString().length;
				
			}else if((sel = doc.selection) && sel.type != "Control")
			{
				range = sel.createRange();
				preCaretRange = document.body.createTextRange();
				preCaretRange.moveToElementText(this.contenteditable);
				preCaretRange.setEndPoint("EndToEnd", range);
				pos = preCaretRange.text.length;
			}
		}
		
		// Set cursor position
		else {
	
			//Map the node sizes
			this.$contenteditable.children().get().forEach( function(node)
			{
				if (!(nodelength = node.length))
					nodelength = (node.id)? node.outerText.length: node.childNodes[0].length;

				if (nodelength >= pos) { currentnode = node; return false; }
				else return pos -= nodelength;
			});
			
			range = document.createRange();
			sel = win.getSelection();
	
			if (currentnode) var node = currentnode.childNodes[0] ? currentnode.childNodes[0] : currentnode;
			else return false;
			
			range.setStart(node, pos);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
		}
		
		return pos;
	},
	
	
	 
	
	/** OLD **/

	
	

	'greyout' : function(extrachars, limit){
		
		var extra = this.$contenteditable.text().slice(extrachars);
		var notextra = this.$contenteditable.text().slice(0, limit);
		var content;

		if(this.currentUrl)
			notextra = this.parsecontent(notextra);

		content = notextra+'<span id="extrachars" $contenteditable="true">'+extra+'</span>';


		return content;
	},

	// Placeholder = false as default
	'parsecontent' : function(cont, placeholder){
		
		var urltag = '';
		//console.log(this.currentUrl);
		if(this.currentUrl && !placeholder)
			urltag = ('<span id="urltag" $contenteditable="true">'+this.currentUrl+'<i class="icon-link" id="swaplink"></i></span>');
		if(this.currentUrl && placeholder) //Unfinished
			urltag = ('<div id="urltag placehold"><span $contenteditable=false>'+this.currentUrl+'<i class="icon-link" id="swaplink"></i></span></div>');

		var content = cont.replace(this.currentUrl, urltag);	

		return content;
	},

	'updatecontainer' : function(forcecontent){
		
		var charcount = this.$contenteditable.text().length;
		var total = this.restrictedstreams[this.network] - charcount;
		var placeholder = this.$contenteditable.find('#composeplaceholder');
		var content;
		var cursorpos = this.getcursosposition(this.$contenteditable.get(0));

		//There is a placeholder in the content
		if(placeholder.length > 0)
			content = this.parsecontent(placeholder.html(), true);

		//It's a restricted network & over char limit
		if(total && total < 0)
			content = this.greyout(total, this.restrictedstreams[this.network]);
		
		//Just update the content
		else
			content = this.parsecontent(this.$contenteditable.text());
		
		if(forcecontent){
			content = forcecontent;
			var l = this.urldata.oldurl.length;
			var postpos = cursorpos - l;
			cursorpos = postpos + this.urldata.newurl.length +2;
		}

		this.$contenteditable.empty().html(content);
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

	'togglecontent' : function(data)
	{
		if(data){
			var stream = _.isNumber(data) ? data : null;
			var val = _.isObject(data) ? data.html : null;
			var network = stream? Cloudwalkers.Session.getStream(stream).get("network").token : null;
		}

		this.network = network ? network : 'default'; //Keep track of what network we are viewing
		
		if(network && !val){	//Tab with the default's text 
			this.$contenteditable.empty().html(Mustache.render(Templates.composeplaceholder, {content: this.content}));
			this.updatecounter(this.restrictedstreams[this.network] - this.$contenteditable.text().length);
		}else if(!data){		//Tab without any specific content (on default tab)
			this.$contenteditable.empty().html(this.content);
			this.updatecontainer();
		}else{					//Tab with specific content
			if(!val) val = "";
			this.$contenteditable.empty().html(val);
			this.updatecontainer();
		}
		
	},

	'addoetitle' : function(e){
		var text = e.currentTarget.innerText;
		//add tittle
	},

	'addoecontent' : function(e){
		var text = e.currentTarget.parentElement.parentElement.innerText;
		var content = this.$contenteditable.html();
		content = content+'<br/>'+text;

		this.$contenteditable.html(content);
		this.updatecontainer();

		this.trigger("contentadded");
	},	

	'addoeimg' : function(e){
		var imgurl = this.$el.find('[data-type="image"] img').get(0).src;
		this.trigger("imageadded", {type: 'image', data: imgurl, name: imgurl});
	}


});