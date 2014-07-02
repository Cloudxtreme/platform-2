Cloudwalkers.Views.ViewContact = Backbone.View.extend({

	'id' : "compose",
	'className' : "modal hide viewcontact",
	'entries' : [],
	'contactid' : 1583880,	//temp

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

		this.model = Cloudwalkers.Session.getContact(this.contactid)

		if(!this.model)
		   this.model = new Cloudwalkers.Models.Contact({id:this.contactid});

		this.loadmylisteners();
		
	},

	'loadmylisteners' : function(recycle)
	{	
		//Restart collection parameters
		if(this.type == 'note'){
			this.collection = new Cloudwalkers.Collections.Notes();
			this.collection.parenttype = 'contact';
		}	
		else
			this.collection = new Cloudwalkers.Collections.Messages();

		if(recycle)
			this.stopListening(this.collection);

		this.listenTo(this.collection, 'seed', this.fill);
		this.listenTo(this.collection, 'ready', this.updatecontactinfo);
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
			view = new Cloudwalkers.Views.Entry ({model: message, template: template, checkunread: true, parameters:{inboxview: true, notes: true}});
			
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

		if(!type)	type = 'conversation';

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
		this.collection.parse = this.parse;

		this.collection.fetch({success: this.seed.bind(this)});
	},

	'getnotes' : function()
	{

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
		if(this.hascontactinfo)	return;

		var contactinfo;
		var asidehtml;
		
		if(this.collection.first() && this.collection.first().get('from'))
			contactinfo = this.collection.first().get('from')[0];

		if(contactinfo){
			this.$el.find('aside').html(Mustache.render(Templates.viewcontactaside, contactinfo));

			setTimeout(function(){
				this.$el.find('aside').removeClass('nodata');
			}.bind(this), 1)
		}

		this.hascontactinfo = true;

		this.initializenote();
	},

	'initializenote' : function()
	{
		// Add the Note
		var composenote = new Cloudwalkers.Views.ComposeNote({model: this.model});

		this.$el.find('#notecontainer').append(composenote.render().el);

		// Note has been saved, revert UI
		this.listenTo(composenote.note, 'sync', this.doneposting);
	},

	'doneposting' : function()
	{
		setTimeout(function(){
			this.togglecontactnote()
		}.bind(this),200);
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
		var options = {model: view.model, notes: true};
		if (this.type == 'note')	options.template = 'note';		

		$('.viewcontact').addClass('onmessage');

		//Update loader placing
		this.$loadercontainer = $('.inbox-container')

		if (this.inboxmessage) this.inboxmessage.remove();
		
		this.inboxmessage = new Cloudwalkers.Views.Widgets.InboxMessage(options);

		if(this.type && this.type != 'messages')
			this.loadListeners(this.inboxmessage, ['request', 'sync', ['ready', 'loaded']], true);
		
		$(".inbox-container").html(this.inboxmessage.render().el);
		
		// Load related messages
		if(this.type && this.type == 'conversation')
			this.inboxmessage.showrelated(); //(view.model);
		
		this.$el.find(".list .active").removeClass("active");
		view.$el.addClass("active");
	},

	'backtolist' : function()
	{
		$('.viewcontact').removeClass('onmessage');

		//Update loader placing
		this.$loadercontainer = $('ul.list');
	},

	'togglecontactnote' : function()
	{
		if($('.viewcontact').hasClass('writenote')){
			$('.viewcontact').removeClass('writenote');
			 setTimeout(function(){
			 	$('.contactbottom').slideDown('fast');
			}, 100)
		}else{			 
			$('.contactbottom').slideUp('fast');
			setTimeout(function(){
				$('.viewcontact').addClass('writenote');
			}, 100)			
		}
	},

	'toggle' : function()
	{
		//Toggle between endpoints here
	},

	// Implement after working endpoints
	/*'lastmessages' : function()
	{
		this.model.urlparams = ['messages'];
		this.model.fetch();
	},

	'lastconversations' : function()
	{
		this.model.urlparams = ['conversations'];
		this.model.fetch();
	},*/

	'filterparams' : function()
	{	//Hardcoded test data
		
		var param = {records: 20, contacts: this.contactid};
		return param;
	},

	'post' : function()
	{
		//Get the note text
		//Model.save
	}
});