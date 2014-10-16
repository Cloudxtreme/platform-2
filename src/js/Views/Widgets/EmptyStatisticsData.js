define(
	['backbone', 'mustache'],
	function (Backbone, Mustache)
	{
		var EmptyData = Backbone.View.extend({
	
			title : "EmptyData",
			messageconfig : 
			{
				'now' 		: {id: "subtractempty", text: "Show me the previous {{span}}'s statistics"},
				'nodata' 	: {id: "addempty", text: "Show me the next {{span}}'s statistics"},
				'reports' 	: {id: "showreports", text: "Show older reports"}
			},

			initialize : function(options)
			{	
				$.extend(this, options);
			},

			render : function ()
			{	
				this.checknow();	

				this.$el.html (Mustache.render (Templates.emptystatisticsdata, {message: this.message}));
				return this;
			},

			checknow : function()
			{		
				var since = this.timeparams.since * 1000;
				var until = this.timeparams.until * 1000;
				var now = moment().utc().valueOf();
				var token;

				if((now <= until) && (now > since))
					token = 'now'

				this.generatemessage(token);
			},	

			generatemessage : function(token)
			{
				var basestring = trans("There is no available data.");
				var textstring = '<br/><a id="{{id}}">{{text}}</a>';
				var span = this.timeparams.span;	

				// Already figure out what text to show
				if(token){

					var id = this.messageconfig[token].id;
					var text = trans( Mustache.render( this.messageconfig[token].text, {span: span} ));

					this.message = basestring + Mustache.render(textstring, {id: id, text: text});
				}			

				// Still not sure what text to show
				else
					this.getcreationdate();
			},

			getcreationdate : function()
			{	
				var createddate;

				if(!this.stream){
					createddate = Cloudwalkers.Session.getAccount().get('created');
					this.parsecreationdate(createddate);
				}
				else
				{
					var stream = Cloudwalkers.Session.getStream(this.stream);
					
					//Stream has a creation date
					if(stream.get('created'))
						this.parsecreationdate(stream.get('created'));

					//If me hasn't been updated, streams have no creation date
					else
						stream.fetch({success: this.getstreamdate.bind(this)})
				}
			},

			parsecreationdate : function(creationdate)
			{
				var createddate = moment.unix(Date.parse(creationdate)/1000).utc();
				
				if(createddate.valueOf()/1000 >= 1410998400)	// September 18th
					this.generatemessage('nodata')
				else
					this.generatemessage('reports')
			},

			getstreamdate : function(stream)
			{
				if(stream.get('created'))
					this.parsecreationdate(stream.get('created'))

				// Fallback in case all goes wrong
				else
					this.generatemessage('nodata')
			}
		});

		return EmptyData
});