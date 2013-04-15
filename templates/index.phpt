<html>

	<head>
		<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />

		<link href="css/style.css" rel="stylesheet" type="text/css" />
	</head>

	<body>

		<h2>Navigation</h2>
		<ul>
			<?php if ($login) { ?>

				<li>
					<a href="<?php echo Neuron_URLBuilder::getUrl ('services'); ?>">Services</a>
				</li>
			
				<li>
					<a href="<?php echo Neuron_URLBuilder::getUrl ('logout'); ?>">Logout</a>
				</li>

			<?php } else { ?>
				<li>
					<a href="<?php echo Neuron_URLBuilder::getUrl ('login'); ?>">Login</a>
				</li>
			<?php } ?>
		</ul>

		<div id="content">
			<?php echo $content; ?>
		</div>
	</body>
</html>