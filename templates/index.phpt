<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Cloudwalkers</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link media="all" rel="stylesheet" href="css/style.css" type="text/css" />
    <link media="all" rel="stylesheet" href="css/fancybox.css" type="text/css" />
    <link media="all" rel="stylesheet" href="css/all.css" type="text/css" />
    <link media="all" rel="stylesheet" href="css/jcf.css" type="text/css" />
    <link media="all" rel="stylesheet" href="http://fonts.googleapis.com/css?family=Titillium+Web:400,600,700,600italic,700italic" type="text/css" />
    <script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="js/jquery.main.js"></script>
    <!--[if lt IE 9]><link media="all" rel="stylesheet" href="css/ie.css" type="text/css" /><![endif]-->
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