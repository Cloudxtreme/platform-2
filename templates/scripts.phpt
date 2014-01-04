<script type="text/javascript">
	var CONFIG_BASE_URL = '<?php echo BASE_URL; ?>';
	var Cloudwalkers = {};
</script>

<!-- TEMPORARY CDN'S, UNTILL PLATFORM CACHING -->
<!--<script src="http://codeorigin.jquery.com/jquery-1.10.2.min.js" type="text/javascript"></script>-->
<script src="//code.jquery.com/jquery-1.10.2.min.js" type="text/javascritp"></script>
<script src="//cdn.jsdelivr.net/uniformjs/2.1.1/jquery.uniform.min.js" type="text/javascript" ></script>
<script src="//cdn.jsdelivr.net/mustache.js/0.7.3/mustache.min.js" type="text/javascript"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js" type="text/javascript"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min.js" type="text/javascript"></script>

<!-- JQUERY PLUGINS -->
<script src="/assets/plugins/jquery-slimscroll/jquery.slimscroll.js" type="text/javascript"></script>
<script src="/assets/plugins/flot/jquery.flot.js" type="text/javascript"></script>
<script src="/assets/plugins/flot/jquery.flot.resize.js" type="text/javascript"></script>
<script src="/assets/plugins/flot/jquery.flot.pie.js" type="text/javascript"></script>
<script src="/assets/plugins/flot/jquery.flot.stack.js" type="text/javascript"></script>
<script src="/assets/plugins/flot/jquery.flot.crosshair.js" type="text/javascript"></script>
<script src="/assets/plugins/flot/jquery.flot.time.js" type="text/javascript"></script>
<script src="/assets/plugins/gritter/js/jquery.gritter.min.js" type="text/javascript"></script>
<script src="/assets/plugins/chosen/chosen.jquery.min.js" type="text/javascript"></script>
<script src="/assets/plugins/moment.min.js" type="text/javascript"></script>

<!-- JQUERY UI PLUGINS -->
<script src="/assets/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>
<script src="/assets/plugins/uploader/jquery.iframe-transport.js" type="text/javascript"></script>
<script src="/assets/plugins/uploader/jquery.fileupload.js" type="text/javascript"></script>
<!-- END JQUERY UI PLUGINS -->
<!-- END JQUERY PLUGINS -->
<!-- BOOTSTRAP PLUGINS -->
<script src="/assets/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="/assets/plugins/bootstrap-daterangepicker/date.js" type="text/javascript"></script>
<script src="/assets/plugins/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>    
<script src="/assets/plugins/bootstrap-modal/js/bootstrap-modal.js" type="text/javascript"></script>
<script src="/assets/plugins/bootstrap-modal/js/bootstrap-modalmanager.js" type="text/javascript" ></script>
<!-- END BOOTSTRAP PLUGINS --> 
<!-- BACKBONE PLUGINS -->
<!-- END BACKBONE PLUGINS -->
<!--[if lt IE 9]>
<script src="/assets/plugins/excanvas.min.js"></script>
<script src="/assets/plugins/respond.min.js"></script>
<script src="/assets/plugins/modernizr/modernizr.js"></script>
<![endif]-->

<!-- PAGE LEVEL SCRIPTS -->
<script src="/assets/scripts/app.js" type="text/javascript"></script>
<script src="/assets/scripts/charts.js" type="text/javascript"></script>
<!-- END PAGE LEVEL SCRIPTS -->

<!-- Templates -->
<script type="text/javascript" src="/templates/templates.js"></script>
<?php include 'buildscripts.phpt'; ?>

<script>
	$(document).ready(function() {   
		
		Store = new StorageClass();
		
		Cloudwalkers.init ();
	});
</script>