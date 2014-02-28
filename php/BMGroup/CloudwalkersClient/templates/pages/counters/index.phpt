<!DOCTYPE html>
<html>
	<head>
		<script src="//code.jquery.com/jquery-1.10.2.min.js" type="text/javascript"></script>
		<script src="/assets/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>

		<script type="text/javascript">

			$(document).ready (function ()
			{
				var streamdom = {};
				var counters = {};
				var account = null;

				var counterstomonitor = ['incoming', 'incomingUnread'];

				function updateStreamData (stream)
				{
					var okay = true;

					var element = streamdom[stream.id];
					var streamcounters = counters[stream.id];

					// the various counters
					$.each (counterstomonitor, function ()
					{
						if (typeof (streamcounters[this]) == 'undefined')
						{
							streamcounters[this] = $('<li><span class="name">' + this + ':</span><span class="value"></span> <span class="progress"></span></li>');
							element.find ('ul').append (streamcounters[this]);
						}

						var oldvalue = streamcounters[this].find ('span.value').html ();
						if (stream.count[this] == null || stream.count[this] < 0)
						{
							okay = false;
						}

						streamcounters[this].find ('span.value').html (stream.count[this]);

						if (oldvalue)
						{
							var dt = stream.count[this] - oldvalue;

							if (dt >= 0)
							{
								dt = '+' + dt;
							}
							streamcounters[this].find ('span.progress').html (dt);
						}
					});

					if (okay)
					{
						element.addClass ('okay');
						element.removeClass ('error');
					}
					else
					{
						element.addClass ('error');
						element.removeClass ('okay');
					}

					element.effect ('highlight', {}, 1000);
				}

				function refreshStream (streamid)
				{
					//console.log ('Refreshing stream ' + streamid);
					$.ajax ('/json/streams/' + streamid,
						{
							'success' : function (stream)
							{
								updateStreamData (stream.stream);
							}
						}
					);
				}

				function showMessage (message)
				{
					var oneliner = '[' + message.stream + '] ';

					if (message.subject)
					{
						oneliner += '<strong>' + message.subject + '</strong>: ';
					}

					oneliner += message.body.plaintext;

					console.log (oneliner);
				}

				function showMessages (newMessages)
				{
					$.ajax ('/json/messages?ids=' + newMessages.join (','), {
						'success' : function (data)
						{
							$.each (data.messages, function ()
							{
								showMessage (this);
							});
						}
					});
				}

				var lastpage = '';
				function ping ()
				{
					$.ajax ('/json/accounts/' + account.id + '/ping?after=' + lastpage, { 'success' : function (data)
					{
						lastpage = data.pong.paging.cursors.after;

						if (typeof (data.pong.updates) != 'undefined'
							&& typeof (data.pong.updates.streams) != 'undefined')
						{
							//console.log (data.pong.updates.streams);
							$.each (data.pong.updates.streams, function ()
							{
								refreshStream (this);
							});
						}

						var newMessages = [];

						// Also collect all messages
						if (typeof (data.pong.add) != 'undefined'
							&& typeof (data.pong.add.streams) != 'undefined')
						{
							//console.log (data.pong.updates.streams);
							$.each (data.pong.add.streams, function ()
							{
								var stream = this;
								$.each (stream.messages, function ()
								{
									newMessages.push (this);
								});
							});
						}

						if (newMessages.length > 0)
						{
							showMessages (newMessages);
						}

						setTimeout (ping, 1000);
					}});
				}

				// Fetch all streams
				$.ajax ('/json/user/me', {
					'success' : function (me)
					{
						// Take first account, for easyness.
						account = me.user.accounts[0];

						$.ajax ('/json/accounts/' + account.id + '/streams',
						{
							'success' : function (streams)
							{
								$.each (streams.streams, function ()
								{
									var stream = this;

									var element = $('<div class="stream"></div>');
									element.append ('<h3>' + this.id + ' ' + this.name.substr (0, 25) + '</h3>');
									element.append ('<ul class="counters"></ul>');
									streamdom[this.id] = element;
									counters[this.id] = {};

									// Click = refresh
									element.click (function ()
									{
										refreshStream (stream.id);
										$(this).toggleClass ('selected');
									});

									$('#container').append (element);
									updateStreamData (this);
								});
							}
						});

						ping ();
					}
				});
			});

		</script>

		<style>

			*
			{
				margin: 0;
				padding: 0;
			}

			body
			{
				background: gray;
				font-size: 12px;
				font-family: Verdana;
			}

			div.stream
			{
				width: 250px;
				float: left;
				border: 1px solid gray;
				background: white;
				margin: 2px;
				padding: 5px;
				border: 1px solid black;
			}

			div.stream.error
			{
				border: 1px solid red;
				background: indianred;
				color: white;
			}

			h3
			{
				text-align: center;
				font-size: 100%;
			}

			ul
			{
				list-style: none;
			}

			li
			{
				padding: 2px;
			}

			li .name
			{
				width: 150px;
				display: inline-block;
			}

			li .value
			{
				width: 60px;
				display: inline-block;
			}

			div.selected
			{
				border-color: blue;
				background: #66CCFF;
			}
		</style>

	</head>

	<body>

		<div id="container">

		</div>

	</body>
</html>