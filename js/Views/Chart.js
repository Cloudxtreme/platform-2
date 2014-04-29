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
		"contacts" 	: "parsecontacts",
		"age" 		: "parseage",
		"gender" 	: "parsegender",
		"regional" 	: "parseregional",
		"besttime" 	: "parsebesttime",
		"cities"	: "parsecities",
		"networks"	: "parsenetworks"
	},
	'colors' : ["#E27927", "#B14B22", "#9E1818", "#850232", "#68114F", "#70285B", "#783E68", "#815574", "#896C80", "#91828D"],
	'countrycolors' : ["#E27927", "#E5822E", "#E88B35", "#EC953C", "#EF9E43", "#F2A74A", "#F5B051", "#F9BA58", "#FCC35F", "#FFCC66"],
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);

		this.collection = this.model.statistics;
		this.listenTo(this.collection, 'ready', this.fill);

	},

	'render' : function ()
	{	
		// Create view
		this.settings = {};
		this.settings.title = this.title;

		//Force side by side legend & chart view
		this.settings.main_span = "span7";
		this.settings.legend_span = "span5";

		this.$el.html (Mustache.render (Templates.chart, this.settings));
		this.canvas = this.$el.find("canvas").get(0).getContext("2d");
		
		
		// Select data & chart type
		//var data  = this.parse[this.chart]();
		//var chart = new Chart(this.canvas)[this.chart](data);
		
		return this;
	},
	
	'fill' : function (collection)

	{
		var dis = this;

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
			dis.$el.html(Mustache.render (Templates.besttimewrap, this.settings));
			$.each(data, function(key, value){

				var max = value.indexOf(Math.max.apply(Math,_.values(value)));
				var maxval = Math.max.apply(Math,_.values(value));
				var fill = maxval * 100 / dis.maxvalue;
				console.log(dis.maxvalue);
				//console.log(Math.max.apply(Math,_.values(value)));
				dis.$el.find(".chart-wrapper").append(Mustache.render (Templates.besttime, {max: max, fill: fill}));
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

		var colors = {'13-17': "#2bbedc", '18-24': "#2CA7C0", '25-34': "#2E90A4", '35-44': "#2F7988", '45-54': "#30616B", '55-64': "#324A4F", '65+': "#333333"};
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
		var colors = {'male': "#2bbedc", 'female': "#F14B68", 'other': "#999999"};

		var streams = collection.latest().get("streams");
		var grouped = this.groupkey(streams, "contacts", "gender");

		$.each(grouped, function(key, value){
			data.push({value: value, title: key, color: colors[key]});
		});

		return data;
	},

	filtercountry : function(collection){

		var grouped = {};
		var streams = collection.latest().get("streams");

		// Groups & sums by country
		$.each(streams, function(k, stream){
			var network = Cloudwalkers.Session.getStream(stream.id).get("network").name;
			var token = Cloudwalkers.Session.getStream(stream.id).get("network").token;
			
			if(_.isObject(stream["contacts"].geo)){
				var countries = stream["contacts"].geo["countries"];
				if(_.size(grouped) == 0){						//is empty, shove the countries inside
					$.each(countries, function(key, value){
						grouped[value.name] = value;
						grouped[value.name]["networks"] = [];
						grouped[value.name]["networks"][network] = {total: value.total, token: token};
					});
				}else{
					$.each(countries, function(key, value){		//Is not empty
						if(!grouped[value.name]){				//Country doesnt exit there, shove it inside
							grouped[value.name] = value;			
							grouped[value.name]["networks"] = [];
							grouped[value.name]["networks"][network] = {total: value.total, token: token};
						}else{					
							grouped[value.name].total += value.total;
							if(grouped[value.name]["networks"][network])
								grouped[value.name]["networks"][network].total += value.total;
							else
								grouped[value.name]["networks"][network] = {total: value.total, token: token};
						}	
					});
				}
			}
		});

		// Sorts it
		grouped = _(grouped).sortBy(function(country) {
			return country.total;
		});

		return grouped;
	},

	// Size -> Int:: Show the n most important, group the others
	parseregional : function(collection){

		var data = [], counter = 0;
		var size = 8;

		var grouped = this.filtercountry(collection);
		
		// We don't care about grouping
		if(!size)
			size=grouped.length;

		// Gets n biggest values (or all of them)
		while(counter < size){
			var country = grouped.pop();
			data.push({title: country.name, value: country.total, cities: country.cities, networks: country.networks, color: this.colors[counter]});
			counter++;
		}

		if(grouped.length == 0) 
			return data;

		// If we are grouping, calculate the "Others"
		var total = _.reduce(grouped, function(memo, num){
			return memo + num.total;  
		}, 0);

		data.push({title: "Others", value: total, color: "#999999"});
		
		//Recycle the country data
		this.regional = data;

		return data;
	},

	parsecities : function(collection){

		var cities, size = 8;
		var countries = this.connect.regional;

		//In case something goes wrong
		if(!countries)	countries = parseregional(collection);
		
		cities = countries[0].cities;

		$.each(cities, function(key, value){
			cities[key] = {name: key, value: value};
		});

		//Sort the cities
		cities = _(cities).sortBy(function(city) {
			return city.value;
		});

		return this.getbiggestdata(cities,size);
	},

	parsenetworks : function(collection){

		var data = [];
		var countries = this.connect.regional;

		//In case something goes wrong
		if(!countries)	countries = parseregional(collection);

		//Replace title
		this.$el.find("h3").html(countries[0].title);

		//Networks of the country with most poppularity
		var networks = countries[0].networks;
		
		for(i in networks){
			data.push({value: networks[i].total, title: i, color: collection.networkcolors[networks[i].token]});
		}

		return data;
	},


	//Gets sorted data & returns the last N and groups the others
	getbiggestdata : function(datasets, n){

		var counter = 0, data = [];

		while(counter < n){
			var dataset = datasets.pop();
			data.push({title: dataset.name, value: dataset.value, color: this.countrycolors[counter]});
			counter++;
		}

		if(datasets.length == 0) 
			return data;

		// If we are grouping, calculate the "Others"
		var total = _.reduce(datasets, function(memo, num){
			return memo + num.value;  
		}, 0);

		data.push({title: "Others", value: total, color: "#999999"});
		
		return data;
	},

	parsebesttime : function(collection){
		
		var streams, besttime, labels, daily;
		var data = [];
		var datasets = {};
		var dis = this;
		var maxvalue = 0;

		collection.forEach(function(statistic){
			streams = statistic.get("streams");
			daily = [];
			streams.forEach(function(stream){
				besttime = new Cloudwalkers.Models.Stream(stream).getbesttime();
					var title = Cloudwalkers.Session.getStream(stream.id).get("network").name;
					var network = Cloudwalkers.Session.getStream(stream.id).get("network").token;
				if(besttime){
					if(daily.length == 0){
						daily=_.values(besttime);
					}else{
						for(i in besttime){
							daily[i] += besttime[i];
							if(daily[i]>maxvalue)	maxvalue=daily[i];
						}
					}
					/*if(!datasets[title]){
						datasets[title] = {data : _.values(besttime), fillColor: collection.networkcolors[network]};
					}else{
						datasets[title] = dis.besttimesum(besttime, datasets[title]);
					}

					if(!data.labels)	data.labels = _.keys(besttime);*/

				}
			});
			//Add to day
			data.push(daily);
		});

		this.maxvalue = maxvalue;

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