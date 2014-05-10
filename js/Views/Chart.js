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
		view = this;
		this.collection = this.model.statistics;	
	
		this.listenTo(this.collection, 'ready', this.loadcharts());

	},

	'render' : function ()
	{	
		// Create view
		this.settings = {};
		this.settings.title = this.title;

		this.$el.html (Mustache.render (Templates.chart, this.settings));
	
		return this;
	},

	'loadcharts' : function(){
	
		google.load('visualization', '1',  {'callback':this.fill, 'packages':['corechart']});

	},
	
	'fill' : function ()
	{
		//Span container width
		var width = this.$(".chart-container").get(0).clientWidth;

		var options = {
			'pieHole':0.4,
			'chartArea': {'width': '100%', 'height': '90%'},
            'width': width,
            'height': width * 0.6
        };
        
		fulldata = this.view.parsecontacts(this.view.collection);
		options.colors = fulldata.colors;

		var data = google.visualization.arrayToDataTable(fulldata.data);
		var chart = new google.visualization.PieChart(this.$('.chart-container').get(0));
        chart.draw(data, options);
	},

	parsecontacts : function(collection){
		
		var networks = {};		
		var streams = collection.latest().get("streams");
		var colors = [];
		var fulldata = {
			data : [], 
			colors : []
		};
		
		streams.forEach(function(stream){
			var stream = new Cloudwalkers.Models.Stream(stream);
			var network = new Cloudwalkers.Models.Network(Cloudwalkers.Session.getStream(stream.id).get("network"));
			var numcontacts = stream.getcontacts();

			if(_.isNumber(numcontacts) && _.has(networks, network.gettoken()))
				networks[network.gettoken()].addcontacts(numcontacts);
			else
				networks[network.gettoken()] = network.addcontacts(numcontacts);
		});
		
		networks = _.sortBy(networks, function(network){
			return network.get("contacts");
		});
		
		//Apply name & colors
		$.each(networks, function(index, network){
			fulldata.data.push([network.gettitle(), network.getcontacts()]);
			fulldata.colors.push(network.getcolor());
		});

		//Columns (necessary)
		fulldata.data.unshift(["Network", "Number of contacts"]);

		return fulldata;
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
		var colors = {'male': "#2bbedc", 'female': "#F14B68", 'other': collection.networkcolors["others"]};

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
			data.push({
				title: country.name, 
				value: country.total, 
				cities: country.cities, 
				networks: country.networks, 
				color: this.colors[counter]
			});
			counter++;
		}

		if(grouped.length == 0) 
			return data;

		// If we are grouping, calculate the "Others"
		var total = _.reduce(grouped, function(memo, num){
			return memo + num.total;  
		}, 0);

		data.push({title: "Others", value: total, color: collection.networkcolors["others"]});
		
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

		if(datasets.length == 0)	return data;

		// If we are grouping, calculate the "Others"
		var total = _.reduce(datasets, function(memo, num){
			return memo + num.value;  
		}, 0);

		data.push({title: "Others", value: total, color: this.collection.networkcolors["others"]});
		
		return data;
	},

	parsebesttime : function(collection){
		
		var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		var besttime,
			data = [],
			maxvalue = 0,
		 	dailyvalue = 0,
		 	fill,
		 	max;

		collection.forEach(function(statistic){
			var streams = statistic.get("streams");
			var daily 	= [];
			streams.forEach(function(stream){
				stream 	= new Cloudwalkers.Models.Stream(stream);
				besttime = stream.getbesttime();

				if(besttime){
					if(daily.length == 0){
						daily = _.values(besttime);
					}else{
						for(i in besttime){
							daily[i] += besttime[i];

							//Keep track of the highest week & daily value
							if(daily[i]>maxvalue)	maxvalue=daily[i];
							if(daily[i]>dailyvalue)	dailyvalue=daily[i];
						}
					}
				}
			});

			time = daily.indexOf(Math.max.apply(Math,_.values(daily)));
			data.push({day: days.shift(), value: dailyvalue, time: time});

			dailyvalue = 0;
		});

		data["maxvalue"] = maxvalue;

		return data;
	},

	'emptychartdata' : function (charttype){

		if(charttype == 'Doughnut' || charttype == 'Pie' || charttype == "PolarArea"){
			data = [{'value' : 1, 'color' : "#eeeeee", 'title' : "No data"}];
		} else {
			data = 	{ labels : [], datasets : [{title: "No data"}] };
		}
		return data;
	},
	
	'negotiateFunctionalities' : function()
	{
		
		
	}
	

});