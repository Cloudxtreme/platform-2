<style>
	.prototype{
		display:none;
	}
	#nav li a .icon{
		background:url('images/img2.png') center top no-repeat;
		height:67px;
	}
	#nav li.inbox a .icon{
		background-image:url('images/img3.png');
	}
	#nav li.profiles a .icon{
		background-image:url('images/img4.png');
	}
	#nav li.news a .icon{
		background-image:url('images/img5.png');
	}
	#nav li.reports a .icon{
		background-image:url('images/img6.png');
	}
	#nav a .label{
		bottom:24px;
		position:absolute;
		width:90px;
	}
	#nav li.reports{
		display:none;
	}
</style>

<div id="loading" style="display:none;">
	loading...
</div>

<div class="header-top">
  <div class="header-holder">
    <div class="top-nav">
      <div class="holder">
        <div class="frame">
          <div class="account-box">
          	<?php if (isset ($user)) { ?>
            <ul>
              <li><a class="login" href="<?php echo Neuron_URLBuilder::getUrl ('logout'); ?>">logout</a></li>
              <li>Hi, <strong><?php echo $user['name']; ?></strong><?php echo $GLOBALS['header-nav-active']; ?></li>
            </ul>
            <?php } ?>
            <?php if(!(empty($user['accounts'][0]['avatar']))){ ?><a class="add-logo" href="#"><img src="<?php echo $user['accounts'][0]['avatar']; ?>" alt="image description" width="41" height="41" /></a><?php } ?>
          </div>
          <div class="button-box">
            <a href="#" class="button user-button"><span>Users</span></a>
            <div class="notification-box">
            	<?php if (isset ($user)) { ?>
              <a href="javascript:;" onclick="change_content('notifications', '<?php echo $user['accounts'][0]['id']; ?>');" class="button open"><span><strong style="margin-left:-18px;"><em class="notification-amount"><?php echo $user['accounts'][0]['notifications']['unread']; ?></em></strong>&nbsp;&nbsp;Notifications</span></a>
              <?Php } ?>
              <div class="popup">
                <div class="popup-holder">
                  <div class="popup-frame">
                    <ul>
                    	<li class="prototype">
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
      <strong class="logo"><a href="javascript:;" onclick="change_content('dash', '');">cloudwalkers speread, listen and interact</a></strong>
      <ul id="nav">
        <li class="dash">
        	<a href="javascript:;" onclick="change_content('dash', '');">
          	<div class="icon"><div class="label"><strong>Dashboard</strong></div></div>
          </a>
        </li>
        <?php if (isset ($user)) { ?>
<?php 
$arrChannels = array();
foreach($user['accounts'][0]['channels'] as $arrChannel){
?>
						<li class="<?php echo $arrChannel['type']; ?>">
          <a href="javascript:;" onclick="change_content('channel', '<?php echo $arrChannel['id']; ?>');">
          	<div class="icon"><div class="label"><strong><?php echo $arrChannel['name']; ?></strong></div></div>
            <?php if(!(empty($arrChannel['unread']))){ ?><span class="number"><?php echo $arrChannel['unread']; ?></span><?php } ?>
          </a>
        </li>
<?php 
} }
?>
        <li class="reports">
          <a href="#">
          	<div class="icon"><div class="label"><strong>Reports</strong></div></div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>