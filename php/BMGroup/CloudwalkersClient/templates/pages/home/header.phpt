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
				var objBlocks = {
					"inbox":{ "class":"block-inbox", "display":true }, 
					"links":{ "class":"block-links", "display":true }, 
					"schedule":{ "class":"block-schedule", "display":true }, 
					"statistics":{ "class":"block-statistics", "display":true }, 
					"filters":{ "class":"block-filters", "display":true }
				};
				
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
										//{"id":1,"message":"This is a message"}
										jQuery.each(objData.notifications, function(nbrIndex, objValue){
											var objClone = jQuery(".notification-box ul li.prototype").first().clone();
											objClone.find("a").text(objValue.message);
											objClone.removeClass("prototype").appendTo(jQuery(".notification-box ul"));
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
							jQuery.each(objBlocks, function(nbrIndex, objValue){
								jQuery("." + objValue.class).hide();
							});
							jQuery(".dash-only").hide();
							jQuery(".block-inbox").show();
							jQuery.ajax({
								async:true, 
								cache:false, 
								data:"", 
								dataType:"json", 
								type:"get", 
								url:"http://<?php echo $_SERVER['HTTP_HOST']; ?>/json/channel/" + strExtra, 
								success:function(objData){
									//{"id":"134","body":{"html":"<p>iPad in Q4 2012 opnieuw meest verkochte tablet. - http:\/\/bit.ly\/UFQDnh<\/p>","plaintext":"iPad in Q4 2012 opnieuw meest verkochte tablet. - http:\/\/bit.ly\/UFQDnh"},"from":[{"name":"Cloudwalkers","avatar":"https:\/\/graph.facebook.com\/272752359511949\/picture"}],"attachments":[{"url":"http:\/\/bit.ly\/UFQDnh","type":"link"},{"url":"http:\/\/platform.ak.fbcdn.net\/www\/app_full_proxy.php?app=218457351622813&v=1&size=z&cksum=a225b0f241f4b974ec469bedba2ad157&src=http%3A%2F%2Fstatic.macworld.nl%2Fthumbnails%2F88x97%2F2%2F2%2F22f40e9d3100ee605b72fc0b58a61c00.jpg","type":"image"}],"date":"2013-01-31T14:26:00+00:00","actions":[{"token":"like","name":"Like","parameters":[]},{"token":"comment","name":"Comment","parameters":[{"token":"message","name":"Message","type":"string","required":true,"max-size":140}]}],"children_count":0,"likes":0}
									var objCommentClone = jQuery(".block-inbox .scrollable-area .comment-box.prototype").first().clone();
									jQuery.each(objData.channel.messages, function(nbrIndex, objValue){
										var objPostClone = objCommentClone.find(".post-row.prototype").first().clone();
										objPostClone.find(".text-post").html('<div class="picture"><img src="images/img10.jpg" alt="image description" width="93" height="68" /></div>' + objValue.body.html);
										objPostClone.removeClass("prototype").appendTo(objCommentClone);
									});
									objCommentClone.removeClass("prototype").appendTo(jQuery(".block-inbox .scrollable-area"));
											/*<div class="comment-box prototype">
                        <div class="comment-heading">
                          <h3>Co-Workers</h3>
                        </div>
                        <div class="post-row prototype">
                          <div class="picture">
                            <img src="images/ico8.png" alt="image description" width="27" height="28" />
                          </div>
                          <div class="post-box">
                            <div class="title-post">
                              <span class="time">4 hours ago</span>
                              <h4>name co-worker</h4>
                            </div>
                            <div class="post">
                              <h5>Title text detail</h5>
                              <div class="holder">
                                <div class="text-post">
                                  <div class="picture">
                                    <img src="images/img10.jpg" alt="image description" width="93" height="68" />
                                  </div>
                                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida iaculis nisl eu dapibus. ura bitur non sagittis erat. Fusce ut nulla Lo Lorem ipsum dolor sit amet, consectetur adipis cing eli t. Sed gravida iaculis nisl eu dapibus. Curabitur non sagittis erat. Fusce ut nulla Lo ...</p>
                                </div>
                                <div class="col-button">
                                  <a href="#" class="button-post"><span>post</span></a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
											</div>*/
									jQuery("#loading").hide();
								}
							});
							break;
						case "reports":
							
							break;
						default://dashboard
							jQuery.each(objBlocks, function(nbrIndex, objValue){
								jQuery("." + objValue.class).show();
							});
							jQuery(".dash-only").show();
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
                      <li><a class="login" href="<?php echo Neuron_URLBuilder::getUrl ('logout'); ?>">logout</a></li>
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
              </ul>
            </div>
          </div>
        </div>