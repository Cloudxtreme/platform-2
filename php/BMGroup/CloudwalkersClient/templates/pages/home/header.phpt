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
				</style>
				<script language="javascript" type="text/javascript">
				function change_content(strType, strExtra){
					switch(strType){
						case "users":
							break;
						case "notifications":
							if(jQuery(".notification-box .popup").css("display") == "none"){
								jQuery.ajax({
									async:true, 
									cache:false, 
									data:"", 
									dataType:"json", 
									type:"get", 
									url:"http://<?php echo $_SERVER['HTTP_HOST']; ?>/json/account/" + strExtra + "/notifications", 
									success:function(objData){
										jQuery(".notification-box ul li:not(.prototype)").remove();
										jQuery.each(objData.notifications, function(nbrIndex, objValue){
											var objClone = jQuery(".notification-box ul li.prototype").first().clone();
											objClone.find("a").text(objValue.message);
											objClone.removeClass("prototype").appendTo(jQuery(".notification-box ul"));
											var objClone2 = jQuery(".notification-box ul li.prototype").first().clone();
											objClone2.find("a").text(objValue.message);
											objClone2.removeClass("prototype").appendTo(jQuery(".notification-box ul"));
										});
										jQuery(".notification-amount").text("0");
										jQuery(".notification-box .popup").show();
									}
								});
							}else{
								jQuery(".notification-box .popup").hide();
							}
							break;
						case "channel":
							jQuery("#loading").show();
							jQuery.ajax({
								async:true, 
								cache:false, 
								data:"", 
								dataType:"json", 
								type:"get", 
								url:"http://<?php echo $_SERVER['HTTP_HOST']; ?>/json/channel/" + strExtra, 
								success:function(strData){
									jQuery("#loading").hide();
								}
							});
							break;
						case "reports":
							
							break;
						default://dashboard
							
					}
				}
				</script>
        <div id="loading" style="display:none;">
        loading...
        </div>
        <div class="header-top">
          <div class="header-holder">
            <div class="top-nav">
              <div class="holder">
                <div class="frame">
                  <div class="account-box">
                    <ul>
                      <li><a class="login" href="<?php echo Neuron_URLBuilder::getUrl ('logout'); ?>">login</a></li>
                      <li>Hi, <strong><?php echo $user['name']; ?></strong></li>
                    </ul>
                    <?php if(!(empty($user['accounts'][0]['avatar']))){ ?><a class="add-logo" href="#"><img src="<?php echo $user['accounts'][0]['avatar']; ?>" alt="image description" width="41" height="41" /></a><?php } ?>
                  </div>
                  <div class="button-box">
                    <a href="#" class="button user-button"><span>Users</span></a>
                    <div class="notification-box">
                      <a href="javascript:;" onclick="change_content('notifications', '<?php echo $user['accounts'][0]['id']; ?>');" class="button open"><span><strong style="margin-left:-18px;"><em class="notification-amount"><?php echo $user['accounts'][0]['notifications']['unread']; ?></em></strong>&nbsp;&nbsp;Notifications</span></a>
                      <div class="popup">
                        <div class="popup-holder">
                          <div class="popup-frame">
                            <ul>
                            	<li class="prototype">
                                <div class="text account">
                                  <p><a href="#"></a></p>
                                  <div class="row"><span class="time">4 hours ago</span> Max 3 lines here</div>
                                </div>
                              </li>
                              <?php /*<li>
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
                              </li>*/ ?>
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
                <li class="dash">
                	<a href="javascript:;" onclick="change_content('dash', '');">
                  	<div class="icon"><div class="label"><strong>Dashboard</strong></div></div>
                  </a>
                </li>
<?php 
$arrChannels = array();
foreach($user['accounts'][0]['channels'] as $arrChannel){
?>
								<li class="<?php echo $arrChannel['type']; ?>">
                  <a href="javascript:;" onclick="change_content('channel', '<?php echo $arrChannel['id']; ?>');">
                  	<div class="icon"><div class="label"><strong><?php echo $arrChannel['name']; ?></strong></div></div>
                    <?php //if(!(empty($arrChannel['unread']))){ ?><span class="number"><?php echo $arrChannel['unread']; ?></span><?php //} ?>
                  </a>
                </li>
<?php 
}
?>
                <li class="reports">
                  <a href="#">
                  	<div class="icon"><div class="label"><strong>Reports</strong></div></div>
                  </a>
                </li>
                <?php /*<li>
                  <a href="javascript:;" onclick="change_content('inbox', '<?php echo 'http://' . $_SERVER['HTTP_HOST'] . '/json/channel/' . $arrChannels['Inbox']; ?>');">
                    <img src="images/img3.png" alt="image description" width="51" height="50" />
                    <strong>Inbox</strong>
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
                <li><a href="#"><img src="images/img6.png" alt="image description" width="57" height="50" /><strong>Reports</strong></a></li>*/ ?>
              </ul>
            </div>
          </div>
        </div>