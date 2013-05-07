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

    <script type="text/javascript">
        var CONFIG_BASE_URL = '<?php echo BASE_URL; ?>';
    </script>

    <script type="text/javascript" src="js/lib/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="js/jquery.main.js"></script>


    <script type="text/javascript" src="js/messages.js"></script>    


    <!--[if lt IE 9]><link media="all" rel="stylesheet" href="css/ie.css" type="text/css" /><![endif]-->
	</head>
    <body>
        <div id="wrapper">
            <div id="header">
                <?php echo $header; ?>
            </div>

            <div id="main">
                <div class="main-holder">
                    <div id="content">
                        <?php echo $content; ?>
                    </div>
                </div>
            </div>
            
            <div id="footer">
                <?php echo $footer; ?>
            </div>
        </div>
    </body>
</html>