<html>
	<body>

		<h2>Navigation</h2>
		<ul>
			<?php if ($login) { ?>

				<li>
					<a href="<?php echo Neuron_URLBuilder::getUrl ('accounts'); ?>">Accounts</a>
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