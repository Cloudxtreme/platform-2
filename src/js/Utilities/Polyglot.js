define(
	['backbone', 'polyglot', 'Models/Polyglot'],
	function (Backbone, PolyglotPlugin, PolyglotModel)
	{
		var PolyglotUtil = {
		
			init : function(options)
			{
				$.extend(this, options);

				var translations = new PolyglotModel();
				var phrases;

				this.locale = this.lang || "en_EN";				

				moment.locale(this.locale);

				translations.fetch({ success: this.addtranslator.bind(this), error: this.notranslation.bind(this) });

				return this;
			},

			addtranslator : function(translations)
			{
				phrases = translations.get("translation");
				this.translator = new Polyglot({phrases: phrases});
				
				this.trigger('translations:done');
			},

			notranslation : function()
			{
				this.trigger('translations:done');
			},

			/*
			 * Function to map which translation to use (regular or template)
			 */
			trans : function(string)
			{	
				if(!string)	return Cloudwalkers.Polyglot.translatetemplate();
				else		this.translate(string);
			},
			
			/*
			 * Responsible for translating data.
			 */
			translate : function(string)
			{
				if(this.locale == "en_EN")	return string;
				else if(this.translator)	return this.translator.t(string);
				else						return string;	
			},

			/*
			 * Responsible for translating template/mustache data.
			 */
			translatetemplate : function()
			{
				return function(string, render) {
					return render(this.translate(string));
				}.bind(this);
			}
		}

		// Add events
		_.extend(PolyglotUtil, Backbone.Events);

		return PolyglotUtil;
});