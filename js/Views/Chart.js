Cloudwalkers.Views.Widgets.Chart = Backbone.View.extend({
	
	'title' : "Chart",
	'events' : 
	{
		/*'remove' : 'destroy',
		'click *[data-action]' : 'action',
		'click [data-notifications]' : 'loadNotifications',
		'click [data-youtube]' : 'loadYoutube',
		'click' : 'toggle'*/
	},
	'columns' :  {
		"contacts" : "parsecontacts",
		"age" : "parseage",
		"gender" : "parsegender",
		"regional" : "parseregional",
		"besttime" : "parsebesttime"
	},
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);

		this.collection = this.model.statistics;
		this.listenTo(this.collection, 'ready', this.fill);

	},

	'render' : function ()
	{	
		// Create view
		this.$el.html (Mustache.render (Templates.chart, {title: this.title}));
		this.canvas = this.$el.find("canvas").get(0).getContext("2d");
		
		// Select data & chart type
		//var data  = this.parse[this.chart]();
		//var chart = new Chart(this.canvas)[this.chart](data);
		
		return this;
	},

	'emptychartdata' : function (charttype){

		if(charttype == 'Doughnut' || charttype == 'Pie' || charttype == "PolarArea"){
			data = [{'value' : 1, 'color' : "#eeeeee"}];
		} 
		return data;
	},
	
	'fill' : function (collection)

	{
		this.parse.collection = collection;

		//Span container width
		var width = this.el.clientWidth;
		//Resize canvas to the correct size
		this.canvas.canvas.style.width = width + "px";
		this.canvas.canvas.style.height = width + "px";
		this.canvas.canvas.width = width;
		this.canvas.canvas.height = width;

		// Select data & chart type
		var temp = this.columns[this.filterfunc];
		var data = this[temp](collection);

		//Create empty chart
		if(data.length == 0){
			data = this.emptychartdata(this.chart);
		}

		//var data  = this.parse[this.chart](this.model, this.filterfunc)
		var chart = new Chart(this.canvas)[this.chart](data);
	},

	parsecontacts : function(collection){

		var data = [];		
		var streams = collection.latest().get("streams");
		
		//REMOVE THIS LATER
		if(streams){
			streams.forEach(function(stream){
				var network = Cloudwalkers.Session.getStream(stream.id).get("network").token;
				var color = collection.networkcolors[network];
				var counter, added = false;

				//Object/int: structure
				if(_.isNumber(stream["contacts"].total))	counter = Number(stream["contacts"].total);
				else if(_.isNumber(stream[key]))	counter = Number(stream["contacts"]);

				if(_.isNumber(counter)){
					data.map(function(obj, index) {
					    if(obj.color == color) {
					       	obj.value += counter;
					       	added = true;
					    }
					});
					if(!added) data.push({value : counter, color : color});
				}			
			});

			data = _(data).sortBy(function(ntwk) {
			    return ntwk.value;
			});
		}
		
		return data;
	},

	parseage : function(collection){

		/*var centerX = 200;
      	var centerY = 200
      	var radius = 100;

      	this.canvas.beginPath();
      	this.canvas.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      	this.canvas.fillStyle = 'green';
      	this.canvas.fill();
      	this.canvas.lineWidth = 5;
      	this.canvas.strokeStyle = '#003300';
      	this.canvas.stroke();*/

		return [];
	},

	parsegender : function(collection){

		var data = [];		
		var genders = {'male': 0, 'female': 0, 'other': 0}
		var colors = {'male': "#000000", 'female': "#333333", 'other': "#999999"};

		var streams = collection.latest().get("streams");

		//Remove this later
		if(streams){
			streams.forEach(function(stream){
				if(_.isObject(stream["contacts"])){
					var contact = new Cloudwalkers.Models.Contact(stream["contacts"]);
					if(males = contact.getMales()){ //Check if there is actual gender data
						genders.male += males;
						genders.female += contact.getFemales();
						genders.other += contact.getOthers();
					}
				}
			});
			
			for(var i in genders){
				data.push({value : genders[i], color : colors[i]});
			}
		}

		return data;
	},

	parseregional : function(collection){
		return [];
	},

	parsebesttime : function(collection){
		return [];
	},
	
	'parse' : {
		PolarArea : function ()
		{
			// Placeholder data
			if(!model)
				return [{value :50, color: "#ffffff"}, {value :100, color: "#f9f9f9"}];
			
			else return this.collection[func]();
		},
		
		Doughnut : function (model, func)
		{
			
			// Placeholder data
			if(!model)
				return [{value :50, color: "#f7f7f7"}, {value :50, color: "#fafafa"}];
			
			var stat = this.collection.latest();
			
			return stat[func]();
			
			return [
				{
					value: 30,
					color:"#F7464A"
				},
				{
					value : 50,
					color : "#E2EAE9"
				},
				{
					value : 100,
					color : "#D4CCC5"
				},
				{
					value : 40,
					color : "#949FB1"
				},
				{
					value : 120,
					color : "#4D5360"
				}
			]
		},
		
		Line : function (model)
		{
			// Placeholder data
			if(!model)
				return {labels : ["",""], datasets : [{fillColor : "rgba(220,220,220, .1)", pointStrokeColor : "#fff", data : [1,100]}]};
			
			return {
				labels : ["January","February","March","April","May","June","July"],
				datasets : [
					{
						fillColor : "rgba(220,220,220,0.5)",
						strokeColor : "rgba(220,220,220,1)",
						pointColor : "rgba(220,220,220,1)",
						pointStrokeColor : "#fff",
						data : [65,59,90,81,56,55,40]
					},
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,1)",
						pointColor : "rgba(151,187,205,1)",
						pointStrokeColor : "#fff",
						data : [28,48,40,19,96,27,100]
					}
				]
			}
		}
	},
	
	'negotiateFunctionalities' : function()
	{
		
		
	}
	

});