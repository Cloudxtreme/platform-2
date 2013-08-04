<script type="text/javascript">
	var CONFIG_BASE_URL = '<?php echo BASE_URL; ?>';
	var Cloudwalkers = {};
</script>


<!-- BEGIN CORE PLUGINS -->
<script src="<?php echo BASE_URL; ?>assets/plugins/jquery-1.10.1.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/jquery-migrate-1.2.1.min.js" type="text/javascript"></script>
<!-- IMPORTANT! Load jquery-ui-1.10.1.custom.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
<script src="<?php echo BASE_URL; ?>assets/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>      
<script src="<?php echo BASE_URL; ?>assets/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<!--<script src="<?php echo BASE_URL; ?>js/lib/fancybox.js" type="text/javascript"></script>-->
<!--[if lt IE 9]>
<script src="<?php echo BASE_URL; ?>assets/plugins/excanvas.min.js"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/respond.min.js"></script>  
<![endif]-->   
<script src="<?php echo BASE_URL; ?>assets/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/jquery.blockui.min.js" type="text/javascript"></script>  
<script src="<?php echo BASE_URL; ?>assets/plugins/jquery.cookie.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/uniform/jquery.uniform.min.js" type="text/javascript" ></script>
<!-- END CORE PLUGINS -->
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="<?php echo BASE_URL; ?>assets/plugins/jquery.sparkline.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/jquery.pulsate.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/jqvmap/jqvmap/jquery.vmap.js" type="text/javascript"></script>   
<script src="<?php echo BASE_URL; ?>assets/plugins/jqvmap/jqvmap/maps/jquery.vmap.russia.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/jqvmap/jqvmap/maps/jquery.vmap.world.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/jqvmap/jqvmap/maps/jquery.vmap.europe.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/jqvmap/jqvmap/maps/jquery.vmap.germany.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/jqvmap/jqvmap/maps/jquery.vmap.usa.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/jqvmap/jqvmap/data/jquery.vmap.sampledata.js" type="text/javascript"></script>  
<script src="<?php echo BASE_URL; ?>assets/plugins/flot/jquery.flot.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/flot/jquery.flot.resize.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/flot/jquery.flot.pie.js"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/flot/jquery.flot.stack.js"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/flot/jquery.flot.crosshair.js"></script>

<script src="<?php echo BASE_URL; ?>assets/plugins/bootstrap-daterangepicker/date.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>     
<script src="<?php echo BASE_URL; ?>assets/plugins/gritter/js/jquery.gritter.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/fullcalendar/fullcalendar/fullcalendar.min.js" type="text/javascript"></script>
<!--<script src="<?php echo BASE_URL; ?>assets/plugins/jquery-easy-pie-chart/jquery.easy-pie-chart.js" type="text/javascript"></script>-->

<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="<?php echo BASE_URL; ?>assets/scripts/app.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/scripts/index.js" type="text/javascript"></script>  
<script src="<?php echo BASE_URL; ?>assets/scripts/charts.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/bootstrap-modal/js/bootstrap-modal.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL; ?>assets/plugins/bootstrap-modal/js/bootstrap-modalmanager.js" type="text/javascript" ></script>

<!-- END PAGE LEVEL SCRIPTS -->  

<script type="text/javascript" src="<?php echo BASE_URL; ?>js/lib/mustache.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/lib/underscorejs/underscore.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/lib/backbonejs/backbone.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/lib/modernizr/modernizr.js"></script>
<!--<script src="js/lib/uploader/jquery-ui-1.10.3.custom.min.js"></script>-->
<script src="js/lib/uploader/jquery.iframe-transport.js"></script>
<script src="js/lib/uploader/jquery.fileupload.js"></script>

<script type="text/javascript" src="<?php echo BASE_URL; ?>js/messages.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>templates/templates.js"></script>

<!-- Application -->
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Cloudwalkers.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Session.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Utils.js"></script>

<!-- Router -->
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Router/Router.js"></script>

<!-- Views -->
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Root.js"></script>   
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/WidgetContainer.js"></script> 

