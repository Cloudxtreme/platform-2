define(
	['backbone', 'Session', 'Models/Message'],
	function (Backbone, Session, Message)
	{
		var Messages = Backbone.Collection.extend({

			'model' : Message,
			'typestring' : "messages",
			'modelstring' : "message",
			'parameters' : {},
			'paging' : {},
			'cursor' : false,
			
			'events' : {
				'remove' : 'destroy'
			},
			
			'initialize' : function(options)
			{
				if(!Session)	Session = require('Session');
					
				// Override type strings if required
				if(options) $.extend(this, options);
				
				// Put "add" listener to global messages collection
				if( Session.user.account)
					Session.getMessages().listenTo(this, "add", Session.getMessages().distantAdd);	

				// Check if it's empty only after sync
				this.on('sync', function(){
					setTimeout(function(){
						this.isempty();
					}.bind(this),1);
				});
			},
			
			'destroy' : function ()
			{
				//console.log("collection destroyed")
				this.reset();
			},

			'isempty' : function(){		
				if(this.length == 0){
					this.trigger('ready:empty');
				}
			}
		});

		return Messages;
});