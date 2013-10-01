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
		<link href="<?php echo BASE_URL; ?>assets/css/cloudwalkers.css" rel="stylesheet" type="text/css" />
		<!-- END GLOBAL MANDATORY STYLES -->
		<!-- BEGIN PAGE LEVEL STYLES --> 
		<link href="<?php echo BASE_URL; ?>assets/plugins/gritter/css/jquery.gritter.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet" type="text/css" />
		<link href="<?php echo BASE_URL; ?>assets/plugins/fullcalendar/fullcalendar/fullcalendar.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/jqvmap/jqvmap/jqvmap.css" rel="stylesheet" type="text/css" media="screen"/>
		<link href="<?php echo BASE_URL; ?>assets/plugins/jquery-easy-pie-chart/jquery.easy-pie-chart.css" rel="stylesheet" type="text/css" media="screen"/>

		<link rel="stylesheet" type="text/css" href="<?php echo BASE_URL; ?>assets/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.css"/>
		<link href="<?php echo BASE_URL; ?>assets/css/pages/dashboard.css" rel="stylesheet" type="text/css"/>
		<link href="<?php echo BASE_URL; ?>assets/css/pages/timeline.css" rel="stylesheet" type="text/css"/>
		<!--<link href="<?php echo BASE_URL; ?>assets/css/pages/inbox.css" rel="stylesheet" type="text/css"/>-->
		
		<link href="<?php echo BASE_URL; ?>assets/plugins/bootstrap-modal/css/bootstrap-modal.css" rel="stylesheet" type="text/css"/>

		<link href="<?php echo BASE_URL; ?>assets/css/pages/monitoring.css" rel="stylesheet" type="text/css" />
		<link href="assets/css/pages/compose.css" rel="stylesheet" type="text/css" />
		<!-- END PAGE LEVEL STYLES -->
		<link rel="shortcut icon" href="favicon.ico" />
	</head>

	<body class="page-header-fixed page-sidebar-fixed">

		<!-- BEGIN HEADER -->
		<header class="header navbar navbar-inverse navbar-fixed-top"></header>
		<!-- END HEADER -->


		<!-- BEGIN CONTAINER -->
		<div class="page-container">
			<!-- BEGIN SIDEBAR -->
			<nav class="page-sidebar nav-collapse collapse navigation-container"></nav>
			<!-- END SIDEBAR -->
			<!-- BEGIN PAGE -->
			<div id="inner-content" class="page-content"></div>
			<!-- END PAGE -->
		</div>
		<!-- END CONTAINER -->
		
		<!-- BEGIN FOOTER -->
		<div class="footer">
			<div class="footer-inner">
				2013 &copy; Cloudwalkers by bmgroup.
			</div>
			<div class="footer-tools">
				<span class="go-top">
				<i class="icon-angle-up"></i>
				</span>
			</div>
		</div>
		<!-- END FOOTER -->

		<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->

		<!-- Application -->
			<?php include 'scripts.phpt'; ?>
		<!-- /Application -->

		<!-- END JAVASCRIPTS -->

		<?php include 'tracking.phpt'; ?>
		
	</body>
</html>