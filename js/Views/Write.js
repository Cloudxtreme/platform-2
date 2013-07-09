Cloudwalkers.Views.Write = Backbone.View.extend({

	'events' : 
	{
		'submit form' : 'submit',
		'keyup textarea[name=message]' : 'updateCounter'
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

		// Stream map
		var streammap = {};
		if (this.model && this.model.get ('streams'))
		{
			for (var i = 0; i < this.model.get ('streams').length; i ++)
			{
				streammap[this.model.get ('streams')[i].id] = true;
			}
		}

		data.channels = [];
		for (var i = 0; i < objData.streams.length; i ++)
		{
			if (objData.streams[i].direction.OUTGOING == 1)
			{
				var tmp = objData.streams[i];

				tmp.checked = typeof (streammap[objData.streams[i].id]) != 'undefined';

				data.channels.push (tmp);
			}
		}

		data.BASE_URL = CONFIG_BASE_URL;

		var scheduledate = this.model ? this.model.scheduledate (false) : false;
		var schedulerepeat = this.model ? this.model.repeat () : false;

		// 31 days
		data.days = [];
		data.months = [];
		data.years = [];
		data.times = [];

		data.endrepeat = 
		{
			'days' : [],
			'months' : [],
			'years' : []
		};

		for (var i = 1; i <= 31; i ++)
		{
			data.days.push ({ 'day' : i, 'checked' : (scheduledate && scheduledate.getDate () == i ) });
			data.endrepeat.days.push ({ 'day' : i, 'checked' : (schedulerepeat && schedulerepeat.end && schedulerepeat.end.getDate () == i ) });
		}

		// 12 months
		for (i = 1; i <= 12; i ++)
		{
			data.months.push ({ 'month' : i, 'display' : Cloudwalkers.Utils.month (i), 'checked' : (scheduledate && scheduledate.getMonth () == (i - 1) ) });
			data.endrepeat.months.push ({ 'month' : i, 'display' : Cloudwalkers.Utils.month (i), 'checked' : (schedulerepeat && schedulerepeat.end && schedulerepeat.end.getMonth () == (i - 1) ) });
		}

		// 10 years
		var value = null;
		for (i = 0; i < 10; i ++)
		{
			value = (new Date()).getFullYear () + i;
			data.years.push ({ 'year' : value, 'checked' : (scheduledate && scheduledate.getFullYear () == value ) });
			data.endrepeat.years.push ({ 'year' : value, 'checked' : (schedulerepeat && schedulerepeat.end && schedulerepeat.end.getFullYear () == value ) });
			//data.endrepeat.years.push ({ 'year' : i, 'checked' : (schedulerepeat && schedulerepeat.end && schedulerepeat.end.getFullYear () == value ) });
		}

		// Weekdays
		data.weekdays = [];

		var weekdays = [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ];
		for (var i = 0; i < weekdays.length; i ++)
		{
			var name = weekdays[i];
			var f = name.charAt(0).toUpperCase();
			name = f + name.substr(1);

			data.weekdays.push ({
				'name' : name,
				'weekday' : weekdays[i],
				'checked' : (schedulerepeat && schedulerepeat.weekdays && schedulerepeat.weekdays[weekdays[i].toUpperCase ()])
			})
		}

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

			data.times.push ({ 'time' :  hour + ':' + minutes, 'checked' : ( scheduledate && scheduledate.getHours () == hour && scheduledate.getMinutes () == minutes ) })
		}

		// Data
		if (this.model)
		{
			data.message = this.model.attributes;

			// Attachments
			data.attachments = {};

			if (this.model.get ('attachments'))
			{
				for (var i = 0; i < this.model.get ('attachments').length; i ++)
				{
					data.attachments[this.model.get ('attachments').type] = this.model.get ('attachments').src;
				}
			}
		}

		var popup = Mustache.render(Templates['write'], data);
		self.$el.html (popup);

		self.afterRender ();

		return this;
	},

	'getValidationRules' : function ()
	{
		var streams = Cloudwalkers.Session.getStreams ();
		var selectedstreams = [];

		for (var i = 0; i < streams.length; i ++)
		{
			if (streams[i].direction.OUTGOING == 1)
			{
				if (this.$el.find ('#channel_' + streams[i].id).is (':checked'))
				{
					selectedstreams.push (streams[i]);
				}
			}
		}

		// Fetch all the limitations
		var limitations = [];
		for (var i = 0; i < selectedstreams.length; i ++)
		{
			for (var limitation in selectedstreams[i].network.limitations)
			{
				limitations.push ({ 'limitation' : limitation, 'value' : selectedstreams[i].network.limitations[limitation] });
			}
		}

		return limitations;
	},

	'afterRender' : function ()
	{
		var self = this;

		self.$el.find('form').find ('ul.channels label').click (function ()
		{
			var element = $(this);
			setTimeout (function ()
			{
				var checkbox = self.$el.find('form').find ('input[type=checkbox]#' + element.attr ('for'));

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
			}, 100);
		}).each (function ()
		{
			var label = $(this);

			setTimeout (function ()
			{
				var checkbox = self.$el.find('form').find ('input[type=checkbox]#' + label.attr ('for'));

				checkbox.each (function ()
				{
					var input = $(this);

					if (input.is (':checked'))
					{
						label.addClass ('active');
						label.removeClass ('inactive');
					}
					else
					{
						label.addClass ('inactive');
						label.removeClass ('active');
					}
				});
			}, 100);
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

		if (form.find ('input[name=title]').val () == 'Add a title to post')
		{
			form.find ('input[name=title]').val ('');	
		}

		if (form.find ('input[name=url]').val () == 'URL')
		{
			form.find ('input[name=url]').val ('');	
		}

		var data = (form.serialize ());
		
		for (var i = 0; i < this.files.length; i ++)
		{
			data += '&files[]=' + escape(this.files[i]);
		}

		var url = CONFIG_BASE_URL + 'post/?account=' + Cloudwalkers.Session.getAccount ().get ('id');
		if (this.model)
		{
			url += '&id=' + this.model.get ('id');
		}

		// Do the call
		jQuery.ajax
		({
			async:true, 
			cache:false, 
			data: data, 
			dataType:"json", 
			type:"post", 
			url: url, 
			success:function(objData)
			{
				if (objData.success)
				{
					self.trigger ('popup:close');
					Cloudwalkers.Session.trigger ('message:add');
					return true;
				}
				else
				{
					alert (objData.error);
				}
			}
		});
	},

	'updateCounter' : function ()
	{
		var length = this.$el.find ('textarea[name=message]').val ().length;	
		this.$el.find ('.total-text-counter').html (length);

		var rules = this.getValidationRules ();
		for (var i = 0; i < rules.length; i ++)
		{
			if (rules[i].limitation == 'max-length')
			{
				if (length > rules[i].value)
				{
					this.$el.find ('.error').html ('You can only use ' + rules[i].value + ' characters');
					return;
				}
			}
		}

		this.$el.find ('.error').html ('');
	}
});