<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Cloudwalkers</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link media="all" rel="stylesheet" href="<?php echo BASE_URL; ?>css/style.css" type="text/css" />
    <link media="all" rel="stylesheet" href="<?php echo BASE_URL; ?>css/fancybox.css" type="text/css" />
    <link media="all" rel="stylesheet" href="<?php echo BASE_URL; ?>css/all.css" type="text/css" />
    <link media="all" rel="stylesheet" href="<?php echo BASE_URL; ?>css/jcf.css" type="text/css" />
    <link media="all" rel="stylesheet" href="http://fonts.googleapis.com/css?family=Titillium+Web:400,600,700,600italic,700italic" type="text/css" />

    <script type="text/javascript">
        var CONFIG_BASE_URL = '<?php echo BASE_URL; ?>';

        var Cloudwalkers = {};


    </script>

    <script type="text/javascript" src="<?php echo BASE_URL; ?>js/lib/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="<?php echo BASE_URL; ?>js/jquery.main.js"></script>
    <script type="text/javascript" src="<?php echo BASE_URL; ?>js/lib/mustache.js"></script>
    <script type="text/javascript" src="<?php echo BASE_URL; ?>js/lib/underscorejs/underscore.js"></script>
    <script type="text/javascript" src="<?php echo BASE_URL; ?>js/lib/backbonejs/backbone.js"></script>

    <!-- Application -->

        <!-- Application -->
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Cloudwalkers.js"></script>
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Session.js"></script>

        <!-- Router -->
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Router/Router.js"></script>

        <!-- Views -->
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Root.js"></script>    
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Channel.js"></script>
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Loading.js"></script>
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Header.js"></script>
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Dashboard.js"></script>
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/MessageContainer.js"></script>
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Message.js"></script>

        <!-- Models -->
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Models/User.js"></script>
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Models/Account.js"></script>
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Models/Message.js"></script>

        <!-- Collections -->
        <script type="text/javascript" src="<?php echo BASE_URL; ?>js/Collections/Channel.js"></script>

    <!-- /Application -->

    <script type="text/javascript" src="<?php echo BASE_URL; ?>js/messages.js"></script>
    <script type="text/javascript" src="<?php echo BASE_URL; ?>templates/templates.js"></script>

    <script src="js/lib/uploader/jquery-ui-1.10.3.custom.min.js"></script>
    <script src="js/lib/uploader/jquery.iframe-transport.js"></script>
    <script src="js/lib/uploader/jquery.fileupload.js"></script>


    <!--[if lt IE 9]><link media="all" rel="stylesheet" href="css/ie.css" type="text/css" /><![endif]-->
	</head>
    <body>
        <div id="wrapper">
            <div id="header">
                <?php // echo $header; ?>
            </div>

            <div id="main">
                <div class="main-holder">
                    <div id="content">
                        <?php // echo $content; ?>
                    </div>
                </div>
            </div>
            
            <div id="footer">
                <?php echo $footer; ?>
            </div>
        </div>
    </body>
</html>