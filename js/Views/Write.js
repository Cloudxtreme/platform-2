/**
*
* This is a mess.
* I'm sorry.
* Needs a rewrite.
*
*/

Cloudwalkers.Views.Write = Backbone.View.extend({

	'events' : 
	{
		'submit form' : 'submit',
		'keyup textarea[name=message]' : 'updateCounter',
		'keyup input[name=title]' : 'updateCounter',
		'click #schedule-btn-toggle' : 'toggleSchedule',
		'click button[value=draft]' : 'setDraft',
		'click [name=delay]' : 'setWithinDate',
		'change select[name=schedule_day],select[name=schedule_month],select[name=schedule_year],select[name=schedule_time]' : 'resetWithin',
		'click #button-response[value=send]' : 'sendNow',
        'click .btnShortenURL' : 'shortenUrl'
	},

	'files' : [],
	'draft' : false,
	'sendnow' : false,

	'navclass' : 'write',

	'setDraft' : function ()
	{
		this.draft = true;
	},

	'sendNow' : function (e)
	{
		//console.log (e);

		e.preventDefault ();
		e.stopPropagation ();

		this.sendnow = true;

		// Sure you want to send now? Or save to draft?
		if (this.$el.find ('.message-schedule').is (':visible'))
		{
			if (
				this.model && 
				confirm ('Are you sure you want to sent this scheduled message now?')
			)
			{
				//this.setScheduleDate (new Date((new Date()).getTime () + (1000 * 60 * 15)));
				this.clearScheduleDate ();
				$(e.toElement.form).trigger ('submit');
			}

			else if (confirm ('Are you sure you want to send your message right now? Your schedule details will be lost.'))
			{
				this.clearScheduleDate ();
				$(e.toElement.form).trigger ('submit');
			}
		}
		else
		{
			this.clearScheduleDate ();
			$(e.toElement.form).trigger ('submit');
		}
	},

	'getAvailableStreams' : function ()
	{
		var streams = Cloudwalkers.Session.getStreams ();

		// If this is an action parameter, only show streams of the same network
		if (typeof (this.options.actionparameters) != 'undefined' && typeof (this.model) != 'undefined')
		{
			var stream = Cloudwalkers.Session.getStream (this.model.get ('stream'));

			if (stream)
			{
				var out = [];
				for (var i = 0; i < streams.length; i ++)
				{
					if (streams[i].get ('network').name == stream.get ('network').name)
					{
						out.push (streams[i]);
					}
				}

				return out;
			}
		}

		return streams;
	},

	'render' : function ()
	{
		this.files = [];
		this.draft = false;
		this.sendnow = false;

		this.actionparameters = {};

		if (typeof (this.options.actionparameters) != 'undefined')
		{
			for (var i = 0; i < this.options.actionparameters.length; i ++)
			{
				//console.log (this.options.actionparameters[i]);
				this.actionparameters[this.options.actionparameters[i].token] = this.options.actionparameters[i];
			}
		}

		var self = this;

		var data = {};
		var files = [];

		var objData = {
			'streams' : this.getAvailableStreams ()
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
            if (objData.streams[i].get ('direction').OUTGOING == 1)
            {
                var tmp = objData.streams[i].attributes;

                tmp.checked = typeof (streammap[objData.streams[i].get ('id')]) != 'undefined';

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
			data.days.push ({ 'day' : i, 'checked' : (scheduledate ? scheduledate.getDate () == i : false) });
			data.endrepeat.days.push ({ 'day' : i, 'checked' : (schedulerepeat && schedulerepeat.end && schedulerepeat.end.getDate () == i ) });
		}

		// 12 months
		for (i = 1; i <= 12; i ++)
		{
			data.months.push ({ 'month' : i, 'display' : Cloudwalkers.Utils.month (i), 'checked' : (scheduledate ? scheduledate.getMonth () == (i - 1) : false) });
			data.endrepeat.months.push ({ 'month' : i, 'display' : Cloudwalkers.Utils.month (i), 'checked' : (schedulerepeat && schedulerepeat.end && schedulerepeat.end.getMonth () == (i - 1) ) });
		}

		// 10 years
		var value = null;
		for (i = 0; i < 10; i ++)
		{
			value = (new Date()).getFullYear () + i;
			data.years.push ({ 'year' : value, 'checked' : (scheduledate ? scheduledate.getFullYear () == value : false ) });
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

		// Interval
		data.repeatinterval = {
			'amount' : [],
			'unit' : []
		}

		for (var i = 0; i < 72; i ++)
		{
			data.repeatinterval.amount.push ({ 'value' : i, 'name' : i, 'selected' : schedulerepeat && schedulerepeat.interval == i });
		}

		data.repeatinterval.unit.push ({ 'value' : 'minutes', 'name' : 'Minute(s)', 'selected' : schedulerepeat && schedulerepeat.unit == 'minutes' });
		data.repeatinterval.unit.push ({ 'value' : 'hours', 'name' : 'Hour(s)', 'selected' : schedulerepeat && schedulerepeat.unit == 'hours' });
		data.repeatinterval.unit.push ({ 'value' : 'days', 'name' : 'Day(s)', 'selected' : schedulerepeat && schedulerepeat.unit == 'days' });
		data.repeatinterval.unit.push ({ 'value' : 'weeks', 'name' : 'Week(s)', 'selected' : schedulerepeat && schedulerepeat.unit == 'weeks' });
		data.repeatinterval.unit.push ({ 'value' : 'months', 'name' : 'Month(s)', 'selected' : schedulerepeat && schedulerepeat.unit == 'months' });

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

			if (scheduledate)
			{
				scheduledate.setMinutes (Math.floor (scheduledate.getMinutes () / 15) * 15);
			}

			data.times.push ({ 'time' :  hour + ':' + minutes, 'checked' : ( scheduledate && scheduledate.getHours () == hour && scheduledate.getMinutes () == minutes ) })
		}

		// Ze buttons
		data.canSchedule = true;
		data.canSave = true;
		data.canSendNow = true;

		// Data
		if (this.model)
		{
			//console.log (this.model);
			data.canSave = this.model.get ('status') != 'SCHEDULED';

			data.message = jQuery.extend (true, {}, this.model.attributes);

			// Check for action attributes, if availalbe we need to process them
			if (typeof (this.actionparameters.message) != 'undefined' && this.actionparameters.message.value != "")
			{
				data.message.body.plaintext = Cloudwalkers.Utilities.Parser.parseFromMessage (this.actionparameters.message.value, this.model);
				data.message.body.html = Cloudwalkers.Utilities.Parser.parseFromMessage (this.actionparameters.message.value, this.model);
			}


			// Attachments
			data.sortedattachments = {};

			if (this.model.get ('attachments'))
			{
				for (var i = 0; i < this.model.get ('attachments').length; i ++)
				{
					data.sortedattachments[this.model.get ('attachments')[i].type] = [ this.model.get ('attachments')[i] ];
				}
			}

			//console.log (this.model.get ('attachments'))
			//console.log (data.attachments);
			//console.log (data.sortedattachments);

			// Should we open the schedule?

			//console.log (this.model.repeat ());

			data.showschedule = false;
			if (this.model.scheduledate (false) || typeof (this.model.repeat ().interval) != 'undefined')
			{
				data.showschedule = true;
			}
		}

		//console.log (data);


		var popup = Mustache.render(Templates['write'], data);
		self.$el.html (popup);

		self.$el.find ('[name=url]').change (function ()
		{
			self.updateCounter ();
		});

		self.afterRender ();

		if (this.model)
		{
			setTimeout (function ()
			{
				// Add the files
				var attachments = self.model.get ('attachments');
				
				if (typeof (attachments) != 'undefined')
				{
					for (var i = 0; i < attachments.length; i ++)
					{
						if (attachments[i].type == 'image')
						{
							self.addUploadedFileToList 
							({
								'name' : attachments[i].name,
								'url' : attachments[i].url,
								'delete_url' : 'bla'
							});
						}
					}
				}
			}, 100);
		}

		self.updateCounter ();

		self.$el.find('[name=schedule_random]').click (function () { self.randomTime () });

		self.$el.find ('[data-toggle-id].inactive').hide ();

		self.$el.find ('[data-toggle-target]').click (function ()
		{
			var id = $(this).attr ('data-toggle-target');
			var visible;

			if (self.$el.find ('[data-toggle-id=' + id + ']').is (':visible'))
			{
				self.$el.find ('[data-toggle-id=' + id + ']').hide ();	
				visible = false;
				//$(this).toggleClass ('active', false);
			}

			else
			{
				//$(this).toggleClass ('active', true);
				visible = true;
				self.$el.find ('[data-toggle-id=' + id + ']').show ();
			}

			$(this).toggleClass ('black', visible);
			$(this).toggleClass ('blue', !visible);

		}).each (function ()
		{
			var element = $(this);

			setTimeout (function ()
			{
				var id = element.attr ('data-toggle-target');
				var visible = self.$el.find ('[data-toggle-id=' + id + ']').is (':visible');

				element.toggleClass ('black', visible);
				element.toggleClass ('blue', !visible);
			}, 200);
		});

		self.$el.find ('.inactive[data-toggle-id]').hide ();

		setTimeout (function ()
		{
			self.trigger ('content:change');

			self.$el.find ('#schedule-btn-toggle').toggleClass ('black', self.$el.find ('.message-schedule').is (':visible'));
			self.$el.find ('#schedule-btn-toggle').toggleClass ('blue', !self.$el.find ('.message-schedule').is (':visible'));
		}, 200);

		return this;
	},

	/**
	* Required input:
	* { 
	*	'url' : url, 
	* 	'delete_url' : url, 
	*	'name' : name 
	* }
	*/
	'addUploadedFileToList' : function (file)
	{
		var self = this;

		var p = $(document.createElement ('div'));

		p.addClass ('uploaded-file');

		var img = $(document.createElement ('img'));
		var a = $(document.createElement ('a'));

		img.attr ('src', file.url);

		//p.append (file.name + ' ');
		p.append (img);

		a.html ('Delete');
		a.attr ('href', 'javascript:void(0);');

		self.files.push (file.url);

		a.click (function ()
		{
			for (var i = 0; i < self.files.length; i ++)
			{
				if (self.files[i] == file.url)
				{
					self.files.splice (i, 1);
					break;
				}
			}

			p.remove ();
			self.updateCounter ();

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
					// This is just for show.
				}
			});
		});

		p.append (a);

		self.$el.find('.fileupload-feedback').append (p);

		self.updateCounter ();
	},

	'getValidationRules' : function ()
	{
		var streams = Cloudwalkers.Session.getStreams ();
		var selectedstreams = [];

		for (var i = 0; i < streams.length; i ++)
		{
			if (streams[i].get ('direction').OUTGOING == 1)
			{
				if (this.$el.find ('#channel_' + streams[i].get ('id')).is (':checked'))
				{
					selectedstreams.push (streams[i].attributes);
				}
			}
		}

		// Fetch all the limitations
		var limitations = {};
		for (var i = 0; i < selectedstreams.length; i ++)
		{
			for (var limitation in selectedstreams[i].network.limitations)
			{
				//limitations.push ({ 'limitation' : limitation, 'value' : selectedstreams[i].network.limitations[limitation] });
				if (typeof (limitations[limitation]) == 'undefined')
				{
					// Just go with it.
					limitations[limitation] = selectedstreams[i].network.limitations[limitation].limit;
				}

				else
				{
					var currentvalue = limitations[limitation];

					// MAXIMUM means that this is the absolute maximum, so if we have a higher value, replace it
					if (selectedstreams[i].network.limitations[limitation].type == 'MAXIMUM')
					{
						if (currentvalue > selectedstreams[i].network.limitations[limitation].limit)
						{
							limitations[limitation] = selectedstreams[i].network.limitations[limitation].limit;
						}
					} 

					// MINIMUM means that this is the absolute minimum, so if we have a lower value, replace it
					else if (selectedstreams[i].network.limitations[limitation].type == 'MINIMUM')
					{
						if (currentvalue < selectedstreams[i].network.limitations[limitation].limit)
						{
							limitations[limitation] = selectedstreams[i].network.limitations[limitation].limit;
						}
					}
					else
					{
						alert ('Unexpected limitation type: ' + selectedstreams[i].network.limitations[limitation].type);
					}
				}
			}
		}

		return limitations;
	},

	'afterRender' : function ()
	{
		var self = this;

		self.$el.find('form').find ('.channels label').click (function ()
		{
			var element = $(this);
			setTimeout (function ()
			{
				var checkbox = self.$el.find('form').find ('input[type=checkbox]#' + element.attr ('for'));

				if (checkbox.is (':checked'))
				{
					element.parent ().addClass ('active');
					element.parent ().removeClass ('inactive');
				}
				else
				{
					element.parent ().addClass ('inactive');
					element.parent ().removeClass ('active');
				}

				self.updateCounter ();
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
						label.parent ().addClass ('active');
						label.parent ().removeClass ('inactive');
					}
					else
					{
						label.parent ().addClass ('inactive');
						label.parent ().removeClass ('active');
					}
				});
			}, 100);
		});

		self.$el.find('form').find ('.social-icon-colors input[type=checkbox]').hide ();
		self.$el.find('form').find ('.channels label').addClass ('inactive');

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
					self.addUploadedFileToList (file);
				});
			}
		});
	},

	// If return true, will create new message instead of editing old message
	'isClone' : function ()
	{
		return typeof (this.options.clone) != 'undefined' && this.options.clone;
	},

	'submit' : function (e)
	{
		e.preventDefault ();

        var self = this;

        setTimeout (function ()
        {
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

            for (var i = 0; i < self.files.length; i ++)
            {
                data += '&files[]=' + escape(self.files[i]);
            }

            var url = CONFIG_BASE_URL + 'post/?account=' + Cloudwalkers.Session.getAccount ().get ('id');
            if (self.model && !self.isClone ())
            {
                url += '&id=' + self.model.get ('id');
            }

            // This is a clone. We need to send the original message
            // id so that the system can possibly take the correct measures.
            else if (self.isClone ())
            {
                data += '&original_message=' + self.model.get ('id');
            }

            if (self.draft)
            {
                data += '&draft=true';
            }

            // Reset screen.
            if (self.validate (true))
            {
                self.trigger ('popup:close');

                self.$el.html ('<p>Please wait, storing message.</p>');

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
                        //console.log (window.location);

                        if (objData.success)
                        {
                            self.$el.html ('<p>Your message has been scheduled.</p>');

                            if (typeof (self.options.redirect) == 'undefined' || !self.options.redirect)
                            {
                                if (self.draft)
                                {
                                    Cloudwalkers.RootView.alert ('Your message was saved.');
                                    self.render ();
                                    /*
                                    if (window.location.hash != '#drafts')
                                    {
                                        window.location = '#drafts';
                                    }
                                    else
                                    {
                                        Cloudwalkers.Router.Instance.drafts ();
                                    }
                                    */
                                }
                                else
                                {
                                    if (window.location.hash != '#schedule')
                                    {
                                        window.location = '#schedule';
                                    }
                                    else
                                    {
                                        Cloudwalkers.Router.Instance.schedule (null);
                                    }
                                }
                            }

                            Cloudwalkers.Session.trigger ('message:add');

                            return true;
                        }
                        else
                        {
                            Cloudwalkers.RootView.alert (objData.error.message);
                        }
                    }
                });
            }
        }, 1);
	},

	'validate' : function (throwErrors)
	{
		if (typeof (throwErrors) == 'undefined')
		{
			throwErrors = false;
		}

		var length = this.$el.find ('textarea[name=message]').val ().length;	
		this.$el.find ('.total-text-counter').html (length);

		var rules = this.getValidationRules ();
		
		// Count links
		var links = this.$el.find ('[name=url]').val () != "" ? 1 : 0;

		// Count images
		var images = this.files.length;

		var hasErrors = false;

		// Count extra characters
		var extraCharacters = 0;
		if (typeof (rules['picture-url-length']) != 'undefined')
		{
			extraCharacters += rules['picture-url-length'] * images;
		}

		if (typeof (rules['picture-url-length']) != 'undefined')
		{
			extraCharacters += rules['url-length'] * links;
		}

		if (typeof (rules['include-title-in-max-length']) != 'undefined')
		{
			var subject = this.$el.find ('input[name=title]').val ();

			if (subject.length > 0)
			{
				extraCharacters += subject.length;

				if (typeof (rules['title-spacing-length']) != 'undefined')
				{
					extraCharacters += rules['title-spacing-length'];
				}
			}
		}

		// Has hard limit?
		if (typeof (rules['max-length']) == 'undefined' && typeof (rules['max-length-hardlimit']) != 'undefined')
		{
			rules['max-length'] = rules['max-length-hardlimit'];
		}

		// Check soft limit (sending is still allowed)
		if (typeof (rules['max-length']) != 'undefined')
		{
			rules['max-length'] -= extraCharacters;

			// Update maximum counter
			this.$el.find ('.total-max-counter').html (rules['max-length']);

			if (length > rules['max-length'])
			{
				this.$el.find ('.error').html ('You can only use ' + rules['max-length'] + ' characters');
			}			
		}

		else
		{
			this.$el.find ('.total-max-counter').html ('∞');
		}

		// And now the breaking errors
		if (typeof (rules['max-length-hardlimit']) != 'undefined')
		{
			if (length + extraCharacters > rules['max-length-hardlimit'])
			{
				if (throwErrors)
				{
					this.throwError ('You message cannot be longer than ' + rules['max-length-hardlimit'] + ' characters.');
				}

				return false;
			}
		}

		// Clear errors
		if (!hasErrors)
		{
			this.$el.find ('.error').html ('');
		}

		var date = this.getScheduleDate ();
		if (date)
		{
			if (date < (new Date()))
			{
				if (throwErrors)
				{
					this.throwError ('Even CloudWalkers is unable to send messages to the past ¯\\_(ツ)_/¯');
				}
				return false;
			}
		}

		// Schedule repeat
		if (throwErrors)
		{
			// Schedule delay too short
			if (this.$el.find ('[name=repeat_delay_unit]').val () == 'minutes')
			{
				if (this.$el.find ('[name=repeat_delay_amount]').val () > 0
					&& this.$el.find ('[name=repeat_delay_amount]').val () < 20)
				{
					return confirm ('Are you sure you want to repeat this message within such a short time?');
				}
			}

			// See if networks are selected
			if (!this.draft)
			{
				// Count selected networks
				if (this.$el.find ('.channels input[type=checkbox]:checked').length == 0)
				{
					this.throwError ('Please select at least one stream to send too.');
					return false;
				}
			}
		}

		return true;
	},

	'throwError' : function (message)
	{
		alert (message);
	},

	'updateCounter' : function ()
	{
		return this.validate ();
	},

	'clearScheduleDate' : function ()
	{
		this.$el.find ('select[name=schedule_day]').val ('Day');
		this.$el.find ('select[name=schedule_month]').val ('Month');
		this.$el.find ('select[name=schedule_year]').val ('Year');
	},

	'setScheduleDate' : function (date)
	{
		this.$el.find ('select[name=schedule_day]').val (date.getDate ());
		this.$el.find ('select[name=schedule_month]').val (date.getMonth () + 1);
		this.$el.find ('select[name=schedule_year]').val (date.getFullYear ());

		var minutes = String(Math.floor (date.getMinutes () / 15) * 15);
		var hours = String(date.getHours ());

		if (minutes.length == 1)
		{
			minutes = '0' + minutes;
		}

		if (hours.length == 1)
		{
			hours = '0' + hours;
		}

		var value = hours + ':' + minutes;

		this.$el.find ('select[name=schedule_time]').val (value);
	},

	'setWithinDate' : function ()
	{
		var delay = this.$el.find ('[name=delay]:checked').val ();

		var date = new Date ();
		date.setSeconds (delay);

		this.setScheduleDate (date);

		var self = this;

		this.$el.find ('[name=schedule_random]').prop ('checked', false).trigger ('change');
		self.trigger ('content:change');
	},

	'getScheduleDate' : function ()
	{
		var date = new Date ();

		if (this.$el.find ('select[name=schedule_day]').val () != 'Day')
		{
			date.setDate (this.$el.find ('select[name=schedule_day]').val ());
		}
		else
		{
			return false;
		}

		if (this.$el.find ('select[name=schedule_month]').val () != 'Month')
		{
			date.setMonth (this.$el.find ('select[name=schedule_month]').val () - 1);
		}
		else
		{
			return false;
		}

		if (this.$el.find ('select[name=schedule_year]').val () != 'Year')
		{
			date.setFullYear (this.$el.find ('select[name=schedule_year]').val ());
		}
		else
		{
			return false;
		}

		if (this.$el.find ('select[name=schedule_time]').val () != 'Time')
		{
			var time = this.$el.find ('select[name=schedule_time]').val ().split (':');

			if (time.length == 2)
			{
				date.setHours (time[0]);
				date.setMinutes (time[1]);
			}
		}
		else
		{
			return false;
		}

		return date;
	},

	'getSelectedDate' : function ()
	{
		var self = this;
		var date = new Date ();

		var randomdate = new Date ();
		randomdate.setFullYear (date.getFullYear (), date.getMonth (), date.getDate ());
		randomdate.setHours (0, 0, 0, 0);

		if (this.$el.find ('select[name=schedule_day]').val () != 'Day')
		{
			randomdate.setDate (this.$el.find ('select[name=schedule_day]').val ());
		}

		if (this.$el.find ('select[name=schedule_month]').val () != 'Month')
		{
			randomdate.setMonth (this.$el.find ('select[name=schedule_month]').val () - 1);
		}

		if (this.$el.find ('select[name=schedule_year]').val () != 'Year')
		{
			randomdate.setFullYear (this.$el.find ('select[name=schedule_year]').val ());
		}

		return randomdate;
	},

	'randomTime' : function ()
	{
		var randomdate = this.getSelectedDate ();

		var available_timestamps = [
			{ 'start' : 60 * 8, 'end' : 60 * 9 },
			{ 'start' : (60 * 12) + (15), 'end' : 60 * 14 },
			{ 'start' : (60 * 19), 'end' : (60 * 24) - 1 }
		];

		var index = Math.floor (Math.random() * 3);

		var daterange = available_timestamps[index];

        var now = new Date();

		var randomminute = daterange.start + (Math.random () * (daterange.end - daterange.start));
		randomdate.setMinutes (randomminute);

        // Hacky hacky no time.
        if (randomdate < now)
        {
            this.randomTime ();
            return;
        }

		this.setScheduleDate (randomdate);
		this.resetWithin (false);

		this.trigger ('content:change');
		
	},

	'resetWithin' : function (alsoRandom)
	{
		if (typeof (alsoRandom) == 'undefined')
		{
			alsoRandom = true;
		}

		this.$el.find ('[name=delay]').prop ('checked', false).trigger ('change');

		if (alsoRandom)
		{
			this.$el.find ('[name=schedule_random]').prop ('checked', false).trigger ('change');
		}

		var self = this;
		setTimeout (function ()
		{
			self.trigger ('content:change');
		}, 1);

		// See if year is selected
		if (this.$el.find ('select[name=schedule_year]').val () == 'Year')
		{
			this.$el.find ('select[name=schedule_year]').val ((new Date()).getFullYear ());
		}
	},

	'toggleSchedule' : function ()
	{
		if (!this.getScheduleDate ())
		{
			var date = new Date ();
			date.setMinutes (date.getMinutes () + 15);

			this.setScheduleDate (date);
		}

		//console.log ('this');
		this.$el.find ('.message-schedule').toggleClass ('hidden');

		this.$el.find ('#schedule-btn-toggle').toggleClass ('black', this.$el.find ('.message-schedule').is (':visible'));
		this.$el.find ('#schedule-btn-toggle').toggleClass ('blue', !this.$el.find ('.message-schedule').is (':visible'));

		this.trigger ('content:change');
	},

    'shortenUrl' : function (e)
    {
        e.preventDefault ();

        var field = this.$el.find ('[name=url]');
        var textarea = this.$el.find ('[name=message]');

        $.getJSON( 'http://wlk.rs/api/shorten?callback=?', {
            'url' : field.val (),
            'output' : 'jsonp',
            'format': "json"
        })
        .done(function( data ) {
            if (data.shortUrl)
            {
                textarea.val (textarea.val () + ' ' + data.shortUrl);
                field.val ('');
            }
            else
                Cloudwalkers.RootView.alert (data.error.message);
        });
    }
});