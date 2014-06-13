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
	'hasbeenwarned' : false,	//Has the limit char notice popped up alredy?
	'urls' : [],

	'posmap' : [],	
	
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

		/* Oembed data types */
		'click [data-type="title"] .addcontent' : 'addoecontent',
		'click [data-type="content"] .addcontent' : 'addoecontent',
		'click [data-type="image"] i' : 'addoeimg',

		'mouseup #compose-content': 'savepos'

	},
	
	//editableClick: etch.editableInit,


	// regex magic
	'xtrimmable' : /<[^>]*>|&nbsp;|\s/g,
	'xurlbasic' : /http|[w]{3}/g,
	'xshortens' : /http|[w]{3}/g,
	
	'xurlpattern' : /(^|\s|\r|\n|\u00a0)((https?:\/\/|[w]{3})?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)(\s|\r|\n|\u00a0)/g,	
	//'xurlpattern' : /(https?:\/\/[^\s]+)/g,
	
	'initialize' : function (options)
	{	
		// Parameters
		if(options) $.extend(this, options);
		
		// URL Shortener
		this.listenTo(Cloudwalkers.Session.UrlShortener, "sync", this.parseurl);
		this.listenTo(this.parent, "update:stream", function(data){this.togglecontent(data, true)}.bind(this));
		this.listenTo(this.parent, "update:campaign", this.campaignupdated);

		if(navigator.userAgent.match(/(firefox(?=\/))\/?\s*(\d+)/i))
			this.isfirefox = true;
		
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

		//Selection & range base
		this.document = this.contenteditable.ownerDocument || this.contenteditable.document;
		this.win = document.defaultView || document.parentWindow;

		// Add content
		this.$contenteditable.html(this.content);
		if(this.content) this.listentochange();

		return this;
	},

	//Save position on click
	'savepos' : function(e){
		var tagname = e.target.tagName;

		if(tagname != 'I' && tagname !='SHORT')
			this.pos = this.cursorpos();
	},
	
	'listentochange' : function(e, reload) {

		var content = this.$contenteditable.text();
		var extrachars = this.limit - this.$contenteditable.text().length;;
		//console.log("limit:", this.limit)
		this.pos = this.cursorpos(); 

		if(this.content !== content || reload)
		{	
			//Check for URL
			if(!this.currenturl && this.listentourl(content))
				this.processurl();

			if(extrachars <= 0){
				this.greyout(extrachars, this.limit, e);
				
				//if(!this.hasbeenwarned)	this.limitwarning();       			
			}
					
		}

		this.updatecounter(extrachars);	
		this.content = this.$contenteditable.text();

		//Default text styling
		if(this.isdefault && !reload){
			this.$contenteditable.removeClass("withdefault");
			this.isdefault = false;
		}

		this.trigger('change:content', this.content);

		if(reload)	this.clearselections();
	},


	'listentourl' : function(content, keyCode){

		var sel = this.win.getSelection(); 
		var	range = this.document.createRange();
		var	index;
		var	node;
		var	nodetext;
		var	startoffset;
		var	endoffset;
		
		//Contenteditable scope
		range.selectNodeContents(this.$contenteditable.get(0));

		//Search for an url
		node = this.parsenodes(range.startContainer.childNodes);

		//Found url?
		if(!this.currenturl)	return;

		//Get the node with the URL
		//node = range.startContainer.childNodes[index];
		nodetext = node.textContent.replace(/&nbsp;/gi,'');

		//URL offset inside node
		startoffset = nodetext.indexOf(this.currenturl);
		endoffset = startoffset + this.currenturl.length;

		//Apply range
		range.setStart(node, startoffset);
		range.setEnd(node, endoffset);
		sel.removeAllRanges();
        sel.addRange(range);
		
		//Apply Magic
		this.contenteditable.designMode = "on";       	
		
		document.execCommand('createLink', false, this.currenturl);		

		this.contenteditable.designMode = "off";
		
		//Cursor placement change (move to function)
		var endurltext = document.createTextNode(' \u200B\u200B');
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
	},

	//Search for an URL in all the available nodes
	'parsenodes' : function(childnodes)
	{
		var targetnode = null;

		$.each(childnodes, function(i, node){
			
			var url = false;
			var text = node.textContent;		

			if(text)	url = text.match(this.xurlpattern);

			//Found a url
			if(url){
				if(node.nodeType == 3)
					targetnode = node;
				else
					targetnode = this.getnode(node, null, 3);

				this.currenturl = url[0];
				return true; 
			}

		}.bind(this));
		
		return targetnode;
	},

	/* URL functions */	
	'filterurl' : function(content){
		
		// Match url
		var urls = content.match(this.xurlpattern);
		var campaignid = this.draft.get("campaign");
		var campaigns = Cloudwalkers.Session.getAccount().get("campaigns");
		var campaign = campaigns.filter(function(el){ if(el.id == campaignid) return el; })

		var campaignname = campaign.length ? campaign[0].name : null
		
		// Trim & request shortened
		if (urls && !this.urlprocessing){
			this.urlprocessing = true;
			this.urls = urls;
			this.shortenurls(urls, campaignname);
		}

		return content;
	},

	'shortenurls' : function(urls, campaign)
	{
		var options = {
			error : this.releaseurlprocessing
		};

		urls.forEach( function(str) { 

			options.q 	= str.trim();							
			options.campaign = campaign; 

			Cloudwalkers.Session.UrlShortener.fetch(options);
		});
	},

	'parseurl' : function(model)
	{
		
		var urltag = " <short contenteditable='false' data-url='"+ model.longurl +"'>"+ model.get('shortUrl') +"<i class='icon-link' id='swaplink'></i></short>";
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

	'campaignupdated' : function(campaign)
	{
		var urls = this.urls;

		if(urls.length)
			this.shortenurls(urls, campaign)
	},

	'greyout' : function(extrachars, limit, e){

		var sel = this.win.getSelection();
		var range = this.document.createRange();
		var here = this.cursorpos();
		var endnode;
		var enddata;

		//Are we deleting text?
		if(this.content.length >= this.$contenteditable.text().length)	
			this.removegrey();

		//Select the extrachars
		range.selectNodeContents(this.$contenteditable.get(0));

		endnode = range.endContainer.childNodes[range.endContainer.childNodes.length-1];
		enddata = this.cursorpos(this.limit, true);

		range.setStart(enddata.node, enddata.offset);
		range.setEndAfter(endnode);
		sel.removeAllRanges();
        sel.addRange(range);

        //Apply the styling
        this.contenteditable.designMode = "on";
        
        document.execCommand('backColor', false, "#fcc");
        
        this.contenteditable.designMode = "off";

        this.mergechars();
        this.cursorpos(here);

	},

	'removegrey' : function(collapse){

		var sel = this.win.getSelection();
		var range = this.document.createRange();

		if(!this.$contenteditable.find('span').length)	return;

		range.selectNodeContents(this.$contenteditable.find('span').get(0));
		sel.removeAllRanges();
    	sel.addRange(range);

		this.contenteditable.designMode = "on";
    
        document.execCommand('removeFormat', false, null);
        
        this.contenteditable.designMode = "off";

        //sel.collapse(this.$contenteditable.find('span').get(0),1);
	},

	'mergechars' : function(){

		$.each(this.$contenteditable.find('span'), function(n, span)
		{	
			$(span).html($(span).text());

		}.bind(this));
	},
	
	
	/* Cursor functions */
	
	'cursorpos' : function (pos, getoffset)
	{	
		
		var sel, range, preCaretRange, nodelength;
		
		// Get cursor position
		if (pos === undefined)
		{
			pos = 0;
	
		    if (this.win.getSelection() && this.win.getSelection().rangeCount)
		    {	
				range = this.win.getSelection().getRangeAt(0);
				preCaretRange = range.cloneRange();
				preCaretRange.selectNodeContents(this.contenteditable);
				preCaretRange.setEnd(range.endContainer, range.endOffset);
				
				pos = preCaretRange.toString().length;
				
			}
			/*else if((sel = doc.selection) && sel.type != "Control")
			{
				range = sel.createRange();
				preCaretRange = document.body.createTextRange();
				preCaretRange.moveToElementText(this.contenteditable);
				preCaretRange.setEndPoint("EndToEnd", range);
				pos = preCaretRange.text.length;
			}*/
			//console.log("get",pos);
		}
		
		// Set cursor position
		else {	
			
			this.getnode(this.$contenteditable[0], pos);

			var nodedata = this.currentnode;

			if(getoffset)
				return {node: nodedata.node, offset : nodedata.offset}
			
			range = this.document.createRange();
			sel = this.win.getSelection();

			range.setStart(nodedata.node, nodedata.offset);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
			//console.log("set",pos);*/
		}
		
		return pos;
	},

	//Finds a node with a cursor position or type
	'getnode' : function(parentnode, pos, type){
		
		var foundnode;

		$.each(parentnode.childNodes, function(n, node)
		{	
			if(type){
				var nodetype = node.nodeType;
				if (nodetype == type) {
					if(node.childNodes.length)
						foundnode = this.getnode(node, null, type);
					else{
						foundnode = node;
						return false;
					}					
				}
			}else{
				var nodelength = node.textContent.length;
				if (nodelength >= pos) {
					//console.log(node, nodelength, pos)
					if(node.childNodes.length){
						this.getnode(node, pos);
						return false;
					}
					else{
						this.currentnode = {node : node, offset : pos};
						return false;
					}					
				}
				else return pos -= nodelength;
			}

		}.bind(this));

		return foundnode;
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

	},

	'togglecontent' : function(data, setdefault)
	{	
		if(data){
			var stream = _.isNumber(data.id) ? data.id : null;
			var val = _.isObject(data.data) ? data.data.html : null;
			var network = stream? Cloudwalkers.Session.getStream(stream).get("network").token : null;
		}
		
		this.network = network ? network : 'default'; //Keep track of what network we are viewing
		
		if(network && !val){	//Tab with the default's text 
			this.$contenteditable.empty().html(this.draft.get("body").html);
			this.$contenteditable.addClass("withdefault");
			this.isdefault = true;
		}else if(!stream){		//Tab without any specific content (on default tab)
			this.$contenteditable.empty().html(this.draft.get("body").html);
			this.$contenteditable.removeClass("withdefault");
		}else{					//Tab with specific content
			if(!val) val = "";
			this.$contenteditable.empty().html(val);
			this.$contenteditable.removeClass("withdefault");
		}

		this.limit = this.restrictedstreams[this.network];
		
		//this.updatecounter(this.restrictedstreams[this.network] - this.$contenteditable.text().length);
		this.removegrey(true);
		this.listentochange(null, true);
	},

	'limitwarning' : function(){

		//Check here what type of warning to make

		var warnings = {
			//'twitter' : "You have reached the limit of characters for twitter. Any extra characters will be removed from the post.",
			'default' : "You have reached the limit number of characters for twitter. Any extra characters will be removed from the post."
		}

		Cloudwalkers.RootView.alert(warnings.default); 

		this.hasbeenwarned = true;
	},

	'addoetitle' : function(e){
		var text = e.currentTarget.innerText;
		//add tittle
	},

	'addoecontent' : function(e)
	{	
		var text = e.currentTarget.parentElement.textContent;
		var content = this.$contenteditable.html();
		content = content+'<br/>'+text;
		
		this.$contenteditable.html(content);
		this.trigger("change:content");
	},	

	'addoeimg' : function(e){
		var imgurl = this.$el.find('[data-type="image"] img').get(0).src;
		this.trigger("imageadded", {type: 'image', url: imgurl, name: imgurl});
	},

	'clearselections' : function()
	{
		if (window.getSelection) {
		  	if (window.getSelection().empty) {  // Chrome
		    	window.getSelection().empty();
		  	} else if (window.getSelection().removeAllRanges) {  // Firefox
		  		//window.getSelection().removeAllRanges();
		  	}
		} else if (document.selection) {  // IE?
		  	document.selection.empty();
		}
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
	/*'parsecontent' : function(cont, placeholder){
		
		var urltag = '';
		//console.log(this.currentUrl);
		if(this.currentUrl && !placeholder)
			urltag = ('<span id="urltag" $contenteditable="true">'+this.currentUrl+'<i class="icon-link" id="swaplink"></i></span>');
		if(this.currentUrl && placeholder) //Unfinished
			urltag = ('<div id="urltag placehold"><span $contenteditable=false>'+this.currentUrl+'<i class="icon-link" id="swaplink"></i></span></div>');

		var content = cont.replace(this.currentUrl, urltag);	

		return content;
	},*/

	/*'updatecontainer' : function(forcecontent){
		
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

		return total;
	},*/


});