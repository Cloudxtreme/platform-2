define(
	['Views/Pages/Statistics'],
	function (Statistics)
	{
		var StatStream = Statistics.extend({
			
			widgets : [

				//* Network context widgets **
				{widget: "StatSummary", data: {columnviews: ["contacts-network", "score-trending-network", "outgoing-network", "besttime"]}, span: 12},

				{widget: "TitleSeparator", data: {title: "Contacts Info"}},
				{widget: "Chart", data: {filterfunc: "contact-evolution-network", chart: "LineChart", title: "Contacts evolution"}, span : [12,4,6,6]},
			
				//Network specific charts
				{widget: "Chart", data: {filterfunc: "age", chart: "PieChart", title: "By Age"}, span : [12,4,3,3], networks: ['facebook']},
				{widget: "Chart", data: {filterfunc: "gender", chart: "PieChart", title: "By gender"}, span : [12,4,3,3], networks: ['facebook']},
				{widget: "Chart", data: {filterfunc: "follow", chart: "PieChart", title: "By Type"}, span : [12,4,3,3], networks: ['twitter', 'linkedin', 'youtube']},

				{widget: "clear"},

				{widget: "Info", data: {title: "New impressions", filterfunc: "page-views-network"}, span: [12,6,3,3], nonetworks: ['twitter']},
		        {widget: "Info", data: {title: "New shares", filterfunc: "shares"}, span: [12,6,3,3], nonetworks: ['twitter']},
		        {widget: "Info", data: {title: "New posts", filterfunc: "posts"}, span: [12,6,3,3], nonetworks: ['twitter']},
		        {widget: "Info", data: {title: "New direct messages", filterfunc: "dms"}, span: [12,6,3,3], nonetworks: ['twitter']},

		        // Twitter only
		        {widget: "Info", data: {title: "New shares", filterfunc: "shares"}, span: [12,4,4,4], networks: ['twitter']},
		        {widget: "Info", data: {title: "New posts", filterfunc: "posts"}, span: [12,4,4,4], networks: ['twitter']},
		        {widget: "Info", data: {title: "New direct messages", filterfunc: "dms"}, span: [12,4,4,4], networks: ['twitter']},


				{widget: "TitleSeparator", data: {title: "Messages info"}},
				{widget: "TrendingMessage", data: {title: "Most popular message"}, span: 12},
				{widget: "BestTimeToPost", data: {filterfunc: "besttime", chart: "LineChart", title: "Best Time to Post"}, span: [12,6,6,4]},
				{widget: "Chart", data: {filterfunc: "message-evolution-network", chart: "LineChart", title: "Messages Evolution"}, span : [12,6,6,4]},
				{widget: "HeatCalendar", data: {filterfunc: "activity", title: "Activity Calendar"}, span: [12,6,6,4]},

				{widget: "TitleSeparator", data: {title: "Geo Graphics"}, networks : ['facebook']},
				{widget: "Chart", data: {filterfunc: "geo", type: "dots", chart: "GeoChart", title: "Countries", connect : true}, networks : ['facebook'], span: 8},
				{widget: "CompoundChart", span: [12,12,4,4], data : { template: "2row", chartdata: [ 
					{widget: "Chart", data: {filterfunc: "regional", chart: "PieChart", title: "Countries"}, connect: 'regional'},
					{widget: "Chart", data: {filterfunc: "cities", chart: "PieChart", title: "Cities"}}
					]}, networks : ['facebook']
				},
			],
			
			/**
			 *	Stream Data
			 *	Add streamlevel data to widget object
			 */
			streamdata: function (widget)
			{	
				// network token
				var network = Cloudwalkers.Session.getStream (Number(this.streamid)).get ("network").token;
				var data = {};	
				
				// If it's not on the newtork list, move on
				if(widget.networks)
					if(widget.networks.indexOf(network) < 0)
						return false;

				// If its on the NO newtork list, move on
		        if(widget.nonetworks)
		            if(widget.nonetworks.indexOf(network) >= 0)
		                return false;


				data.network = this.streamid;

				return _.extend (widget.data, data);
			}
		});

		return StatStream;
	}
);