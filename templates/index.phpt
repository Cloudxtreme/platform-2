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
    <div id="wrapper">
    	<div id="header">
        <div class="header-top">
          <div class="header-holder">
            <div class="top-nav">
              <div class="holder">
                <div class="frame">
                  <div class="account-box">
                    <ul>
                      <li><a class="login" href="#">login</a></li>
                      <li>Hi,<strong> Philip Hendrickx</strong></li>
                    </ul>
                    <a class="add-logo" href="#"><img src="images/img1.png" alt="image description" width="41" height="41" /></a>
                  </div>
                  <div class="button-box">
                    <a href="#" class="button user-button"><span>Users</span></a>
                    <div class="notification-box">
                      <a href="#" class="button open"><span><strong><em>9</em></strong>Notifications</span></a>
                      <div class="popup">
                        <div class="popup-holder">
                          <div class="popup-frame">
                            <ul>
                              <li>
                                <div class="text account">
                                  <p><a href="#">John Doe is responding on Topic X saying <em>“ This just a respond you know...”</em></a></p>
                                  <div class="row"><span class="time">4 hours ago</span> Max 3 lines here</div>
                                </div>
                              </li>
                              <li>
                                <div class="text account">
                                  <p><a href="#">John Doe is responding on Topic X saying <em>“ This just a respond you know...”</em></a></p>
                                  <div class="row"><span class="time">4 hours ago</span> Max 3 lines here</div>
                                </div>
                              </li>
                              <li>
                                <div class="text account">
                                  <p><a href="#">John Doe is responding on Topic X saying <em>“ This just a respond you know...”</em></a></p>
                                  <div class="row"><span class="time">4 hours ago</span> Max 3 lines here</div>
                                </div>
                              </li>
                              <li>
                                <div class="text account">
                                  <p><a href="#">John Doe is responding on Topic X saying <em>“ This just a respond you know...”</em></a></p>
                                  <div class="row"><span class="time">4 hours ago</span> Max 3 lines here</div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a href="#" class="bottom-button">&nbsp;</a>
                </div>
              </div>
            </div>
            <div class="navigation-box">
              <strong class="logo"><a href="#">cloudwalkers speread, listen and interact</a></strong>
              <ul id="nav">
                <li><a href="#"><img src="images/img2.png" alt="image description" width="53" height="50" /><strong>Dashboard</strong></a></li>
                <li>
                  <a href="#">
                    <img src="images/img3.png" alt="image description" width="51" height="50" /><strong>Inbox</strong>
                    <span class="number">501</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="images/img4.png" alt="image description" width="54" height="50" /><strong>Profiles</strong>
                    <span class="number">9210</span>
                  </a>
                </li>
                <li><a href="#"><img src="images/img5.png" alt="image description" width="54" height="50" /><strong>News</strong></a></li>
                <li><a href="#"><img src="images/img6.png" alt="image description" width="57" height="50" /><strong>Reports</strong></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div id="main">
				<div class="main-holder">
      		
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
          
      	</div>
    	</div>
      <div id="footer">
        <div class="footer-holder">
          <div class="copyright">
            <p>copyrright - 2013</p>
          </div>
          <strong class="add-logo"><a href="#">cloudwalkers speread, listen and interact</a></strong>
        </div>
      </div>
    </div>
	</body>
</html>