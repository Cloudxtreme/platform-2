/* 
 *	Small entry for notes
 */

define(
	['Views/Entries/SubEntry', 'mustache', 'Views/Modals/SimpleCompose'],
	function (SubEntry, Mustache, SimpleComposeView)
	{
		var NoteEntry = SubEntry.extend({
	
			template: 'subnote',
			className: 'subentry subnote',

			initialize : function(options)
			{	
				this.parameters = {};
				if(options) $.extend(this, options);

				this.listenToOnce(this.model, 'change', this.render);
				this.listenTo(this.model, 'destroy', this.remove);
			},

			render : function ()
			{
				// Apply role permissions to template data
				Cloudwalkers.Session.censuretemplate(this.model.attributes);
				
				this.model.attributes.date = moment(this.model.attributes.date).format("DD MMM YYYY");
				this.$el.html (Mustache.render (Templates[this.template], this.model.attributes));

				if(this.isnew)	this.makenew();

				return this;
			},

			makenew : function()
			{
				this.$el.addClass('new');

				setTimeout(function(){
					this.$el.removeClass('new');
				}.bind(this), 2000)
			},

			togglenote : function()
			{	
				this.$el.find('.note-body').slideToggle('fast');
			},

			action : function(e)
			{	
				e.stopPropagation();

				// Action token
				var token = $(e.currentTarget).data ('notification-action');		
				this.model.trigger("action", token);

				if(token == 'edit'){
					if(!this.$el.find('.note-body').is(':visible'))	this.togglenote();

					if(this.isediting)	this.canceledit();
					else				this.editnote();
				}
			},

			editnote : function()
			{	
				var composenote = new SimpleComposeView({model: this.model});

				this.listenTo(composenote, 'edit:cancel', this.canceledit);
				this.listenTo(composenote, 'save:success', this.saved);

				this.$el.find('.note-body').html(composenote.render().el);

				this.isediting = true;
			},

			canceledit : function()
			{	
				this.$el.find('.note-body').html(this.model.get("text"));

				this.isediting = false;
			},

			saved : function()
			{
				setTimeout(function(){
					this.canceledit();
				}.bind(this),200)
			},

			remove : function ()
		    {	
				this.$el.slideUp(300);

				setTimeout(function(){
					this.remove()
				}.bind(this),300);
		    }

		});	

		return NoteEntry;
});