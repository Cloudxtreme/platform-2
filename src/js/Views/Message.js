define(
	['backbone', 'Views/Root', 'Views/ActionParameters'],
	function (Backbone, RootView, ActionParametersView)
	{
		var Message = Backbone.View.extend({

			events : 
			{
				'click .message-action[data-action]' : 'messageAction',
				'click .children-button.message-children' : 'showchildren'
			},

			className : 'message-view',

			template : 'message',
			tagName : 'tr',

			commentsVisible : false,
			commentsView : null,

			childrencontainer : 'comment-container',

			initialize : function ()
			{
				var self = this;
				this.model.on ('change', function ()
				{
					self.render ();	
				});
			},

			prepareData : function ()
			{
				var self = this;
				var data = jQuery.extend(true, {}, this.model.attributes);
				
				data.shortBody = this.model.shortBody ();

				data.humandate = this.model.humandate();
				data.dateonly = this.model.shortdate ();
				data.time = this.model.time ();

				data.sortedattachments = {};

				// Go trough all attachments and put them in groups
				var attachments = this.model.getProcessedAttachments ();

				if (attachments.length > 0)
				{
					for (var i = 0; i < attachments.length; i ++)
					{
						if (typeof (data.sortedattachments[data.attachments[i].type]) == 'undefined')
						{
							data.sortedattachments[attachments[i].type] = [];
						}
						data.sortedattachments[attachments[i].type].push(attachments[i]);
					}
				}

				// Stream information
				if (this.model.getStream ())
				{
					data.stream = this.model.getStream ().attributes;
				}

				if (this.model.collection)
				{
					data.channel = this.model.collection.id;
				}

				// Statistics: i18,
				if (typeof (data.statistics) != 'undefined')
				{
					for (var i = 0; i < data.statistics.length; i ++)
					{
						if (typeof (data.statistics[i].i18n) != 'undefined')
						{
							data.statistics[i].name = data.statistics[i].value != 1 ? data.statistics[i].i18n[1] : data.statistics[i].i18n[0];
						}
					}
				}


				return this.additionalData (data);
			},

			additionalData : function (data)
			{
				if (this.model.get ('type') == 'OUTGOING')
				{
					data.scheduledate = this.model.scheduledate ();
				}

				return data;
			},

			render : function ()
			{
				var data = this.prepareData ();
				var self = this;

				if (typeof (data.parentmodel) != 'undefined' && typeof (this.options.childtemplate) != 'undefined')
				{
					$(this.el).html (Mustache.render (Templates[this.options.childtemplate], data));	
				}

				else if (typeof (this.options.template) != 'undefined')
				{
					$(this.el).html (Mustache.render (Templates[this.options.template], data));		
				}

				else if (typeof (data.parentmodel) != 'undefined')
				{
					$(this.el).html (Mustache.render (Templates.messagecomment, data));	
				}

				else
				{
					$(this.el).html (Mustache.render (Templates[this.template], data));
				}

				if (data.parentmodel)
				{
					var parameters = { 'model' : data.parentmodel };

					if (typeof (this.options.originaltemplate) != 'undefined')
					{
						parameters.template = this.options.originaltemplate;
					}

					var parentview = new OriginalMessageView (parameters);
					this.$el.find ('.parent-message-view').html (parentview.render().el);
				}

				this.$el.find ('.actions.dropdown').on ('click', function (e)
				{
					e.stopPropagation ();

					self.$el.find ('.dropdown-menu').dropdown ('toggle');

					self.$el.find ('[data-action]').unbind('click').click (function (e)
					{
						//alert ('yues');
						self.messageAction (e);
					})
				});

				if (this.commentsVisible || this.options.showcomments)
				{
					this.showchildrenexec ();
				}

				this.afterRender ();

				this.model.setRead ();

				// Tags
				//this.loadtagui();

				return this;
			},

			messageAction : function (element)
			{
				if ($(element.currentTarget).is ('[data-action]'))
				{
					var actiontoken = $(element.currentTarget).attr ('data-action');
				}
				else if ($(element.target).is ('[data-action]'))
				{
					var actiontoken = $(element.target).attr ('data-action');	
				}
				else
				{
					var actiontoken = $(element.target).parent ('[data-action]').attr ('data-action');	
				}
				
				action = this.model.getAction (actiontoken);

				if (action == null)
				{
					console.log ('Action not found: ' + actiontoken);
					return;
				}

				var targetmodel = this.model;
				if (typeof (action.target) != 'undefined')
				{
					targetmodel = action.target;

					if (typeof (action.originalaction) != 'undefined')
					{
						action = action.originalaction;
					}
				}

				if (typeof (action.callback) != 'undefined')
				{
					action.callback (targetmodel);
				}
				else
				{
					if (action)
					{
						if (action.type == 'dialog')
						{
							var view = new ActionParametersView ({
								'message' : targetmodel,
								'action' : action
							});
							RootView.popup (view);
						}
						else if (action.type == 'simple')
						{
							targetmodel.act (action, {}, function (){});
						}

						else if (action.type == 'write')
						{
							RootView.writeDialog 
							(
								targetmodel,
								action
							);
						}
					}
				}
			},

			afterRender : function ()
			{
				this.time()
			},

			showchildren : function (e)
			{
				
				e.stopPropagation ();
				e.preventDefault ();

				if (this.commentsVisible)
				{
					this.commentsVisible = false;

					this.$el.find ('.comment-label').html ('Show comments');

					// Hide
					this.$el.find ('.' + this.childrencontainer).hide ();
				}
				else
				{
					this.showchildrenexec ();
				}
			},

			showchildrenexec : function ()
			{
			
				console.log("!", "Deprecation error")
				
				/*if (this.commentsView == null)
				{
					var params = {};

					params.parent = this.model;

					if (typeof (this.options.selectedchild) != 'undefined')
					{
						params.selectedchild = this.options.selectedchild;
					}

					this.commentsView = new CommentsView (params)
					this.commentsView.render ();
				}

				this.commentsVisible = true;
				this.$el.find ('.comment-label').html ('Hide comments');
				this.$el.find ('.' + this.childrencontainer).html (this.commentsView.el).show ();*/
			},
			
			// Static HACK
			
			time : function ()
			{
				var now = new Date;
				var date = new Date(this.$el.find("[data-date]").attr("data-date"));
				var diff = Math.round((now.getTime()-date.getTime()) *.001);
				var human;
				
				if(diff < 60)			human = "now";
				else if(diff < 3600)	human = Math.round(diff/60) + "m";
				else if(diff < 86400)	human = Math.round(diff/3600) + "h";
				else if(diff < 2592000)	human = Math.round(diff/86400) + "d";
				else					human = Math.round(diff/2592000) + "mo";
				//else					human = "long ago";
				
				this.$el.find("[data-date]").html(human);
				
				//this.tm = setTimeout(this.time.bind(this), 60000);
			}


		});
		
		return Message;
});