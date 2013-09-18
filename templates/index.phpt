<!DOCTYPE html>
<!-- 
Template Name: Cloudwalkers - Responsive Admin Dashboard Template build with Twitter Bootstrap 2.3.1
Version: 1.3
Author: KeenThemes
Website: http://www.bmgroup.com/preview/?theme=metronic
Purchase: http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469
-->
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<!-- BEGIN HEAD -->
	<head>
		<meta charset="utf-8" />
		<title>Cloudwalkers</title>

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
		<link href="<?php echo BASE_URL; ?>assets/css/widgets.css" rel="stylesheet" type="text/css" />
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
		<div class="header navbar navbar-inverse navbar-fixed-top">
			<!-- BEGIN TOP NAVIGATION BAR -->
			<div class="navbar-inner">
				<div class="container-fluid">
					<!-- BEGIN LOGO -->
					<a class="brand" href="index.html">
					<img src="<?php echo BASE_URL; ?>assets/img/logo.png" alt="logo"/>
					</a>
					<!-- END LOGO -->
					<!-- BEGIN RESPONSIVE MENU TOGGLER -->
					<a href="javascript:;" class="btn-navbar collapsed" data-toggle="collapse" data-target=".nav-collapse">
					<img src="<?php echo BASE_URL; ?>assets/img/menu-toggler.png" alt="" />
					</a>          
					<!-- END RESPONSIVE MENU TOGGLER -->            
					<!-- BEGIN TOP NAVIGATION MENU -->              
					<ul class="nav pull-right">
					
						<!-- BEGIN INBOX DROPDOWN -->
						<li class="dropdown" id="header_inbox_bar">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
							<i class="icon-envelope"></i>
								<span class="badge unread-messages-count" style="display: none;">0</span>
							</a>
						</li>
						<!-- END INBOX DROPDOWN -->

						<!-- BEGIN USER LOGIN DROPDOWN -->
						<li class="dropdown user">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">
							<img class="avatar" alt=""  /> 
							<span class="username">...</span>
							<i class="icon-angle-down"></i>
							</a>
							<ul class="dropdown-menu">
								<li><a href="#users"><i class="icon-user"></i> My Profile</a></li>
								<li class="divider"></li>
								<!--<li><a href="login.html"><i class="icon-lock"></i> Lock Screen</a></li>-->
								<li><a href="<?php echo BASE_URL; ?>logout"><i class="icon-off"></i> Log Out</a></li>
							</ul>
						</li>
						<!-- END USER LOGIN DROPDOWN -->
					</ul>
					<!-- END TOP NAVIGATION MENU --> 
				</div>
			</div>
			<!-- END TOP NAVIGATION BAR -->
		</div>
		<!-- END HEADER -->


		<!-- BEGIN CONTAINER -->
		<div class="page-container">
			<!-- BEGIN SIDEBAR -->
			<div class="page-sidebar nav-collapse collapse navigation-container">
				<!-- BEGIN SIDEBAR MENU -->        
				
				<!-- END SIDEBAR MENU -->
			</div>
			<!-- END SIDEBAR -->
			<!-- BEGIN PAGE -->
			<div id="inner-content" class="page-content">

			</div>
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