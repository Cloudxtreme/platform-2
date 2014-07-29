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
		"contact-evolution"	: "parsecontactevolution",
		"message-evolution"	: "parsemessageevolution",
		"messages"	: "parsemessages",
		"activities"	: "parseactivities",
		"impressions"	: "parseimpressions",
		"notifications"	: "parsenotifications",
		"followers"	: "parsefollowers",
		"following"	: "parsefollowing",
		"follow"	: "parsefollow",

		"contact-evolution-network"	: "parsecontactevolutionnetwork",
		"message-evolution-network"	: "parsemessageevolutionnetwork",

		"geo" : "parsegeo",

		"allreports" : "parseallreports",

		"nodata" : "emptychartdata"
	},
	'colors' : ["#E27927", "#B14B22", "#9E1818", "#850232", "#68114F", "#70285B", "#783E68", "#815574", "#896C80", "#91828D"],
	'countrycolors' : ["#E27927", "#E5822E", "#E88B35", "#EC953C", "#EF9E43", "#F2A74A", "#F5B051", "#F9BA58", "#FCC35F", "#FFCC66"],
	'networkcolors' : {'facebook': "#3B5998", 'twitter': "#01a9da", 'linkedin': "#1783BC", 'tumblr': "#385775", 'google-plus': "#DD4C39", 'youtube': "#CC181E", 'web': "#f39501", 'blog': "#f39501", 'mobile-phone': "#E2EAE9", 'others':"#E5E5E5"},

	'networktokens' : {
		'Facebook':'#3B5998', 
		'Twitter':'#01a9da', 
		'LinkedIn':'#1783BC', 
		'GooglePlus':'#DD4C39', 
		'YouTube':'#CC181E', 
		'Internal':'#E2EAE9', 
		'Others':'#E5E5E5',
		'CoworkerWall':"#CCCCCC"
	},
	
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
		if(!this.collection.latest() || !this.collection.latest().get('streams'))	return;
		
		var data, chart, fulldata;
		var parsefunc = this.columns[this.filterfunc];
		var chartcontainer = '.chart-container';
		
		fulldata = this[parsefunc](this.collection);
		
		if(this.filterfunc == 'besttime'){
			this.renderbesttime(fulldata);
			
		}else{
			
			var width = this.$el.find(chartcontainer).get(0).clientWidth;
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

	       $.extend(options, fulldata.options);
	        
			fulldata.data = google.visualization.arrayToDataTable(fulldata.data);
			
			chart = new google.visualization[this.chart](this.$el.find(chartcontainer).get(0));
	        chart.draw(fulldata.data, options);
	    }
	},

	'removeloading' : function()
	{
		this.$el.find('.loading').removeClass('loading');
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
			colors : [],
			options : {}
		};
		
		if(!statistic)	streams = this.collection.latest().get("streams");
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

		if(fulldata.data.length == 0)
			return this.emptychartdata();

		fulldata.options.colors = fulldata.colors;
		
		if(!token && !statistic)
			fulldata.data.unshift(["Network", "Number of contacts"]);
		
		return fulldata;
	},

	//Demo old charts
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

	'parsecontactevolution' : function(collection){

		return this.parseevolution(collection, "contacts");
	},

	'parsecontactevolutionnetwork' : function(collection){

		var statistics = collection.models;
		var network = this.network;

		var width = this.$el.find('.chart-container').get(0).clientWidth;
		var fulldata = {
			data : [],
			options : {
				colors : ["#333333"],
				chartArea: {'width': '70%', 'height': '70%', 'left' : '40'},
	            width: width,
	            height: width * 0.3,
	            curveType: 'function'
			}
		};

		$.each(statistics, function(index, statistic){
			
			var day = moment(statistic.get("date")).format("D MMM");
			var number = statistic.pluck("contacts", network);
			fulldata.data.push([day, number]);

		}.bind(this));
		
		fulldata.data.unshift(["Day", "Number of contacts"]);
		
		return fulldata;
	},

	'parsemessageevolution' : function(collection){

		var statistics = collection.models;

		var width = this.$el.find('.chart-container').get(0).clientWidth;
		var fulldata = {
			data : [],
			options : {
				colors : ["#333333"],
				chartArea: {'width': '90%', 'height': '70%', 'left' : '40'},
	            width: width,
	            height: width > 350? 350: width * 0.92,
	           	'legend': { position: 'bottom', textStyle: {fontSize: '13'}},
	            curveType: 'function',
	            hAxis: {textStyle: {fontSize: '10'}}
			}
		};

		$.each(statistics, function(index, statistic){
			
			var day = moment(statistic.get("date")).format("D MMM");
			var number = statistic.pluck("messages");
			fulldata.data.push([day, number]);

		}.bind(this));
		
		fulldata.data.unshift(["Day", "Number of messages"]);
		
		return fulldata;
	},

	'parsemessageevolutionnetwork' : function(collection){

		var statistics = collection.models;
		var network = this.network;

		var width = this.$el.find('.chart-container').get(0).clientWidth;
		var fulldata = {
			data : [],
			options : {
				colors : ["#333333"],
				chartArea: {'width': '70%', 'height': '70%', 'left' : '40'},
	            width: width,
	            height: width * 0.65,
	            'legend': { position: 'bottom'},
	            curveType: 'function'
			}
		};

		$.each(statistics, function(index, statistic){
			
			var day = moment(statistic.get("date")).format("D MMM");
			var number = statistic.pluck("messages", network);
			fulldata.data.push([day, number]);

		}.bind(this));
		
		fulldata.data.unshift(["Day", "Number of messages"]);
		
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

	parsenotifications : function(collection, statistic, token){
		
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
			var numnotifications = stream.getnotifications();
			
			if(token && network.gettoken() != token)
				return true;

			if(_.isNumber(numnotifications) && _.has(networks, network.gettoken())){
				networks[network.gettoken()]["notifications"] += numnotifications;
			}				
			else{
				networks[network.gettoken()] = network;
				networks[network.gettoken()]["notifications"] = numnotifications;
			}
		});
		
		networks = _.sortBy(networks, function(network){
			return network.get("notifications");
		});
		
		//Apply name & colors
		$.each(networks, function(index, network){
			fulldata.data.push([network.gettitle(), network.notifications]);
			fulldata.colors.push(network.getcolor());
		});

		if(!token && !statistic)
			fulldata.data.unshift(["Network", "Number of contacts"]);
		
		return fulldata;
	},

	parsefollowers : function(collection, statistic, token){
		
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
			var numfollowers = stream.getfollowers();
			
			if(token && network.gettoken() != token)
				return true;

			if(_.isNumber(numfollowers) && _.has(networks, network.gettoken())){
				networks[network.gettoken()]["followers"] += numfollowers;
			}				
			else{
				networks[network.gettoken()] = network;
				networks[network.gettoken()]["followers"] = numfollowers;
			}
		});
		
		networks = _.sortBy(networks, function(network){
			return network.get("followers");
		});
		
		//Apply name & colors
		$.each(networks, function(index, network){
			fulldata.data.push([network.gettitle(), network.followers]);
			fulldata.colors.push(network.getcolor());
		});

		if(!token && !statistic)
			fulldata.data.unshift(["Network", "Number of contacts"]);
		
		return fulldata;
	},

	parsefollowing : function(collection, statistic, token){
		
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
			var numfollowing = stream.getfollowing();
			
			if(token && network.gettoken() != token)
				return true;

			if(_.isNumber(numfollowing) && _.has(networks, network.gettoken())){
				networks[network.gettoken()]["following"] += numfollowing;
			}				
			else{
				networks[network.gettoken()] = network;
				networks[network.gettoken()]["following"] = numfollowing;
			}
		});
		
		networks = _.sortBy(networks, function(network){
			return network.get("following");
		});
		
		//Apply name & colors
		$.each(networks, function(index, network){
			fulldata.data.push([network.gettitle(), network.following]);
			fulldata.colors.push(network.getcolor());
		});

		if(!token && !statistic)
			fulldata.data.unshift(["Network", "Number of contacts"]);
		
		return fulldata;
	},

	'parsefollow' : function(collection){

		var statistic = collection.latest();
		var followers = statistic.pluck(["contacts","types","followers"], this.network, 3);
		var following = statistic.pluck(["contacts","types","following"], this.network, 3);
		var fulldata = {
			data : [[ 'Followers', followers],['Following', following]], 
			options : {
				colors : ["#2bbedc", "#324A4F"]
			}
		};

		if(following + followers <= 0)
			return this.emptychartdata();

		fulldata.data.unshift(["Follow state", "Number of contacts"]);
		
		return fulldata;

	},

	parseage : function(collection){
		
		var streams = collection.latest().get("streams");
		var grouped = this.groupkey(streams, "contacts", "age");
		var total = 0;
		var data = [];
		var fulldata = {
			data : [], 
			options : {
				colors : ["#2bbedc", "#2CA7C0", "#2E90A4", "#2F7988", "#30616B", "#324A4F", "#333333"]
			}
		};

		$.each(grouped, function(key, value){
			data.push([key, value]);
			total += value;
		});

		data = _.sortBy(data, function(age) {
			return age.title;
		});

		if(data.length == 0 || total == 0)
			return this.emptychartdata();

		fulldata.data = data;		
		fulldata.data.unshift(["Age interval", "Number of contacts"]);

		return fulldata;
	},

	'groupkey' : function(collection, parents, key){
		
		var group = {};
		
		$.each(collection, function(index, statistic){ 
			if((this.network && statistic.id == this.network) || !this.network){
				var object = statistic[parents][key];
				if(_.isObject(object)){
					if(_.isEmpty(group)){
						group = object;
					}else{
						$.each(object, function(key, value){
							group[key] += value;
						});
					}
				}
			}
		}.bind(this));
		return group;
	},

	parsegender : function(collection){

		var streams = collection.latest().get("streams");
		var grouped = this.groupkey(streams, "contacts", "gender");
		var total = 0;
		var data = [];
		var fulldata = {
			data : [], 
			options : {
				colors : ["#2bbedc", "#F14B68", collection.networkcolors["others"]]
			}
		};

		$.each(grouped, function(key, value){
			data.push([this.capitalize(key), value]);
			total += value;
		}.bind(this));
		
		if(data.length == 0 || total == 0)
			return this.emptychartdata();

		fulldata.data = data;
		fulldata.data.unshift(["Gender", "Number of contacts"]);

		return fulldata;
	},

	'capitalize' : function(string){

		return string.charAt(0).toUpperCase() + string.slice(1);
	},	

	filtercountry : function(collection, streamid){
		
		var grouped = {};
		//console.log(collection.latest())
		var streams = collection.latest().get("streams");
		
		// Groups & sums by country
		$.each(streams, function(k, stream){
			if((streamid && stream.id == streamid) || !streamid){
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
			}
		});
		
		// Sorts it
		grouped = _(grouped).sortBy(function(country) {
			return country.total;
		});
		
		return grouped;
	},

	// Size -> Int:: Show the n most important, group the others
	parseregional : function(collection, streamid){
		
		var networkid = streamid || this.network;
		var data = [];
		var size = 8; //hardcoded?
		var counter = 0;
		var grouped = this.filtercountry(collection, networkid);
		var fulldata = {
			data : [], 
			options : {
				colors : this.colors
			}
		};
		this.regional = [];

		// We don't care about grouping "others"
		if(!size || size > grouped.length)	size=grouped.length;

		//There is no country data
		if(size == 0)
			return this.emptychartdata();

		// Gets n biggest values (or all of them)
		while(counter < size){
			var country = grouped.pop();
			fulldata.data.push([country.name, country.total]);
			this.regional.push(country);
			counter++;
		}

		// If we are grouping, calculate the "Others"
		var total = _.reduce(grouped, function(memo, num){
			return memo + num.total;  
		}, 0);

		fulldata.data.push(["Others", total]);		
		fulldata.data.unshift(["Countries", "Number of contacts"]);
		
		return fulldata;
	},

	parsecities : function(collection){

		var cities, size = 6;
		var countries = this.filtercountry(collection, this.network);
		var fulldata;
		var cities = {};
		var country;

		//In case something goes wrong
		if(countries.length == 0)
			return this.emptychartdata();

		country = countries[countries.length-1];
		countrycities = country.cities;
		
		$.each(countrycities, function(index, city){
			cities[city.name] = {name: city.name, value: city.total};
		});
		
		//Sort the cities
		cities = _(cities).sortBy(function(city) {
			return city.value;
		});
		
		fulldata = this.getbiggestdata(cities,size);		
		fulldata.data.unshift(["Cities", "Number of contacts"]);

		//Update the label
		this.$el.find('h4').text(country.name+' cities');

		return fulldata;
	},

	parsenetworks : function(collection){

		var data = [];
		var countries = this.connect.regional ? this.connect.regional : this.parseregional(collection);
		var fulldata = {
			data : [], 
			colors : []
		};
		
		//There is no country data
		if(countries.length == 0)
			return this.emptychartdata();

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
			options : {
				colors : []
			}
		};

		while(counter < n){
			var dataset = datasets.pop();
			fulldata.data.push([dataset.name, dataset.value]);
			fulldata.options.colors.push(this.countrycolors[counter]);
			counter++;
		}

		if(datasets.length == 0)	return fulldata;

		// If we are grouping, calculate the "Others"
		var total = _.reduce(datasets, function(memo, num){
			return memo + num.value;  
		}, 0);

		fulldata.data.push(["Others", total]);
		fulldata.options.colors.push(this.collection.networkcolors["others"]);
		
		return fulldata;
	},

	parsebesttime : function(collection){
		
		var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		var besttime,
			data = [],
			maxvalue = 0,
		 	dailyvalue = 0,
		 	fill,
		 	max,
		 	time;

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
			options : {
				chartArea: {'width': '70%', 'height': '60%', 'left' : '40', 'top' : '50'},
	            width: width,
	            height: width * 0.4,
		        'legend':{textStyle:{fontSize:'11'}, position: 'top'},
		        'curveType': 'function',
	    		colors : []
				}
			};

		for (var i = 0; i < length; i++){
			streams = collection.place(i).get("streams");
			dailyresult = this[func](null, streams, network);

			_.map(dailyresult.data, function(token){

				if(!data[token[0]])
					data[token[0]] = [];
				
				data[token[0]][i] = token[1];
			});
		}
			
		for(var i=0; i<length; i++){

			var line = [moment(collection.place(i).get("date")).format("D MMM")];
			
			for(d in data){
				line.push(data[d].shift());
			}

			fulldata.data.push(line);
		}

		for(d in data){
			legend.push(d);
			fulldata.options.colors.push(this.networktokens[d]);
		}

		fulldata.data.unshift(legend);
		
		return fulldata;
		
	},

	'parseallreports' : function(collection){

		var contacts = this.parseevolution(collection, "contacts").data;
		var messages = this.parseevolution(collection, "messages").data;
		var notifications = this.parseevolution(collection, "notifications").data;
		//var impressions = this.parseevolution(collection, "impressions").data;
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
		notifications.shift();
		//impressions.shift();

		$.each(contacts, function(index, value){
			contacts[index].push(messages[index][1]);
			contacts[index].push(notifications[index][1]);
			//contacts[index].push(impressions[index][1]);
		});

		fulldata.data = contacts;

		fulldata.data.unshift(["Day of the week", "Contacts", "Messages", "Notifications"]);
		
		return fulldata;
	},

	'parsegeo' : function(collection)
	{	
		var fulldata = this.parseregional(collection, this.network);
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

	*/
	'emptychartdata' : function (){

		var fulldata = {
			data : [["No results", 1]],
			options : {
				colors : ["#e5e5e5"]
			}
		};

		fulldata.data.unshift(["Results", "Number"]);
		
		return fulldata;
	},
	
	'negotiateFunctionalities' : function()
	{
		
		
	}
	

});