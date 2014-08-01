<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<!-- BEGIN HEAD -->
	<head>
		<meta charset="utf-8" />
		<title>Cloudwalkers - Social Media Management Platform</title>

		<meta content="width=device-width, initial-scale=1.0" name="viewport" />
		<meta content="" name="description" />
		<meta content="" name="author" />
		<!-- BEGIN GLOBAL MANDATORY STYLES -->
		<link href="<?php echo BASE_URL; ?>assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/css/style-metro.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/css/style.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/css/style-responsive.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/css/themes/default.css" rel="stylesheet" type="text/css" id="style_color"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/chosen/chosen.min.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/bootstrap-datepicker/css/datepicker.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/Medium.js/medium.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/css/cloudwalkers.css" rel="stylesheet" type="text/css" />
		<!-- END GLOBAL MANDATORY STYLES -->
		<!-- BEGIN PAGE LEVEL STYLES --> 
		<link href="<?php echo BASE_URL; ?>assets/plugins/gritter/css/jquery.gritter.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/plugins/jqvmap/jqvmap/jqvmap.css" rel="stylesheet" type="text/css" media="screen"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/jquery-easy-pie-chart/jquery.easy-pie-chart.css" rel="stylesheet" type="text/css" media="screen"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/fullcalendar/fullcalendar.css" rel="stylesheet" type="text/css" />
		
		<link href="<?php echo BASE_URL; ?>assets/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/css/pages/dashboard.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/css/pages/inbox.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/css/pages/timeline.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/css/pages/calendar.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/css/pages/settings.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/css/pages/reports.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/css/pages/compose.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/css/pages/viewcontact.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/css/pages/write.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/css/pages/statistics.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/css/pages/keywords.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/css/pages/tags.css" rel="stylesheet" type="text/css" />
		
		<link href="<?php echo BASE_URL; ?>assets/plugins/bootstrap-modal/css/bootstrap-modal.css" rel="stylesheet" type="text/css"/>

		<link href="<?php echo BASE_URL; ?>assets/css/pages/monitoring.css" rel="stylesheet" type="text/css" />
		<link href="assets/css/pages/compose.css" rel="stylesheet" type="text/css" />
		<link href="assets/demo/preview.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/plugins/cal-heatmap-master/cal-heatmap.css" rel="stylesheet" type="text/css" />
		<!--<link rel="stylesheet" href="//cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.css" /> - http://kamisama.github.io/cal-heatmap/v2/ -->

		<!-- This is the demos CSS-->
		<link href="<?php echo BASE_URL; ?>assets/css/pages/demos.css" rel="stylesheet" type="text/css"/>
		
		<!-- END PAGE LEVEL STYLES -->
		<link rel="shortcut icon" href="favicon.ico" />
	</head>

	<body class="page-header-fixed page-sidebar-fixed">

		<!-- Header -->
		<div id="header" class="header navbar navbar-inverse navbar-fixed-top">
			<div class="navbar-inner">
				<div class="container-fluid">
					<a class="brand" href="/#dashboard">
						<img src="/assets/img/logo.png" alt="logo"/>
					</a>
				</div>
			</div>
		</div>
		<!-- end Header -->

		<!-- Container -->
		<div class="container-fluid page-container">
			
			<div class="row-fluid">
				
				<!-- Navigation -->
				<div id="sidebar" class="span2"></div>
				<!-- end Navigation -->
				
				<!-- Share -->
				<div id="share" class="span2 collapsed"></div>
				<!-- end Share -->
				
				<!-- Pageview -->
				<div id="inner-content" class="span10 page-content">

					<div class="container-fluid">
						<div class="row-fluid">
							<div class="container-loading">
								<i class="icon-cloud-download"></i>
							</div>
						</div>
					</div>

				</div>
				<!-- en Pageview -->
				
			</div>
		</div>
		<!-- end Container -->

		<!-- Application scripts -->
		<?php include 'scripts.phpt'; ?>
		<!-- end Application scripts -->
		
	</body>
</html>