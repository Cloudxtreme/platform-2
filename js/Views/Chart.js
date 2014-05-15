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
		"networks"	: "parsenetworks",
		"activity"	: "parsecalendar",

		//Demo old charts
		"evolution"	: "parseevolution",
		"messages"	: "parsemessages",
		"activities"	: "parseactivities",
		"impressions"	: "parseimpressions",

		"geo" : "parsegeo",

		"allreports" : "parseallreports"
	},
	'colors' : ["#E27927", "#B14B22", "#9E1818", "#850232", "#68114F", "#70285B", "#783E68", "#815574", "#896C80", "#91828D"],
	'countrycolors' : ["#E27927", "#E5822E", "#E88B35", "#EC953C", "#EF9E43", "#F2A74A", "#F5B051", "#F9BA58", "#FCC35F", "#FFCC66"],
	
	'initialize' : function (options)
	{
		if(options) $.extend(this, options);
		view = this;
		this.collection = this.model.statistics;	
	
		this.listenTo(this.collection, 'ready', this.fill);
	},

	'render' : function ()
	{	
		// Create view
		this.settings = {};
		this.settings.title = this.title;

		this.$el.html (Mustache.render (Templates.chart, this.settings));
	
		return this;
	},
	
	'fill' : function ()
	{ 	
		var data, chart, fulldata;
		var parsefunc = this.columns[this.filterfunc];

		fulldata = this[parsefunc](this.collection);

		if(this.filterfunc == 'besttime'){
			this.renderbesttime(fulldata);
		}else{

			var width = this.$el.find(".chart-container").get(0).clientWidth;
			var options = {
				'pieHole':0.4,
				'chartArea': {'width': '95%', 'height': '90%'},
	            'width': width,
	            'height': width * 0.7,
	            'legend':{textStyle:{fontSize:'13'}},
	            'tooltip':{textStyle:{fontSize:'13'}}
	        };

	        var geooptions = {
	        	displayMode: 'markers',
       			colorAxis: {colors: ['#E27927', '#91828D']} 
	        }

	        if(this.filterfunc == "geo")
	        	if(this.type == "dots")
	        		$.extend(options, geooptions);

	       
	        if(this.filterfunc == "evolution" || this.filterfunc == "allreports"){
	        	options = fulldata.options;
	        }
 			options.colors = fulldata.colors;

			fulldata.data = google.visualization.arrayToDataTable(fulldata.data);

			chart = new google.visualization[this.chart](this.$el.find('.chart-container').get(0));
	        chart.draw(fulldata.data, options);
	    }
	},

	'renderbesttime' : function(data){

		this.$el.html(Mustache.render (Templates.besttimewrap, this.settings));

		$.each(data, function(key, day){
			day.fill = day.value*100/data["maxvalue"];
			this.$el.find(".chart-wrapper").append(Mustache.render (Templates.besttime, day));
		}.bind(this));
	},

	parsecontacts : function(collection, statistic, token){
		
		var networks = {};
		var streams;
		var colors = [];
		var fulldata = {
			data : [], 
			colors : []
		};
		
		if(!statistic)	streams = collection.latest().get("streams");
		else			streams = statistic;
		
		$.each(streams, function(index, stream){
			var stream = new Cloudwalkers.Models.Stream(stream);
			var network = new Cloudwalkers.Models.Network(Cloudwalkers.Session.getStream(stream.id).get("network"));
			var numcontacts = stream.getcontacts();
			
			if(token && network.gettoken() != token)
				return true;

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

		if(!token && !statistic)
			fulldata.data.unshift(["Network", "Number of contacts"]);

		return fulldata;
	},

	//Demo onld charts
	parsemessages : function(collection, statistic, token){
		
		var networks = {};
		var streams;
		var colors = [];
		var fulldata = {
			data : [], 
			colors : []
		};
		
		if(!statistic)	streams = collection.latest().get("streams");
		else			streams = statistic;
		
		$.each(streams, function(index, stream){
			var stream = new Cloudwalkers.Models.Stream(stream);
			var network = new Cloudwalkers.Models.Network(Cloudwalkers.Session.getStream(stream.id).get("network"));
			var nummessages = stream.getmessages();
			
			if(token && network.gettoken() != token)
				return true;

			if(_.isNumber(nummessages) && _.has(networks, network.gettoken())){
				networks[network.gettoken()]["messages"] += nummessages;
			}				
			else{
				networks[network.gettoken()] = network;
				networks[network.gettoken()]["messages"] = nummessages;
			}
		});
		
		networks = _.sortBy(networks, function(network){
			return network.get("messages");
		});
		
		//Apply name & colors
		$.each(networks, function(index, network){
			fulldata.data.push([network.gettitle(), network.messages]);
			fulldata.colors.push(network.getcolor());
		});

		if(!token && !statistic)
			fulldata.data.unshift(["Network", "Number of contacts"]);

		return fulldata;
	},


	parseactivities : function(collection, statistic, token){
		
		var networks = {};
		var streams;
		var colors = [];
		var fulldata = {
			data : [], 
			colors : []
		};
		
		if(!statistic)	streams = collection.latest().get("streams");
		else			streams = statistic;
		
		$.each(streams, function(index, stream){
			var stream = new Cloudwalkers.Models.Stream(stream);
			var network = new Cloudwalkers.Models.Network(Cloudwalkers.Session.getStream(stream.id).get("network"));
			var numactivities = stream.getactivities();
			
			if(token && network.gettoken() != token)
				return true;

			if(_.isNumber(numactivities) && _.has(networks, network.gettoken())){
				networks[network.gettoken()]["activities"] += numactivities;
			}				
			else{
				networks[network.gettoken()] = network;
				networks[network.gettoken()]["activities"] = numactivities;
			}
		});
		
		networks = _.sortBy(networks, function(network){
			return network.get("activities");
		});
		
		//Apply name & colors
		$.each(networks, function(index, network){
			fulldata.data.push([network.gettitle(), network.activities]);
			fulldata.colors.push(network.getcolor());
		});

		if(!token && !statistic)
			fulldata.data.unshift(["Network", "Number of contacts"]);

		return fulldata;
	},

	parseimpressions : function(collection, statistic, token){
		
		var networks = {};
		var streams;
		var colors = [];
		var fulldata = {
			data : [], 
			colors : []
		};
		
		if(!statistic)	streams = collection.latest().get("streams");
		else			streams = statistic;
		
		$.each(streams, function(index, stream){
			var stream = new Cloudwalkers.Models.Stream(stream);
			var network = new Cloudwalkers.Models.Network(Cloudwalkers.Session.getStream(stream.id).get("network"));
			var numimpressions = stream.getimpressions();
			
			if(token && network.gettoken() != token)
				return true;

			if(_.isNumber(numimpressions) && _.has(networks, network.gettoken())){
				networks[network.gettoken()]["impressions"] += numimpressions;
			}				
			else{
				networks[network.gettoken()] = network;
				networks[network.gettoken()]["impressions"] = numimpressions;
			}
		});
		
		networks = _.sortBy(networks, function(network){
			return network.get("impressions");
		});
		
		//Apply name & colors
		$.each(networks, function(index, network){
			fulldata.data.push([network.gettitle(), network.impressions]);
			fulldata.colors.push(network.getcolor());
		});

		if(!token && !statistic)
			fulldata.data.unshift(["Network", "Number of contacts"]);
		//console.log(fulldata);
		return fulldata;
	},

	parseage : function(collection){

		var colors = ["#2bbedc", "#2CA7C0", "#2E90A4", "#2F7988", "#30616B", "#324A4F", "#333333"];
		var data = [];
		var streams = collection.latest().get("streams");
		var grouped = this.groupkey(streams, "contacts", "age");
		var fulldata = [];

		$.each(grouped, function(key, value){
			data.push([key, value]);
		});

		data = _.sortBy(data, function(age) {
			return age.title;
		});

		fulldata.data = data;
		fulldata.colors = colors;
		fulldata.data.unshift(["Age interval", "Number of contacts"]);

		return fulldata;
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

		var colors = ["#2bbedc", "#F14B68", collection.networkcolors["others"]];
		var data = [];
		var fulldata = [];

		var streams = collection.latest().get("streams");
		var grouped = this.groupkey(streams, "contacts", "gender");

		$.each(grouped, function(key, value){
			data.push([this.capitalize(key), value]);
		}.bind(this));
		
		fulldata.data = data;
		fulldata.colors = colors;

		fulldata.data.unshift(["Gender", "Number of contacts"]);

		return fulldata;
	},

	'capitalize' : function(string){

		return string.charAt(0).toUpperCase() + string.slice(1);
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
					$.each(countries, function(key, country){
						grouped[country.name] = country;
						grouped[country.name]["networks"] = [];
						grouped[country.name]["networks"][network] = {total: country.total, token: token};
					});
				}else{
					$.each(countries, function(key, country){		//Is not empty
						if(!grouped[country.name]){				//Country doesnt exit there, shove it inside
							grouped[country.name] = country;			
							grouped[country.name]["networks"] = [];
							grouped[country.name]["networks"][network] = {total: country.total, token: token};
						}else{					
							grouped[country.name].total += country.total;
							if(grouped[country.name]["networks"][network])
								grouped[country.name]["networks"][network].total += country.total;
							else
								grouped[country.name]["networks"][network] = {total: country.total, token: token};
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

		var colors = this.colors;
		var data = [];
		var fulldata = [];
		var size = 8; //hardcoded?
		var counter = 0;
		var grouped = this.filtercountry(collection);
		fulldata.data = [];
		fulldata.colors = colors;
		this.regional = [];
		
		// We don't care about grouping "others"
		if(!size)	size=grouped.length;

		// Gets n biggest values (or all of them)
		while(counter < size){
			var country = grouped.pop();
			fulldata.data.push([country.name, country.total]);
			this.regional.push(country);
			counter++;
		}
		
		fulldata.data.unshift(["Countries", "Number of contacts"]);

		// If we are grouping, calculate the "Others"
		var total = _.reduce(grouped, function(memo, num){
			return memo + num.total;  
		}, 0);

		fulldata.data.push(["Others", total]);
		
		return fulldata;
	},

	parsecities : function(collection){

		var cities, size = 6;
		var countries = this.connect.regional;
		var fulldata;
		var cities = {};

		//In case something goes wrong
		if(!countries)	countries = parseregional(collection);
		
		countrycities = countries[0].cities;
		
		$.each(countrycities, function(index, city){
			cities[city.name] = {name: city.name, value: city.total};
		});
		
		//Sort the cities
		cities = _(cities).sortBy(function(city) {
			console.log(city);
			return city.value;
		});
		
		fulldata = this.getbiggestdata(cities,size);
		fulldata.data.unshift(["Cities", "Number of contacts"]);

		return fulldata;
	},

	parsenetworks : function(collection){

		var data = [];
		var countries = this.connect.regional;
		var fulldata = {
			data : [], 
			colors : []
		};
		
		//In case something goes wrong
		if(!countries)	countries = parseregional(collection);
		
		//Replace title
		this.$el.find("h3").html(countries[0].name);

		//Networks of the country with most poppularity
		var networks = countries[0].networks;
		
		for(i in networks){
			fulldata.data.push([i, networks[i].total]);
			fulldata.colors.push(collection.networkcolors[networks[i].token]);
		}
		
		//Columns
		fulldata.data.unshift(["Network", "Number of contacts"]);

		return fulldata;
	},


	//Gets sorted data & returns the last N and groups the others
	getbiggestdata : function(datasets, n){

		var counter = 0;
		var fulldata = {
			data : [],
			colors : []
		};

		while(counter < n){
			var dataset = datasets.pop();
			fulldata.data.push([dataset.name, dataset.value]);
			fulldata.colors.push(this.countrycolors[counter]);
			counter++;
		}

		if(datasets.length == 0)	return fulldata;

		// If we are grouping, calculate the "Others"
		var total = _.reduce(datasets, function(memo, num){
			return memo + num.value;  
		}, 0);

		fulldata.data.push(["Others", total]);
		fulldata.colors.push(this.collection.networkcolors["others"]);
		
		return fulldata;
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

	///////////////////////
	//Old charts demo stuff
	'parseevolution' : function(collection, type){
		
		var func = type ? this.columns[type] : this.columns[this.type];
		var length = this.collection.length;
		var network = this.network ? this.network : null;
		var streams;
		var legend = ["Day of the week"];
		var data = {};
		var width = this.$el.find(".chart-container").get(0).clientWidth;
		var fulldata = {
			data : [],
			colors : [],
			options : {
				'chartArea': {'width': '90%', 'height': '70%'},
		        'width': width,
		        'height': width * 0.7,
		        'legend':{textStyle:{fontSize:'13'}},
		        'tooltip':{textStyle:{fontSize:'13'}},
		        'curveType': 'function',
	    		'legend': { position: 'bottom'}
				}
			};
			
		for (var i = 0; i < length; i++){
			streams = collection.place(i).get("streams");
			dailyresult = this[func](null, streams, network);
			
			_.map(dailyresult.data, function(token){
				if(!data[token[0]])
					data[token[0]] = [token[1]];
				else
					data[token[0]].push(token[1])
			});

			if(fulldata.colors.length == 0)	fulldata.colors = dailyresult.colors;
		}

		for(var i=0; i<length; i++){
			var line = [i];
			for(d in data){
				line.push(data[d].shift());
			}
			fulldata.data.push(line);
		}

		for(d in data){
			legend.push(d);
		}
		fulldata.data.unshift(legend);
		
		return fulldata;

	},

	'parseallreports' : function(collection){

		var contacts = this.parseevolution(collection, "contacts").data;
		var messages = this.parseevolution(collection, "messages").data;
		var activities = this.parseevolution(collection, "activities").data;
		var impressions = this.parseevolution(collection, "impressions").data;
		var width = this.$el.find(".chart-container").get(0).clientWidth;
		var fulldata = {
			data : [],
			colors : ["#E27927", "#9E1818", "#68114F", "#783E68", "#896C80"],
			options : {
				'chartArea': {'width': '90%', 'height': '90%'},
		        'width': width,
		        'height': width * 0.7,
		        'legend':{textStyle:{fontSize:'13'}},
		        'tooltip':{textStyle:{fontSize:'13'}},
		        'curveType': 'function',
	    		'legend': { position: 'bottom'}
				}
		};

		contacts.shift();
		messages.shift();
		activities.shift();
		impressions.shift();

		$.each(contacts, function(index, value){
			contacts[index].push(messages[index][1]);
			contacts[index].push(activities[index][1]);
			contacts[index].push(impressions[index][1]);
		});

		fulldata.data = contacts;

		fulldata.data.unshift(["Day of the week", "Contacts", "Messages", "Activities", "Impressions"]);
		
		return fulldata;
	},

	'parsegeo' : function(collection)
	{
		var fulldata = this.parseregional(collection);
		console.log(fulldata.data);
		return fulldata;
	},

	/*'parsecalendar' : function(){
		
		var statistics = this.collection;	
		var fulldata = [];
		var data = [];
		var max = 0, min = 0, day, timestamp, date = 0, msgpivot = 0;

		while(statistics.size() > 0){
			var statistic = statistics.shift();
			var messages = statistic.pluck("messages");
			
			timestamp = new Date(statistic.get("date"));
			data.push([timestamp, messages >= msgpivot ? messages - msgpivot : 0]);
			msgpivot = messages;

			//Get starting statistics date
			if(date == 0)	date = statistic.get("date");
		}
		
		var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: 'date', id: 'Date' });
        dataTable.addColumn({ type: 'number', id: 'Messages' });
        dataTable.addRows(data);	
       
       fulldata.data = dataTable;	

		return fulldata;
	},

	
	'emptychartdata' : function (charttype){

		if(charttype == 'Doughnut' || charttype == 'Pie' || charttype == "PolarArea"){
			data = [{'value' : 1, 'color' : "#eeeeee", 'title' : "No data"}];
		} else {
			data = 	{ labels : [], datasets : [{title: "No data"}] };
		}
		return data;
	},*/
	
	'negotiateFunctionalities' : function()
	{
		
		
	}
	

});