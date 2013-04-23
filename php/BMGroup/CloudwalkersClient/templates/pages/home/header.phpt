        <style>
				.prototype{
					display:none;
				}
				</style>
				<script language="javascript" type="text/javascript">
				function change_content(strType, strUrl){
					switch(strType){
						case "users":
							break;
						case "notifications":
							jQuery.ajax({
								cache:false, 
								async:true, 
								/*type:"post", 
								data:$j(form).serialize(), */
								url:strUrl, 
								success:function(strData){
									alert(strData);
									jQuery.each(JSON.parse(strData), function(i, val) {
										alert(i + ' - ' + val);
										//$("#" + i).append(document.createTextNode(" - " + val));
									});
									jQuery.each(strData, function(i, val) {
										alert(i + ' - ' + val);
										//$("#" + i).append(document.createTextNode(" - " + val));
									});
									
									/*
									for
									
									alert('ok ' + strData);
									
									jQuery("#content").text(strData);*/
									jQuery("#notify_amount").text("0");
								}
							});
							break;
						case "inbox":
							jQuery("#loading").show();
							jQuery.ajax({
								cache:false, 
								async:true, 
								/*type:"post", 
								data:$j(form).serialize(), */
								url:strUrl, 
								success:function(strData){
									jQuery.each(JSON.parse(strData), function(i, val) {
										alert(i + ' - ' + val);
										//$("#" + i).append(document.createTextNode(" - " + val));
									});
									
									/*
									for
									
									alert('ok ' + strData);
									
									jQuery("#content").text(strData);*/
									jQuery("#loading").hide();
								}
							});
							break;
						case "profiles":
							
							break;
						case "news":
							
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
                      <a href="javascript:;" onclick="change_content('notifications', '<?php echo 'http://' . $_SERVER['HTTP_HOST'] . '/json/account/' . $user['accounts'][0]['id'] . '/notifications'; ?>');" class="button open"><span><strong style="margin-left:-18px;"><em id="notify_amount"><?php echo $user['accounts'][0]['notifications']['unread']; ?></em></strong>&nbsp;&nbsp;Notifications</span></a>
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
<?php 
$arrChannels = array();
foreach($user['accounts'][0]['channels'] as $arrChannel){
	$arrChannels[$arrChannel['name']] = $arrChannel['id'];
}
?>
            <div class="navigation-box">
              <strong class="logo"><a href="#">cloudwalkers speread, listen and interact</a></strong>
              <ul id="nav">
                <li><a href="/"><img src="images/img2.png" alt="image description" width="53" height="50" /><strong>Dashboard</strong></a></li>
                <li>
                  <a href="javascript:;" onclick="change_content('inbox', '<?php echo 'http://' . $_SERVER['HTTP_HOST'] . '/json/channel/' . $arrChannels['Inbox']; ?>');">
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