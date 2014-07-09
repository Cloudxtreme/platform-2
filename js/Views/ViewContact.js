Cloudwalkers.Views.ViewContact = Backbone.View.extend({

	'id' : "compose",
	'className' : "modal hide viewcontact",
	'entries' : [],
	//'contactid' : 1583880,	//temp

	'events' : {
		'click .end-preview td i' : 'backtolist',
		'click #contactfilter li' : 'loadmessages',
		'click [data-action=write-note]' : 'togglecontactnote',
		'click #post' : 'post'
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

		this.listenTo(this.collection, 'seed', this.fill);
		//this.listenTo(this.collection, 'ready', this.updatecontactinfo);
		this.loadListeners(this.collection, ['request', 'sync', ['ready', 'loaded']], true);
	},

	'render' : function()
	{	
		// Create view
		var view = Mustache.render(Templates.viewcontact, this.contactinfo);
		this.$el.html (view);

		this.$container = this.$el.find ('ul.list');
		this.$loadercontainer = this.$el.find ('ul.list');

		this.trigger("rendered");

		this.updatecontactinfo();
		this.initializenote();

		// make the fetch
		//this.collection.touch(this.model, this.filterparams());
		
		//this.getmessages();
		this.begintouch();

		return this;	
	},

	'fill' : function(messages)
	{	
		var message;
		var view;
		var template = this.type == 'note'? 'smallentrynote': 'smallentry';
		
		//Clear entries
		$.each(this.entries, function(n, entry){ entry.remove()});
			this.entries = [];

		// Add models to view
		for (n in messages)
		{	
			message = messages[n];
			message.attributes.arrow = 'arrow';
			view = new Cloudwalkers.Views.Entry ({model: message, template: template, checkunread: true, parameters:{inboxview: true, parent: this}});
			
			this.entries.push (view);
			this.listenTo(view, "toggle", this.loadmessage);
			
			this.$container.append(view.render().el);

			// Filter contacts
			//this.model.seedcontacts(models[n]);
		}	
	},

	'seed' : function(collection, response)
	{
		this.collection.models = response.contact.messages;
		this.collection.length = this.collection.models.length;

		this.collection.trigger('seed', this.collection.models);		
	},

	'begintouch' : function(type)
	{
		//Clean previous list, if any

		if(!type)	type = 'messages';

		this.type = type;

		this.loadmylisteners(true);

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
			}	
		}

		// Ready?
		if(!response.paging) this.ready();

		return response[this.typestring];
	},

	'touch' : function(type)
	{	
		this.model.urlparams = [type+'ids'];
		this.model.parameters = false;
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
		var composenote = new Cloudwalkers.Views.ComposeNote({model: this.model, persistent: true});

		this.$el.find('#notecontainer').append(composenote.render().el);

		// Note has been saved, revert UI
		this.listenTo(composenote.note, 'sync', this.doneposting.bind(this,200));
		this.listenTo(composenote, 'edit:cancel', this.doneposting);
	},

	'doneposting' : function(delay)
	{	
		if(!delay)	delay = 0;

		setTimeout(function(){
			this.togglecontactnote()
			this.$el.find('#notecontainer textarea').val('');
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

	'updatecontact' : function()
	{

	}
});