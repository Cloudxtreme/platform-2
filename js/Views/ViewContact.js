Cloudwalkers.Views.ViewContact = Backbone.View.extend({

	'id' : "compose",
	'className' : "modal hide viewcontact",
	'entries' : [],
	//'contactid' : 1583880,	//temp

	'events' : {
		'click .end-preview td i' : 'backtolist',
		'click #contactfilter li' : 'loadmessages',
		'click [data-action=write-note]' : 'togglecontactnote',
		'click #post' : 'post',
		'click aside *[data-action]' : 'action',
		'keyup aside #tags' : 'entertag',
		'click .load-more' : 'more'
	},

	'initialize' : function(options)
	{	
		// Parameters
		if(options) $.extend(this, options);

		//this.model = Cloudwalkers.Session.getContact(this.contactid)

		this.contact = options.contact? options.contact.model: null;
		
		if(this.contact)
			this.model = new Cloudwalkers.Models.Contact(this.contact);

		if(!this.model && this.contactid)
		   this.model = new Cloudwalkers.Models.Contact({id:this.contactid});

		this.loadmylisteners();
		
	},

	'loadmylisteners' : function(recycle)
	{	
		//Restart collection parameters
		if(this.type == 'note'){
			this.collection = new Cloudwalkers.Collections.Notes();
			this.collection.parentmodel = 'contact';	//Hack
			this.collection.parenttype = 'contact';		//Hack
		}	
		else
			this.collection = new Cloudwalkers.Collections.Messages();

		if(recycle)
			this.stopListening(this.collection);

		this.listenTo(this.collection, 'request', this.hidemore)
		this.listenTo(this.collection, 'seed', this.fill);
		this.listenTo(this.collection, 'sync', this.paginate);
		this.listenTo(this.collection, 'ready', this.showmore);

		//this.listenTo(this.collection, 'ready', this.updatecontactinfo);
		this.loadListeners(this.collection, ['request', 'sync', ['ready', 'loaded']], true);
		
	},

	'render' : function()
	{	
		//Mustache Translate Render

		// Apply role permissions to template data
		Cloudwalkers.Session.censuretemplate(this.contactinfo);

		// Create view
		var view = Mustache.render(Templates.viewcontact, this.contactinfo);
		this.$el.html (view);

		this.$container = this.$el.find ('ul.list');
		this.$loadercontainer = this.$el.find ('ul.list');

		this.trigger("rendered");

		this.updatecontactinfo();

		if (Cloudwalkers.Session.isAuthorized('ACCOUNT_NOTES_MANAGE'))
			this.initializenote();

		if ((Cloudwalkers.Session.isAuthorized('ACCOUNT_TAGS_VIEW')) || (Cloudwalkers.Session.isAuthorized('ACCOUNT_TAGS_MANAGE')))
			this.loadtagui();

		this.begintouch();

		return this;	
	},

	'fill' : function(messages)
	{	
		if(this.refreshview){
			//Clear entries
			$.each(this.entries, function(n, entry){ entry.remove()});
				this.entries = [];
		}

		if(!messages.length) 	this.$el.find('.messagelist').addClass('empty-content')
		else					this.$el.find('.messagelist').removeClass('empty-content')

		var message;
		var view;
		var template = this.type == 'note'? 'smallentrynote': 'smallentry';

		// Add models to view
		for (n in messages)
		{	
			message = messages[n];
			message.attributes.arrow = 'arrow';
			view = new Cloudwalkers.Views.Entry ({model: message, template: template, checkunread: true, parameters:{inboxview: true, parent: this}});
			
			this.entries.push (view);
			this.listenTo(view, "toggle", this.loadmessage);
			
			this.$container.append(view.render().el);
		}	

		this.refreshview = false;
	},

	'seed' : function(collection, response)
	{
		this.collection.models = response.contact.messages;
		this.collection.length = this.collection.models.length;

		this.collection.trigger('seed', this.collection.models);		
	},

	'begintouch' : function(type)
	{
		if(!type)	type = 'messages';

		this.type = type;

		this.loadmylisteners(true);
		this.refreshview = true;

		if(type == 'messages')				this.getmessages();
		else								this.touch(type);
	},

	'getmessages' : function()
	{
		this.model.urlparams = ['messages'];
		this.collection.url = this.model.url();
		this.collection.parenttype = 'contact';
		this.collection.contactinfo = this.contactinfo;
		this.collection.parse = this.parse;

		this.collection.fetch({success: this.seed.bind(this)});
	},

	'parse' : function (response)
	{	
		// Solve response json tree problem
		if (this.parenttype)
			response = response[this.parenttype];
		
		if(response[this.typestring]){
			
			for (n in response[this.typestring]){

				response[this.typestring][n] = new Cloudwalkers.Models.Message(response[this.typestring][n])
				response[this.typestring][n].generateintro();
				response[this.typestring][n].set("read",1); //Force read UI	

				response[this.typestring][n].set("fulldate", 
					moment(response[this.typestring][n].get("date")).format("DD MMM YYYY HH:mm")
				);

				response[this.typestring][n].set("icon", this.contactinfo.network? this.contactinfo.network.icon: null);
				response[this.typestring][n].set("networkdescription", this.contactinfo.network? this.contactinfo.network.name: null);
				response[this.typestring][n].set("networktoken", this.contactinfo.network? this.contactinfo.network.token: null);
			}	
		}

		// Ready?
		this.ready();

		return response[this.typestring];
	},

	'touch' : function(type, params)
	{	
		this.collection.parentmodel = this.model;
		this.model.urlparams = [type+'ids'];
		this.model.parameters = params || false;
		this.collection.url = this.model.url();
		
		this.collection.fetch({success: this.touchresponse.bind(this)});
	},

	'touchresponse' : function(collection, response)
	{	
		var ids = response['contact'][this.collection.typestring];

		this.model.urlparams = [this.type+'s'];
		this.model.parameters = {ids: ids.join(",")};
		this.collection.url = this.model.url();

		// Store results based on url
		//Store.set("touches", {id: this.collection.url, modelids: ids, cursor: this.cursor, ping: Cloudwalkers.Session.getPing().cursor});
	
		// Seed ids to collection
		this.collection.seed(ids);
	},

	'updatecontactinfo' : function()
	{
		var contactinfo = this.model.attributes;

		if(contactinfo){
			
			// Apply role permissions to template data
			Cloudwalkers.Session.censuretemplate(contactinfo);

			//Mustache Translate Render
			this.mustacheTranslateRender(contactinfo);

			// View Tags
			contactinfo.tags = true;
			this.$el.find('aside').html(Mustache.render(Templates.viewcontactaside, contactinfo));

			setTimeout(function(){
				this.$el.find('aside').removeClass('nodata');
			}.bind(this), 1)

			this.hascontactinfo = true;
			this.contactinfo = contactinfo;
		}
	},

	'initializenote' : function()
	{
		// Add the Note

		var composenote = new Cloudwalkers.Views.SimpleCompose({parent: this.model, persistent: true});

		this.composenote = composenote;
		this.$el.find('#notecontainer').append(composenote.render().el);

		// Note has been saved, revert UI
		this.listenTo(composenote.model, 'sync', this.doneposting.bind(this,200));
		this.listenTo(composenote, 'edit:cancel', this.doneposting);
	},

	'doneposting' : function(delay)
	{	
		if(!delay)	delay = 0;

		setTimeout(function(){
			this.togglecontactnote()
			this.composenote.remove();
			this.initializenote();

			if(this.type == 'note'){
				this.refreshview = true;
				this.touch('note');
			}
			
		}.bind(this),delay);
	},

	'loadmessages' : function(e)
	{
		this.backtolist();

		var type = $(e.currentTarget).attr("data-type");

		if($(e.currentTarget).hasClass('inactive')){
			this.$el.find('#contactfilter .active').removeClass('active').addClass('inactive');
			$(e.currentTarget).removeClass('inactive').addClass('active');
			
			this.begintouch(type);
		}		
	},

	'loadmessage' : function(view)
	{	
		var options = {model: view.model, notes: view.model.id? true: false, parent: this};
		if (this.type == 'note')	options.template = 'note';		

		$('.viewcontact').addClass('onmessage');

		//Update loader placing
		this.$loadercontainer = this.$el.find('.inbox-container')

		if (this.inboxmessage) this.inboxmessage.remove();
		
		this.inboxmessage = new Cloudwalkers.Views.Widgets.InboxMessage(options);

		if(this.type && this.type != 'messages')
			this.loadListeners(this.inboxmessage, ['request', 'sync', ['ready', 'loaded']], true);
		
		this.$el.find(".inbox-container").html(this.inboxmessage.render().el);
		
		// Load related messages
		if(this.type && this.type == 'conversation')
			this.inboxmessage.showrelated(); 
		else if(this.type && this.type == 'note')
			this.listenTo(this.inboxmessage.model, 'destroy', this.backtolist);
		
		
		this.$el.find(".list .active").removeClass("active");
		view.$el.addClass("active");

	},

	'backtolist' : function()
	{	
		$('.viewcontact').removeClass('onmessage');

		//Update loader placing
		this.$loadercontainer = this.$el.find('ul.list');
	},

	'togglecontactnote' : function()
	{
		if($('.viewcontact').hasClass('writenote')){
			$('.viewcontact').removeClass('writenote');
			 setTimeout(function(){
			 	this.$el.find('.contactbottom').slideDown('fast');
			}.bind(this), 100)
		}else{			 
			this.$el.find('.contactbottom').slideUp('fast');
			setTimeout(function(){
				$('.viewcontact').addClass('writenote');
			}, 100)			
		}
	},

	'filterparams' : function()
	{	//Hardcoded test data
		
		var param = {records: 20, contacts: this.contactid};
		return param;
	},

	'action' : function (element)
	{
		// Action token
		var token = $(element.currentTarget).data ('action');
		
		if(token == 'tag-showedit'){
			this.showtagedit();
		}else if(token == 'tag-add'){
			var tag = $(element.currentTarget).siblings( "input" ).val();
			if(tag) {
				this.submittag(tag);
				$(element.currentTarget).siblings( "input" ).val('');
			}
		}else
			this.model.trigger("action", token);
	},

	/* Tags */
	'loadtagui' : function()
	{
		this.fetchtags();
	},

	'showtagedit' : function()
	{	
		this.$el.find('aside .message-tags').toggleClass("enabled");
		this.$el.find('aside .message-tags .edit').toggleClass("inactive");
	},

	'fetchtags' : function()
	{	
		var tags = new Cloudwalkers.Collections.Tags();	
		tags.parentmodel = this.model;
		tags.parenttype = 'contact';
		this.listenTo(tags,"seed", this.rendertag);

		tags.touch(this.model);
		this.loadedtags = true;
	},

	'rendertag' : function(tags){
		if(!tags.length)	this.$el.find('.tag-list').html('No tags found');
		else				this.$el.find('.tag-list').empty();
		this.$el.find('.tag-list').empty();
		for(n in tags)
		{
			this.addtag(tags[n]);
		}
	},

	'submittag' : function(newtag)
	{	
		// Update Tags - POST
		this.tag = new Cloudwalkers.Models.Tag();

		if(this.model)
			this.tag.parent = this.model;

		this.tag.save({'name': newtag}, {success: this.addtag.bind(this)});
	},

	'addtag' : function(newtag)
	{
		var options = {model: newtag, parent: this.model, template: 'messagetag'}
		var tag;

		tag = new Cloudwalkers.Views.Widgets.TagEntry(options);
		this.$el.find('aside .tag-list').append(tag.render().el);
	},

	'entertag' : function(e)
	{
		if ( e.which === 13 ) {
			var tag = $(e.target).val();
			if(tag) {
				this.submittag(tag);
				$(e.target).val('');
			}
	    }
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"add",
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}

	},

	'paginate' : function(collection, response)
	{	
		if(collection.cursor && response.contact[collection.endpoint].length)
			this.hasmore = true;
		else
			this.hasmore = false;
	},

	'showmore' : function(){

		if(this.hasmore)
			this.$el.find(".load-more").show();
	},
	
	'hidemore' : function()
	{
		this.$el.find(".load-more").hide();
	},

	'more' : function ()
	{
		this.incremental = true;
		
		if(!this.collection.cursor) return false;

		var parameters = {after: this.collection.cursor};
		this.touch(this.type, parameters);
		
		if(!this.hasmore) this.$el.find(".load-more").hide();
	},

	'translateString' : function(translatedata)
	{	
		// Translate String
		return Cloudwalkers.Session.polyglot.t(translatedata);
	},

	'mustacheTranslateRender' : function(translatelocation)
	{
		// Translate array
		this.original  = [
			"latest_messages",
			"latest_conversations",
			"contact_notes",
			"add_contact_note"
		];

		this.translated = [];

		for(k in this.original)
		{
			this.translated[k] = this.translateString(this.original[k]);
			translatelocation["translate_" + this.original[k]] = this.translated[k];
		}
	}
});