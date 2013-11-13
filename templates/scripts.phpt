<script type="text/javascript">
	var CONFIG_BASE_URL = '<?php echo BASE_URL; ?>';
	var Cloudwalkers = {};
</script>


<!-- JQUERY PLUGINS -->
<script src="/assets/plugins/jquery-1.10.1.min.js" type="text/javascript"></script>
<script src="/assets/plugins/uniform/jquery.uniform.min.js" type="text/javascript" ></script>
<script src="/assets/plugins/jquery-slimscroll/jquery.slimscroll.js" type="text/javascript"></script>
<script src="/assets/plugins/flot/jquery.flot.js" type="text/javascript"></script>
<script src="/assets/plugins/flot/jquery.flot.resize.js" type="text/javascript"></script>
<script src="/assets/plugins/flot/jquery.flot.pie.js" type="text/javascript"></script>
<script src="/assets/plugins/flot/jquery.flot.stack.js" type="text/javascript"></script>
<script src="/assets/plugins/flot/jquery.flot.crosshair.js" type="text/javascript"></script>
<script src="/assets/plugins/flot/jquery.flot.time.js" type="text/javascript"></script>
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
<script src="/assets/plugins/mustache.js" type="text/javascript"></script>
<script src="/assets/plugins/underscorejs/underscore.js" type="text/javascript"></script>
<script src="/assets/plugins/backbonejs/backbone.js" type="text/javascript"></script>
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


<?php include 'buildscripts.phpt'; ?>

<script>
	jQuery(document).ready(function() {    

		Cloudwalkers.RootView.on('content:change', function() {
			
			/*
			 *	Deprecated!
			 *	should be OO...	
			 */
			App.initUniform();
            jQuery('.tooltips').tooltip ();

		});
	});




</script>