define(
	['Views/Pages/PageView', 'mustache'],
	function (Pageview, Mustache)
	{
		var Trending = Pageview.extend({

			initialize : function (options)
			{
				if (options) $.extend(this, options);
				
				// Listen to model
				this.listenTo(this.model.streams, 'seed', this.fill);
				this.listenTo(this.model.streams, 'request', this.showloading);
				this.listenTo(this.model.streams, 'sync', this.hideloading);
			},
				
			render : function ()
			{

				// Network filters
				// Template data
				var params = {streams: [], networks: this.model.streams.filterNetworks(null, true)};

				this.model.streams.each (function(stream){ params.streams.push({id: stream.id, icon: stream.get("network").icon, name: stream.get("defaultname")}); });
				
				// Build Pageview
				this.$el.html (Mustache.render (Templates.trending, params));
				
				// Load trending messages
				// Load messages
				this.collection.touch(this.model, {records: 40, sort: "engagement", since: Math.round(Date.now()/3600000) *3600 - 86400 *this.span});
				
				/*{
					
					since: Math.round(Date.now()/3600000) *3600 - 86400 *widgetdata.since
				}*/

				return this;
			}
			
		});

		return Trending;
});