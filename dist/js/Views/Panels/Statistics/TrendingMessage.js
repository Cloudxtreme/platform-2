define(
	['backbone', 'mustache'],
	function (Backbone, Mustache)
	{
		var TrendingMessage = Backbone.View.extend({

			initialize : function (options)
			{
				if(options) $.extend(this, options);
				
				this.settings = {};
				this.settings.title = this.title;

				if(!this.parentview.streamid)	this.model = Cloudwalkers.Session.getChannel('profiles').clone();
				else							this.model = Cloudwalkers.Session.getStream(this.parentview.streamid);
				
				this.listenTo(this.model, 'sync', this.fill);

				this.gettoptrending();
			},

			render : function ()
			{					
				this.$el.html (Mustache.render (Templates.trendingmsg, this.settings));
				this.hideloading();

				return this;
			},

			fill : function(){

				this.message = this.model.get("messages") ? this.model.get("messages")[0] : false;

				//No results
				if(!this.message || this.message.length === 0){
					this.$el.find('.commentballoon h4').html("No data");
					this.hideloading();
					return;
				}
						
				var message = this.message;
				var links = message.attachments? message.attachments.filter(function(el){ if(el.type == "link") return el; }) : null;
				var images = message.attachments? message.attachments.filter(function(el){ if(el.type == "image") return el; }) : null;

				this.settings.from = message.from[0].displayname || "";
				this.settings.body = message.body.plaintext || "";
				this.settings.icon = message.from[0].network.icon || "";
				this.settings.date = message.dateonly || "";
		        this.settings.statistics = [];

				//Just one image
				if(images.length)
					this.settings.image = images[0].url || "";

				if(message.stats){
		            for(var n in message.stats){
		                if(n != 'notes')
		                    this.settings.statistics.push({name: n, value: message.stats[n]})
		            }
		        }

				
				this.settings.links = links || [];

				this.render();

			},

			gettoptrending : function()
			{
				var filters = {
					sort:  'engagement',
					records : 1,
					since : this.timespan.since
				};

				this.model.fetch({endpoint : "messages", parameters : filters});

			},

			showloading : function ()
			{
				this.$el.find(".fa-cloud-download").show();
			},
			
			hideloading : function ()
			{
				$(".inner-loading").removeClass('inner-loading');
			},

			negotiateFunctionalities : function()
			{

			}
			
		});

		return TrendingMessage;
});