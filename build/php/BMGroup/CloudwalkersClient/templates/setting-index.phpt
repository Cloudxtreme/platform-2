<html>
	<head>
		<head>

			<script type="text/javascript" src="<?php echo BASE_URL; ?>js/lib/jquery-1.8.3.min.js"></script>

			<style type="text/css">

				body
				{
					font-family: verdana, sans-serif;
					font-size: 12px;
				}

				td
				{
					font-size: 12px;
				}

				input
				{
					width: 400px;
					border: 1px solid #ccc;
					padding: 3px;
				}

				input[type=checkbox]
				{
					width: auto;
				}

				td.first
				{
					width: 200px;
				}

				th
				{
					text-align: left;
					font-size: 10px;
				}

				h2
				{
					border-bottom: 3px solid black;
				}

				h3
				{
					border-bottom: 1px solid black;
				}

				p.description
				{
					border: 1px solid #ddd;
					background: #eee;
					padding: 10px;
				}

				p.false
				{
					border: 3px solid red;
					color: red;
					padding: 10px;
					font-size: 20px;
				}

				.substreams
				{
					border: 1px solid orange;
					background: #FFFFD5;
					padding: 10px 20px;
					margin: 10px;
					border-left: 10px solid gray;
				}

				.substreams h3
				{
					font-size: 20px;
				}

				.substreams .substreams
				{
					background: #eee;
				}

				.substreams .substreams h3
				{
					font-size: 15px;
				}

				.last-messages
				{
					border: 1px solid gray;
					padding: 20px;
					margin: 10px;
					background: #D9E9FF;
				}

			</style>

			<script type="text/javascript">

				$(document).ready (function ()
				{
					$('.load-message-link').click (function (e)
					{
						e.preventDefault ();

						var id = $(this).attr ('data-stream-id');
						var container = $($(this).parent ());

						container.html ('Please wait, loading...');

						$.ajax 
						(
							'<?php echo BASE_URL; ?>json/stream/' + id + '?records=3', 
							{
								'success' : function (result)
								{
									container.html ('');

									for (var i = 0; i < result.stream.messages.length; i ++)
									{
										var message = result.stream.messages[i];
										console.log (message);

										var from = typeof (message.from) != 'undefined' && message.from.length > 0 ? message.from[0].name : 'unknown';

										container.append ('<p class="messages"><strong>' + from + '</strong>: ' + message.body.plaintext + '</p>');
									}

									if (result.stream.messages.length == 0)
									{
										container.html ('There are not messages right now.');
									}
								}
							}
						);

					});
				});

			</script>

		</head>
	</head>

	<body>
		<?php echo $content; ?>
	</body>
</html>