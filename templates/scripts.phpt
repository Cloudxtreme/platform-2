<script type="text/javascript">
	var CONFIG_BASE_URL = '<?php echo BASE_URL; ?>';
	var Cloudwalkers = {};
</script>

<!-- PLUGON CDN'S
<script src="//code.jquery.com/jquery-1.10.2.min.js" type="text/javascript"></script>
<script src="//cdn.jsdelivr.net/uniformjs/2.1.1/jquery.uniform.min.js" type="text/javascript" ></script>
<script src="//cdn.jsdelivr.net/mustache.js/0.7.3/mustache.min.js" type="text/javascript"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js" type="text/javascript"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js" type="text/javascript"></script>
-->
<script type="text/javascript" src="https://www.google.com/jsapi"></script>

<!-- PLUGINS -->
<script src="/assets/plugins/jquery.1.10.2-min.js" type="text/javascript"></script>
<script src="/assets/plugins/jquery.uniform.2.1.1-min.js" type="text/javascript"></script>
<script src="/assets/plugins/mustache.0.7.3-min.js" type="text/javascript"></script>
<script src="/assets/plugins/underscore.1.6.0-min.js" type="text/javascript"></script>
<script src="/assets/plugins/backbone.1.0.0-min.js" type="text/javascript"></script>

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
<script src="assets/plugins/fullcalendar/fullcalendar.js"></script>
<script src="assets/plugins/scrollrefresh/scrollrefresh.js"></script>
<script src="assets/plugins/oembedall/jquery.oembed.js"></script>
<script src="assets/plugins/d3/d3.v3.min.js"></script>
<script src="assets/plugins/cal-heatmap-master/cal-heatmap.min.js"></script>

<!-- JQUERY UI PLUGINS -->
<script src="/assets/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>
<script src="/assets/plugins/uploader/jquery.iframe-transport.js" type="text/javascript"></script>
<script src="/assets/plugins/uploader/jquery.fileupload.js" type="text/javascript"></script>

<!-- BOOTSTRAP PLUGINS -->
<script src="/assets/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="/assets/plugins/bootstrap-daterangepicker/date.js" type="text/javascript"></script>
<script src="/assets/plugins/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script> 
<script src="/assets/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js" type="text/javascript"></script>
<script src="/assets/plugins/bootstrap-timepicker/js/bootstrap-timepicker.js" type="text/javascript"></script>
<script src="/assets/plugins/bootstrap-modal/js/bootstrap-modal.js" type="text/javascript"></script>
<script src="/assets/plugins/bootstrap-modal/js/bootstrap-modalmanager.js" type="text/javascript" ></script>

<!-- HTML5 PLUGINS -->
<script src="/assets/plugins/chart.js/Chart.min.js"></script>
<script src="/assets/plugins/chart.js.legend/legend.js"></script>
<script src="/assets/plugins/media.js"></script>

<!--[if lt IE 9]>
<script src="/assets/plugins/excanvas.min.js"></script>
<script src="/assets/plugins/respond.min.js"></script>
<script src="/assets/plugins/modernizr/modernizr.js"></script>
<![endif]-->

<!-- PAGE LEVEL SCRIPTS -->
<script src="/assets/scripts/charts.js" type="text/javascript"></script>

<!-- Templates -->
<script type="text/javascript" src="/templates/templates.js"></script>
<?php include 'buildscripts.phpt'; ?>

<script>
	$(document).ready(function() {   
		
		Store = new StorageClassLocal();
		
		/*Store = window.indexedDB?
			new StorageClassIDB("CloudwalkersDB", 1):
			new StorageClassLocal();*/
		
		Cloudwalkers.init ();
	});
</script>