define(
	['Views/Pageview', 'mustache', 'Session'],
	function (Pageview, Mustache, Session)
	{
		var RSSFeed = Pageview.extend({
	
			id : "rss",
			parameters : { records: 20, markasread: true },
			entries : [],

			events : 
			{
				'click .message' : 'openMessage',
				'click .message *' : 'openMessage',
				'click [data-rss-select]' : 'toggleList'
			},
			
			initialize : function (options)
			{
				if (options) $.extend(this, options);
				
				this.translateTitle("rss_feed");

				this.$el.addClass("loading");
			},
			
			hideloading : function()
			{
				this.$el.removeClass("loading");
				this.$el.find(".timeline-loading").hide();
			},
			
			render : function ()
			{
				var params = {
					'title' : this.title
				}

				//Mustache Translate Render
				this.mustacheTranslateRender(params);

				// Pageview
				this.$el.html (Mustache.render (Templates.rssfeed, params));

				return this;
			},

			openMessage : function(el)
			{

				$(el.target).closest('.rssfeed-container').children().children().removeClass('opened');
				$(el.target).closest('.rssfeed-container').children().removeClass('span12');
				$(el.target).closest('.rssfeed-container').children().addClass('span6');

				//console.log($(el.target).closest('.rssfeed-container'))

				if($(el.target).hasClass('message')){
					$(el.target).addClass('opened');
					$(el.target).parent().removeClass('span6');
					$(el.target).parent().addClass('span12');
				} else {
					$(el.target).closest('.message').addClass('opened');
					$(el.target).closest('.message').parent().removeClass('span6');
					$(el.target).closest('.message').parent().addClass('span12');
				}
			},

			toggleList : function(el){

				var activeclass = $(el.target).data().rssSelect;

				this.$el.find('.rssfeed-container').removeClass('cards');
				this.$el.find('.rssfeed-container').removeClass('list');
				this.$el.find('.rssfeed-container').addClass(activeclass);

				this.$el.find('.rssfeed-selector').children().removeClass('active');
				
				if($(el.target).hasClass('option')){
					$(el.target).addClass('active');
				} else {
					$(el.target).parent().addClass('active');
				}

			},

			translateString : function(translatedata)
			{	
				// Translate String
				return Session.polyglot.t(translatedata);
			},

			translateTitle : function(translatedata)
			{	
				// Translate Title
				this.title = Session.polyglot.t(translatedata);
			},

			mustacheTranslateRender : function(translatelocation)
			{
				// Translate array
				this.original  = [
					"loading"
				];

				this.translated = [];

				for(k in this.original)
				{
					this.translated[k] = this.translateString(this.original[k]);
					translatelocation["translate_" + this.original[k]] = this.translated[k];
				}
			}
		});

		return RSSFeed;
	}
);