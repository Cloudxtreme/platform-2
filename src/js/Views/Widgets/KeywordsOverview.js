	/**
* A standard widget
*/
define(
	['Views/Widgets/Widget', 'mustache'],
	function (Widget, Mustache)
	{
		KeywordsOverview = Widget.extend({

			id : 'monitorparent',
			entries : [],

			events : {
				'submit form' : 'editCategory',
				'click .edit-toggler' : 'toggleEditCategory',
				'click .delete-category' : 'deleteCategory',
				'click .delete-keyword' : 'deleteKeyword',
				'click [data-keyword]' : 'toggleEditKeyword'
			},

			options : {},

			initialize : function (options)
			{
				if(options)	this.options = options;

				this.channel = Cloudwalkers.Session.getChannel("monitoring");
				
				this.editor = this.options.editor;
				
				// Listen to channel changes
				this.listenTo(Cloudwalkers.Session.getChannels(), 'sync', this.render);
			},

			render : function ()
			{
				categories = this.channel.channels.map(function(cat){ return {id: cat.id, name: cat.get("name"), settings: cat.get("settings"), keywords: cat.channels.models}});

				var data = {categories: categories};
				
				//Mustache Translate Render
				this.mustacheTranslateRender(data);
				
				// Apply role permissions to template data
				Cloudwalkers.Session.censuretemplate(data);
				
				this.$el.html (Mustache.render (Templates.keywordsoverview, data));
				
				return this;
			},

			toggleEditCategory : function (e)
			{
				e.stopPropagation();
				
				$(e.target).closest('[data-category]').find('.category-name, .category-edit').toggle();
			},

			editCategory : function (e)
			{
				e.stopPropagation();

				var $cat = $(e.target).closest('[data-category]');
				var name = $cat.find('[name="name"]').val();
				var remember = $cat.find('[name="remember"]').val();

				var settings = {
					remember: remember
				};
				
				var channel = Cloudwalkers.Session.getChannel(Number($cat.attr('data-category')));
				channel.endpoint = '';
				channel.save({
					name: name,
					settings: settings
				});
				
				$cat.find('.name_val').html(name);
				$cat.find('.remember_val').html(remember);
				
				return false;
			},

			deleteCategory : function (e)
			{
				e.stopPropagation();
				
				var $cat = $(e.target).closest('[data-category]');
				
				Cloudwalkers.RootView.confirm 
				(
					this.translateString('are_you_sure_you_want_to_remove_this_category'), 
					function () 
					{
						Cloudwalkers.Session.getChannel(Number($cat.attr('data-category'))).destroy();
						Cloudwalkers.RootView.navigation.render();
						$cat.next().remove();
						$cat.remove();
					}
				)
				
			},

			toggleEditKeyword : function (e)
			{
				e.stopPropagation();

				var id = Number($(e.target).closest('[data-keyword]').data('keyword'));
				
				this.editor.fillKeyword(id, e);

				$("html, body").animate({ scrollTop: $('#keywordsfilter').offset().top-50 }, 500);
			},

			deleteKeyword : function (e)
			{
				e.stopPropagation();
				
				var id = Number($(e.target).closest('[data-keyword]').attr('data-keyword'));

				Cloudwalkers.RootView.confirm 
				(
					this.translateString('are_you_sure_you_want_to_remove_this_filter'), 
					function () 
					{
						Cloudwalkers.Session.getChannel(id).destroy();
						$(e.target).parent().remove();
					}
				)
				
				
			},

			translateString : function(translatedata)
			{	
				// Translate String
				return Cloudwalkers.Polyglot.translate(translatedata);
			},
			
			mustacheTranslateRender : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"categories_overview",
					"change_name",
					"remember_for",
					"days",
					"save_changes"
				];

				this.translated = [];

				for (var k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}

			/*
			'editKeyword' : function (e)
			{
				var self = this;
				
				var data = {};
				data.keyword = this.$el.selectedkeywordid;
				data.category = $('#keyword_create_category').val();//.attr ('data-addkeyword-category-id');
				
				if($('#filter_include').val())
					data.include = $('#filter_include').val();
					
				if($('#filter_exclude').val())
					data.exclude = $('#filter_exclude').val();
					
				if(Number($('#filter_locale').val()) != 0)
					data.languages = [$('#filter_locale').val()];
					
				if(Number($('#filter_region').val()) != 0)
					data.countries = [$('#filter_region').val()];

				this.sendData 
				(
					CONFIG_BASE_URL + 'json/wizard/monitoring/editkeyword?account=' + Cloudwalkers.Session.getAccount ().get ('id'),
					data,
					function ()
					{
						self.render ();
						Cloudwalkers.Session.refresh ();
					}
				);
				
				this.toggleToCreateKeyword(e);
			},
			
			'toggleToCreateKeyword' : function (e)
			{
				e.preventDefault ();
				
				this.$el.find("[data-keyword] input, [data-keyword] select").val('');
				this.$el.find("[data-keyword] select").val(0);
				this.$el.find("[data-keyword] .keyword-filter, .edit-keyword").addClass("inactive");
				
				this.$el.find(".add-keyword").removeClass("inactive");
			},

			'sendData' : function (url, data, callback)
			{
				$.ajax (
					url,
					{
						'dataType' : 'json',
						'data' : JSON.stringify (data),
						'processData' : false,
						'cache' : false,
						'type' : 'post',
						'success' : function (data)
						{
							if (typeof (data.error) != 'undefined')
							{
								Cloudwalkers.RootView.alert (data.error.message);
							}
							else
							{
								callback ();
							}
						}
					}
				);
			},
			
			'fail' : function ()
			{
				Cloudwalkers.RootView.growl ("Oops", "Something went sideways, please reload the page.");
			}
			*/
		});

		return KeywordsOverview;
});


