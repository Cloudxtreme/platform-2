define(
	['Views/Entry'],
	function (Entry)
	{
		var CounterEntry = Entry.extend({

			tagName : 'a',

			initialize : function(options)
			{
				$.extend(this, options);

				//this.listenTo(this.model, 'change', this.render)
				//this.model.on('all', function(a){console.log(a)})
			},

			render : function ()
			{	
				if(this.data.typelink)	var url = this.data.typelink + "/" + (this.model.get("hasMessages")? "messages" : "notifications");
				else					var url = this.data.link? this.data.link: '#' + this.data.type + '/' + this.data.channel.id + '/' + this.model.id;

				this.$el.attr('href', url);
				this.$el.attr('data-stream', this.model.id);

				var params = { 
					id: this.model.id, 
					name: this.model.get("name"), 
					url: url, 
					count: this.model.count, 
					icon: this.model.get("network") ?this.model.get("network").icon: this.data.icon 
				};

				this.$el.html(Mustache.render(Templates.counterentry, params));

				return this;
			}
		});

		return CounterEntry;
});