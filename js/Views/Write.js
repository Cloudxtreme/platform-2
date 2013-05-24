Cloudwalkers.Views.Write = Backbone.View.extend({

	'events' : 
	{
		'submit form' : 'submit'
	},

	'files' : [],

	'render' : function ()
	{
		var self = this;

		var data = {};
		var files = [];

		var objData = {
			'streams' : Cloudwalkers.Session.getStreams ()
		};

		data.channels = [];
		for (var i = 0; i < objData.streams.length; i ++)
		{
			if (objData.streams[i].direction.OUTGOING == 1)
			{
				data.channels.push (objData.streams[i]);
			}
		}

		data.BASE_URL = CONFIG_BASE_URL;

		// 31 days
		data.days = [];
		data.months = [];
		data.years = [];
		data.times = [];
		for (var i = 1; i <= 31; i ++)
			data.days.push ({ 'day' : i });

		// 12 months
		for (i = 1; i <= 12; i ++)
			data.months.push ({ 'month' : i });

		// 10 years
		for (i = 0; i < 10; i ++)
			data.years.push ({ 'year' : (new Date()).getFullYear () + i });

		// 24 hours
		var hour;
		var minutes;
		for (i = 0; i < 24; i += 0.25)
		{
			hour = Math.floor (i);
			minutes = (i - Math.floor (i)) * 60;

			if (hour < 10)
				hour = '0' + hour;

			if (minutes < 10)
				minutes = '0' + minutes;

			data.times.push ({ 'time' :  hour + ':' + minutes })
		}

		console.log (this.model);

		// Data
		if (this.model)
		{
			data.message = this.model.attributes;

			// Attachments
			data.attachments = {};
			for (var i = this.model.get ('attachments'); i < this.model.get ('attachments').length; i ++)
			{
				data.attachments[this.model.get ('attachments').type] = this.model.get ('attachments').src;
			}
		}

		console.log (data);

		var popup = Mustache.render(Templates['write'], data);
		self.$el.html (popup);

		self.afterRender ();

		console.log (data);

		return this;
	},

	'afterRender' : function ()
	{
		var self = this;

		self.$el.find('form').find ('ul.channels label').click (function ()
		{
			var element = $(this);
			setTimeout (function ()
			{
				var checkbox = self.$el.find(' form').find ('input[type=checkbox]#' + element.attr ('for'));

				if (checkbox.is (':checked'))
				{
					element.addClass ('active');
					element.removeClass ('inactive');
				}
				else
				{
					element.addClass ('inactive');
					element.removeClass ('active');
				}
			}, 1);
		});

		self.$el.find('form').find ('ul.channels input[type=checkbox]').hide ();
		self.$el.find('form').find ('ul.channels label').addClass ('inactive');

		self.$el.find('form').find ('h2.schedule-message-title').click (function ()
		{
			self.$el.find('form').find ('div.schedule-message-container').toggle ();
		});

		self.$el.find('form').find ('div.schedule-message-container').hide ();

		self.$el.find('form .fileupload').fileupload
		({
			dataType: 'json',
			done: function (e, data) 
			{
				$.each(data.result.files, function (index, file) 
				{
					var p = $(document.createElement ('p'));
					var a = $(document.createElement ('a'));

					p.append (file.name + ' ');
					a.html ('Delete');
					a.attr ('href', 'javascript:void(0);');

					self.files.push (file.url);

					a.click (function ()
					{
						jQuery.ajax
						({
							async:true, 
							cache:false, 
							data:"", 
							dataType:"json", 
							type:"get", 
							url: file.delete_url, 
							success:function(objData)
							{
								if (objData.success)
								{
									p.remove ();

									for (var i = 0; i < self.files.length; i ++)
									{
										if (self.files[i].url == file.url)
										{
											self.files.splice (i, 1);
											break;
										}
									}
								}
							}
						});
					});

					p.append (a);

					self.$el.find('.fileupload-feedback').append (p);
				});
			}
		});
	},

	'submit' : function (e)
	{
		e.preventDefault ();

		var self = this;
		var form = self.$el.find(e.currentTarget);
		var data = (self.$el.find(form).serialize ());
		
		for (var i = 0; i < this.files.length; i ++)
		{
			data += '&files[]=' + escape(this.files[i]);
		}

		// Do the call
		jQuery.ajax
		({
			async:true, 
			cache:false, 
			data: data, 
			dataType:"json", 
			type:"post", 
			url: CONFIG_BASE_URL + 'post/', 
			success:function(objData)
			{
				if (objData.success)
				{
					self.trigger ('popup:close');
					return true;
				}
				else
				{
					alert (objData.error);
				}
			}
		});
	}
});