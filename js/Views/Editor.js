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
	'currenturl' : false,
	
	'urlprocessing' : false,
	'limit' : null,
	'content' : '',
	'pos' : 0,

	'posmap' : [],
	'teststring' : '',
	'limit' : 140,
	
	
	// Should be outside Editor, should be in compose
	'restrictedstreams' : {'twitter' :140, 'linkedin' : 700},
	//'restrictedstreams' : ['twitter', 'default'],
	
	'events' : {
		
		// Triggers
		'update:content' : 'render',
		'update:limit' : 'renderlimit',
		'append:content' : 'append',
		
		// Listen to $contenteditable
		'keyup #compose-content' : 'listentochange',
		'paste #compose-content' : 'listentochange',
		'blur #compose-content' : 'endchange',

		'click #swaplink' : 'swaplink',
		'keydown #composeplaceholder' : 'updatecontainer',

		/* Oembed data types */
		//'click [data-type="title"] i' : 'addoetitle',
		//'click [data-type="content"] i' : 'addoecontent',
		//'click [data-type="image"] i' : 'addoeimg',

		'mouseup #compose-content': 'savepos'

	},
	
	//editableClick: etch.editableInit,


	// regex magic
	'xtrimmable' : /<[^>]*>|&nbsp;|\s/g,
	'xurlbasic' : /http|[w]{3}/g,
	'xshortens' : /http|[w]{3}/g,
	
	'xurlpattern' : /(^|\s|\r|\n|\u00a0)((https?:\/\/|[w]{3})?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)(\s|\r|\n|\u00a0)/gi,	
	//'xurlpattern' : /(https?:\/\/[^\s]+)/g,
	
	'initialize' : function (options)
	{	
		// Parameters
		if(options) $.extend(this, options);
		
		// URL Shortener
		this.listenTo(Cloudwalkers.Session.UrlShortener, "sync", this.parseurl);
		this.listenTo(this.parent, "update:stream", function(data){this.togglecontent(data, true)}.bind(this));
		
	},

	'render' : function(content){

		// Data basics
		if(content !== undefined) this.content = content;

		var maxchars = Math.min.apply(Math, _.values(this.restrictedstreams));
		this.restrictedstreams['default'] = maxchars;

		// Do the render
		this.$el.html (Mustache.render (Templates.editor, {limit: maxchars}));
		this.limit = maxchars;
		
		this.$contenteditable = this.$el.find('#compose-content').eq(0);
		this.contenteditable  = this.$contenteditable.get(0);

		// Add content
		this.$contenteditable.html(this.content);
		if(this.content) this.listentochange();

		return this;
	},

	'savepos' : function(e){
		var tagname = e.target.tagName;

		if(tagname != 'I' && tagname !='SHORT')
			this.pos = this.cursorpos();
	},

	'setrange' : function(){

	},

	
	'listentochange' : function(e) {

		var content = this.$contenteditable.html();
		this.pos = this.cursorpos(); 
		if(this.content !== content && !this.currenturl)
		{	
			//this.pos = this.cursorpos();
			
			// Do the screen
			//this.content = this.screen(content, e? e.keyCode: null);
			//console.log("screen output: ", content);
			// Update
			//this.$contenteditable.html(this.content);
			//this.cursorpos(this.pos);
			var extrachars = this.limit - this.$contenteditable.text().length;

			if(this.listentourl(content))
				this.processurl();
				//this.cursorpos(this.pos);
			
			if(extrachars < 0){
				this.greyout(extrachars, this.limit);
			}				

			this.updatecounter(extrachars);
			
			//this.cursorpos(this.pos);
			
			
		}

		if(this.isdefault){
			this.$contenteditable.removeClass("withdefault");
			this.isdefault = false;
		}

		this.trigger('change:content', this.content);
	},


	'listentourl' : function(content, keyCode){

		var document = this.contenteditable.ownerDocument || this.contenteditable.document;
		var win = document.defaultView || document.parentWindow;
		var sel, 
			range, 
			childnodes, 
			index, 
			node,
			nodetext,
			nodetype,
			startoffset,
			endoffset;
		
		//Contenteditable scope
		sel = win.getSelection();
		range = document.createRange();
		range.selectNodeContents(this.$contenteditable.get(0));

		//Fetch the url
		childnodes = range.startContainer.childNodes;
		index = this.parsenodes(childnodes);

		//Found url?
		if(!this.currenturl)	return;

		//Get the node with the URL
		node = range.startContainer.childNodes[index];

		//Parse node text
		if(!(nodetext = node.wholeText)){
			nodetext = node.innerHTML;
			node = node.childNodes[0];
		}

		nodetext = nodetext.replace(/&nbsp;/gi,'');

		//URL offset inside node
		startoffset = nodetext.indexOf(this.currenturl);
		endoffset = startoffset + this.currenturl.length;
		
		//Apply Magic
		this.contenteditable.designMode = "on";

		range.setStart(node, startoffset);
		range.setEnd(node, endoffset);
		sel.removeAllRanges();
        sel.addRange(range);
       	
		document.execCommand('createLink', false, this.currenturl);
		
		this.contenteditable.designMode = "off";
		sel.collapse(node,0);
		
		//Cursor placement change (move to function)
		var endurltext = document.createTextNode(' \u200B\u200B');
		range.collapse(false);
		range.insertNode(endurltext);
		this.$contenteditable.find('a').after(endurltext);
		range.setStartAfter(endurltext);	
		
		sel.removeAllRanges();
        sel.addRange(range);

 		return true;
	},

	'processurl' : function(){

		//Block the url from being edited
		this.$contenteditable.find('a').attr('contenteditable', false);

		//Shorten
		this.filterurl(this.currenturl);

		//Link to unshorten


	},

	'parsenodes' : function(childnodes)
	{
		var targetnode = null;

		$.each(childnodes, function(i, node){
			
			var url = false;
			var text = node.wholeText? node.wholeText : node.innerHTML;		

			if(text)	url = text.match(this.xurlpattern);
			if(url){	targetnode = i; this.currenturl = url[0]; return true; }

		}.bind(this));

		return targetnode;
	},
	
	/**
	 *	Screen
	 *
	 *	Test all filter options against content
	**/
	
	/*'screen' : function (content, keyCode)
	{
		//console.log("screen input: ",content);
		// empty string
		if(!content.replace(this.xtrimmable, ""))
		{
			this.trigger("charcount", 0);
			return "";
		}
		
		// Return key was pressed
		if (keyCode == 13)					content = this.filterreturn(content);
		
		// Filter url
		if(content.match(this.xurlbasic))	content = this.filterurl(content);
		
		// Filter limit
		if(this.limit)						content = this.filterlimit(content);
		
		// Filter enter
		// Is this needed for debug? If it is, check keyCode
		
		return content;
	},*/
	
	/*'filterreturn' : function(content){

		var pos = this.pos;
		var hackchar = '\u200B\u200B'

		String.prototype.insert = function (index, string) {
		  	if (index > 0)
	    		return this.substring(0, index+1) + string + this.substring(index, this.length);
		  	else
		    	return string + this;
		}.bind(this);

		return content.insert(pos, "hackchar");

	},*/

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

	'greyout' : function(extrachars, limit){
		
		var extra = this.$contenteditable.text().slice(extrachars);
		var notextra = this.$contenteditable.text().slice(0, limit);
		var content;

		if(this.currentUrl)
			notextra = this.parsecontent(notextra);

		content = notextra+'<span id="extrachars" $contenteditable="true">'+extra+'</span>';


		return content;
	},

	'parseurl' : function(model){
		//console.log(model.longurl, model.get("shortUrl"));
		var urltag = "<short contenteditable='false' data-url='"+ model.longurl +"'>"+ model.get('shortUrl') +"<i class='icon-link' id='swaplink'></i></short>";
		var self = this;

		this.currenturl = model.longurl;
		this.shorturl = model.get('shortUrl');

		this.$contenteditable.find('a').replaceWith(urltag);
		this.trigger('change:content', this.content);

		var oembed = '<div><a href="'+this.currenturl+'" class="oembed"></a></div>';	            

		this.$el.find('#out').empty().html(oembed);

		this.$el.find(".oembed").oembed(null, null, this.embed).each(function(){
			this.def.done(function(){
				self.$el.find('#out').addClass('expanded');
			});
		});
	},
	
	
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
			//console.log("get",pos);
		}
		
		// Set cursor position
		else {	
			
			//Map the node sizes
			$.each(this.$contenteditable[0].childNodes, function(i, node)
			{	
				if (!(nodelength = node.length)){

					if(node.id)	nodelength = node.outerText.length;
					else if(node.childNodes[0])	nodelength = node.childNodes[0].length;
					else nodelength = 0; //Firefox throws error on node.childNodes[0], lets assume its just markup
				}

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
			//console.log("set",pos);
		}
		
		return pos;
	},

	'updatecounter' : function(chars){
		var limit = this.$el.find('.limit-counter');
		
		if(chars >= 20) limit.removeClass().addClass('limit-counter');
		if(chars < 20)	limit.removeClass().addClass('limit-counter').addClass('color-notice');
		if(chars < 0)	limit.removeClass().addClass('limit-counter').addClass('color-warning');
			
		limit.empty().html(chars);
	},

	//Swaps between full url & shortened url
	'swaplink' : function(){

		var urltag = this.$contenteditable.find('short').data('url');
		// This is what panic makes me do
		var isshorten = urltag.replace(/\s/g, '') == this.currenturl.replace(/\s/g, '');
		var fullurl = "<short contenteditable='false' data-url='"+ this.shorturl +"'>"+ this.currenturl +"<i class='icon-link' id='swaplink'></i></short>";
		var shortenedurl = "<short contenteditable='false' data-url='"+ this.currenturl +"'>"+ this.shorturl +"<i class='icon-link' id='swaplink'></i></short>";
		var sizebefore = this.$contenteditable.text().length;

		if(isshorten)
			this.$contenteditable.find('short').replaceWith(fullurl);
		else
			this.$contenteditable.find('short').replaceWith(shortenedurl);

		var sizeafter = this.$contenteditable.text().length;
		var sizespan = sizeafter - sizebefore;
		var linkpos;

		//Set cursor position
		if(isshorten)
			linkpos = this.$contenteditable.text().indexOf(this.currenturl);
		else
			linkpos = this.$contenteditable.text().indexOf(this.shorturl);

		if(this.pos >= linkpos)
			this.cursorpos(this.pos + sizespan)
		else
			this.cursorpos(this.pos)

		this.pos = this.cursorpos();
		this.trigger('change:content', this.content);

		/*
		var url;
		
		if(this.currentUrl == this.urldata.newurl)
			url = this.urldata.oldurl;
		else
			url = this.urldata.newurl

		this.$el.find('#urltag').empty().html(Mustache.render (Templates.composeurl, {url: url}));
		this.currentUrl = url;
		this.updatecontainer();*/
	},

	'togglecontent' : function(data, setdefault)
	{	
		if(data){
			var stream = _.isNumber(data) ? data : null;
			var val = _.isObject(data) ? data.html : null;
			var network = stream? Cloudwalkers.Session.getStream(stream).get("network").token : null;
		}

		this.network = network ? network : 'default'; //Keep track of what network we are viewing
		
		if(network && !val){	//Tab with the default's text 
			this.$contenteditable.empty().html(this.draft.get("body").html);
			this.$contenteditable.addClass("withdefault");
			this.isdefault = true;
		}else if(!data){		//Tab without any specific content (on default tab)
			this.$contenteditable.empty().html(this.draft.get("body").html);
			this.$contenteditable.removeClass("withdefault");
		}else{					//Tab with specific content
			if(!val) val = "";
			this.$contenteditable.empty().html(val);
			this.$contenteditable.removeClass("withdefault");
		}
		this.limit = this.restrictedstreams[this.network];
		this.updatecounter(this.restrictedstreams[this.network] - this.$contenteditable.text().length);
	},

	'settextdefault' : function(){

		var document = this.contenteditable.ownerDocument || this.contenteditable.document;
		var win = document.defaultView || document.parentWindow;
		var sel, range, preCaretRange, nodelength, currentnode;
		
		sel = win.getSelection();
		range = document.createRange();
		range.selectNodeContents(this.$contenteditable.get(0));

		sel.removeAllRanges();
        sel.addRange(range);

        this.contenteditable.designMode = "on";
       	
		document.execCommand('foreColor', false, '#CCCCCC');
		
		this.contenteditable.designMode = "off";
		sel.collapse(this.$contenteditable.get(0),0);		
		range.collapse(false);

		
	},
	














	/** NEW OLD **/

		/*

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
		
		// Test
		//this.medium.utils.addEvent(this.medium.settings.element, 'keyup', this.listentochange.bind(this));
		
		
		// Add content
		this.$contenteditable.html(this.content);
		if(this.content) this.listentochange();
		
		return this;
	},
	*/
	
	/*'append' : function (content)
	{
		if(!content) return;
		
		// Append content
		this.$contenteditable.append(content);
		this.listentochange();
	},
	
	'renderlimit' : function (limit)
	{
		if(typeof limit != "undefined") this.limit = limit;
	},*/
	 

	/*'parseurl' : function (model)
	{
		// URL still there?
		if (this.content.indexOf(model.longurl) < 0) return;
		
		this.urlprocessing = false;
		this.pos = this.cursorpos();
		
		// Replace url whith short tag
		this.content = this.content.replace(model.longurl, "<short data-url='" + model.longurl + "'>" + model.get("shortUrl") + "</short>");
		this.$contenteditable.html(this.content);
		//this.cursorpos(this.pos);
		
		// 	Back to compose
		this.trigger('change:content', this.content);
	},*/
	
	/*'releaseurlprocessing' : function (){ this.urlprocessing = false; },
	
	'toggleurl' : function ()
	{
		//
	},
	
	'breakurl' : function ()
	{
		//
	},*/
	
	/* Limit functions */
	
	/** OLD **/

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
		
		console.log(forcecontent)

		/*var charcount = this.$contenteditable.text().length;
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

		return total;*/
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