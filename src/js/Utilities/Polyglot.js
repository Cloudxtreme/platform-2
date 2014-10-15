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
			 * Responsible for translating data.
			 */
			translate : function(string)
			{	console.log(this.locale)
				if(this.locale == "en_EN")	return string;
				else if(this.translator)	return this.translator.t(string);
				else						return string;	
			},

			/*
			 * Responsible for translating template/mustache data.
			 */
			translatetemplate : function()
			{
				return function(string, render) {console.log(string)
					// Scoping problem, find a better solution
					return render(Cloudwalkers.Polyglot.translate(string));
				}
			}
		}

		// Add events
		_.extend(PolyglotUtil, Backbone.Events);

		return PolyglotUtil;
});