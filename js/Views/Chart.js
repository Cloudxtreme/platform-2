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
		var settings = {};
		settings.title = this.title;

		settings.main_span = "span8";
		settings.legend_span = "span4";

		this.$el.html (Mustache.render (Templates.chart, settings));
		this.canvas = this.$el.find("canvas").get(0).getContext("2d");
		
		
		// Select data & chart type
		//var data  = this.parse[this.chart]();
		//var chart = new Chart(this.canvas)[this.chart](data);
		
		return this;
	},
	
	'fill' : function (collection)

	{
		this.parse.collection = collection;
		//console.log(this.$el.find(".chart-container").get(0).clientWidth);
		//Span container width
		var width = this.$el.find(".chart-container").get(0).clientWidth
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

		if(this.filterfunc == 'besttime'){ //We are rendering multiple charts
			dis = this;
			$.each(data.datasets, function(key, value){
				var partialdata = {labels: data.labels, dataset: value};
				var chart = new Chart(dis.canvas)[dis.chart](partialdata);
			});
		}else{
			var chart = new Chart(this.canvas)[this.chart](data);
			var len = legend(this.$el.find(".chartlegend").get(0), data);
		}
	},

	parsecontacts : function(collection){

		var data = [];		
		var streams = collection.latest().get("streams");
		
		//REMOVE THIS LATER
		if(streams){
			streams.forEach(function(stream){
				var network = Cloudwalkers.Session.getStream(stream.id).get("network").token;
				var title = Cloudwalkers.Session.getStream(stream.id).get("network").name;
				var color = collection.networkcolors[network];
				if(!color) color = "#000"; //Fix this
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
					if(!added) data.push({value : counter, color : color, title: title});
				}			
			});

			data = _(data).sortBy(function(ntwk) {
			    return ntwk.value;
			});
		}
		
		return data;
	},

	parseage : function(collection){

		var colors = {'13-17': "#E5DAE0", '18-24': "#CDA1B0", '25-34': "#A35968", '35-44': "#9F0835", '45-54': "#7F7166", '55-64': "#4B3D3D", '65+': "#222222"};
		var data = [];

		var streams = collection.latest().get("streams");
		var grouped = this.groupkey(streams, "contacts", "age");

		$.each(grouped, function(key, value){
			data.push({value: value, title: key, color: colors[key]});
		});

		data = _(data).sortBy(function(age) {
			return age.title;
		});

		return data;
	},

	'groupkey' : function(collection, parents, key){
		
		var group= {};
		
		$.each(collection, function(k, v){
			var object = v[parents][key];
			if(_.isObject(object)){
				if(_.isEmpty(group)){
					group = object;
				}else{
					$.each(object, function(key, value){
						group[key] += value;
					});
				}
			}
		});
		return group;
	},

	parsegender : function(collection){

		var data = [];
		var colors = {'male': "#9AC8DF", 'female': "#F14B68", 'other': "#F1C03D"};

		var streams = collection.latest().get("streams");
		var grouped = this.groupkey(streams, "contacts", "gender");

		$.each(grouped, function(key, value){
			data.push({value: value, title: key, color: colors[key]});
		});

		return data;
	},

	// Size -> Int:: Show the n most important, group the others
	parseregional : function(collection){

		var colors = ["#F7464A", "#E2EAE9", "#D4CCC5", "#949FB1", "#4D5360"];
		
		var data = [], grouped = {}, counter = 0;
		var streams = collection.latest().get("streams");

		var size = 3;

		// Groups & sums by country
		$.each(streams, function(k, v){
			if(_.isObject(v["contacts"].geo)){
				var countries = v["contacts"].geo["countries"];
				if(_.size(grouped) == 0){
					$.each(countries, function(key, value){
						grouped[value.name] = value;
					});
				}else{
					$.each(countries, function(key, value){
						if(!grouped[value.name])	grouped[value.name] = value;
						else	grouped[value.name].total += value.total;
					});
				}
			}
		});

		// Sorts it
		grouped = _(grouped).sortBy(function(country) {
			return country.total;
		});

		if(!size)	size=grouped.length;	// We don't care about grouping

		// Gets n biggest values (or all of them)
		while(counter < size){
			var country = grouped.pop();
			data.push({title: country.name, value: country.total, color: colors[counter]});
			counter++;
		}

		if(grouped.length == 0) return data;

		// If we are grouping, calculate the "Others"
		var total = _.reduce(grouped, function(memo, num){ return memo + num.total;  }, 0);
		data.push({title: "Others", value: total, color: "#333333"});
			
		return data;
	},

	parsebesttime : function(collection){
		
		var streams, besttime, labels;
		var data = {datasets:[]};
		var datasets = {};
		var dis = this;

		collection.forEach(function(statistic){
			streams = statistic.get("streams");
			streams.forEach(function(stream){

				besttime = new Cloudwalkers.Models.Stream(stream).getbesttime();
					var title = Cloudwalkers.Session.getStream(stream.id).get("network").name;
					var network = Cloudwalkers.Session.getStream(stream.id).get("network").token;
					//console.log(stream.id, title);
				if(besttime){
					//console.log("hasbesttime");
					if(!datasets[title]){
						datasets[title] = {data : _.values(besttime), fillColor: collection.networkcolors[network]};
					}else{
						datasets[title] = dis.besttimesum(besttime, datasets[title]);
					}

					if(!data.labels)	data.labels = _.keys(besttime);
				}
			});
		});

		for(d in datasets){
			data.datasets.push(datasets[d]);
		};
		return data;
	},

	besttimesum : function(besttimes, dataset, title){

		for(i in besttimes){
			dataset.data[i] += besttimes[i];
		}

		return dataset;
	},

	'emptychartdata' : function (charttype){

		if(charttype == 'Doughnut' || charttype == 'Pie' || charttype == "PolarArea"){
			data = [{'value' : 1, 'color' : "#eeeeee", 'title' : "No data"}];
		} else {
			data = 	{ labels : [], datasets : [{title: "No data"}] };
		}
		return data;
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