<!--<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/MessageContainer.js"></script>-->
<!--<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Channel.js"></script>-->
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Loading.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Header.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Dashboard.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Message.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/OutgoingMessage.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/OriginalMessage.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/ActionParameters.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Write.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Filter.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Comments.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Comment.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Users.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/User.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/UserDetails.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/AddUser.js"></script>

<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Widgets/Widget.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Widgets/MessageContainer.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Widgets/MessageList.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Widgets/DetailedList.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Widgets/DetailedView.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Widgets/Timeline.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Widgets/ScheduledList.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Widgets/ScheduledTable.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Widgets/DraftList.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Views/Widgets/HTMLWidget.js"></script>

<!-- Models -->
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Models/User.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Models/Account.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Models/Message.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Models/Comment.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Models/User.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Models/Stream.js"></script>

<!-- Collections -->
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Collections/Channel.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Collections/TypedMessages.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Collections/Scheduled.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Collections/Comments.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Collections/Drafts.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Collections/Users.js"></script>

<!-- Utilities -->
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Utilities/StreamLibrary.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL; ?>js/Utilities/Parser.js"></script>

<script>
	jQuery(document).ready(function() {    

		Cloudwalkers.RootView.on('content:change', function() {

            //App.unblockUI(pageContent);
            //pageContentBody.html(res);
            App.fixContentHeight(); // fix content height
            App.initUniform(); // initialize uniform elements
            App.handleScrollers ();

		});

		//Cloudwalkers.RootView.on('content:change', function() {

			//console.log ('update!');

			App.init(); // initlayout and core plugins
			Index.init();
		//	Index.initJQVMAP(); // init index page's custom scripts
		//	Index.initCalendar(); // init index page's custom scripts
		//	Index.initCharts(); // init index page's custom scripts
		//	Index.initChat();
		//	Index.initMiniCharts();
		//	Index.initDashboardDaterange();
		//	Index.initIntro();
		//	Charts.init();
		//	Charts.initCharts();
		//	Charts.initPieCharts();
		   
		   
		   
		   
		   /*	BUILD CHARTS
		    *	snippets from <?php echo BASE_URL; ?>assets/scripts/charts.js
		    */
			
			/*
			var data = [];
			var totalPoints = 250;
			
			// random data generator for plot charts
			function getRandomData() {
				if (data.length > 0) data = data.slice(1);
				// do a random walk
				while (data.length < totalPoints) {var prev = data.length > 0 ? data[data.length - 1] : 50;var y = prev + Math.random() * 10 - 5;if (y < 0) y = 0;if (y > 100) y = 100;data.push(y);}
				// zip the generated y values with the x values
				var res = [];
				for (var i = 0; i < data.length; ++i) res.push([i, data[i]]); return res;
			}
			
			var d1 = [];
			for (var i = 0; i <= 10; i += 1)d1.push([i, parseInt(Math.random() * 30)]);
			
			var d2 = [];
			for (var i = 0; i <= 10; i += 1)d2.push([i, parseInt(Math.random() * 30)]);
			
			var d3 = [];
			for (var i = 0; i <= 10; i += 1)d3.push([i, parseInt(Math.random() * 30)]);
			
			var stack = 0,
			bars = true,
			lines = false,
			steps = false;
			
			function plotWithOptions() {$.plot($("#chart_5"), [d1, d2, d3], {series: {stack: stack,lines: {show: lines,fill: true,steps: steps},bars: {show: bars,barWidth: 0.6}}});}
			
			$(".stackControls input").click(function (e) {e.preventDefault();stack = $(this).val() == "With stacking" ? true : null;plotWithOptions();});
			$(".graphControls input").click(function (e) {e.preventDefault();bars = $(this).val().indexOf("Bars") != -1;lines = $(this).val().indexOf("Lines") != -1;steps = $(this).val().indexOf("steps") != -1;plotWithOptions();});
			
			plotWithOptions();
			
			var data = [];
			var series = Math.floor(Math.random() * 10) + 1;
			series = series < 5 ? 5 : series;
			
			for (var i = 0; i < series; i++) {data[i] = {label: "Series" + (i + 1),data: Math.floor(Math.random() * 100) + 1}}
			
			// DONUT
			$.plot($("#donut"), data, {series: {pie: {innerRadius: 0.5,show: true}}});
			*/
		//});
	});




</script>