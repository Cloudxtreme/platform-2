/**
 *	Loader functions
 *
 *	loadListeners	Loads a list of events to be listened to, links them to the loadRender function
 *	addLoader		Adds the progress bar dinamically to the container div
 *	loadRender		Updates the width of the progress bar according to the stage (event)
 *	finishLoading	Ends the loading animation effect & readies it for the next loading (ie: filters)
 *	rollBack		Responsible for the rollback effect
 *
 *	Update functions
 *	
 *	updateable		Listens to outdated and shows update state
 *
**/

Backbone.View = Backbone.View.extend({
	
	'loadListeners' : function(model, states, once){
		var length = states.length;
		var listentype = 'listenTo';

		if(once)	listentype = 'listenToOnce'

		for(i in states){
			if(_.isArray(states[i])){
				for(n in states[i]){
					this[listentype](model, states[i][n], this.loadRender.bind(this, Number(i)+1, length));					
				}
			}else{
				this[listentype](model, states[i], this.loadRender.bind(this, Number(i)+1, length));
			}
		}

		// All listen to the empty state
		this.listenTo(model, 'ready:empty', this.emptylist.bind(this));

		//Add the progress-bar dinamicaly
		this.on("rendered", this.addLoader);
	},

	'addLoader' : function(){
		this.container = this.$loadercontainer ? this.$loadercontainer : this.$container;
		this.loader = $(Templates.progressbar).appendTo(this.container);
	},

	'loadRender' : function(index, length){

		console.log(index, length)

		//Just to make it moving from the beggining
		if(!this.loader) return;

		if(this.container.hasClass('empty-list'))	this.container.removeClass('empty-list');
		if(this.loader && this.loader.hasClass('loaded'))	this.restart();
		if(this.loader && this.loader.hasClass('loading') && index == 1)	this.restart();
		if(length == index){
			this.finishLoading();
		} 
		
		var dis = this;
		// Ugly but needed hack
		setTimeout(function(){
			var width = index*100/length;

			if(!dis.loadingstate || dis.loadingstate <= width){
				dis.loadingstate = width;
				if(dis.loader)	dis.loader.css('width',width+'%');
			}else{
				dis.restart();
			}		
		},1);
	},

	'restart' : function(){
		this.loadingstate = 0;
		this.loader.remove();
		this.addLoader();
		this.container.removeClass('loaded').addClass('toload');
	},

	'finishLoading' : function(){
		this.loader.css('width','100%');
		this.loader.addClass('loaded');
		this.container.removeClass('toload').addClass('loaded');
	},

	'emptylist' : function(){
		
		this.loadRender(99,99);
		this.container.addClass('empty-list');
		
	},
	
	/**
	 *	Update
	**/
	
	'counter' : 0,
	
	'updateable' : function (model, countertarget)
	{	
		// where to place the counter
		this.$countertarget = countertarget? countertarget: this.$container;
	
		this.listenTo(model? model: this.model, "outdated", this.showupdate);
	},
	
	'showupdate' : function (model)
	{
		// Create Counter
		if(!this.$counter)
			this.$counter = $("<counter></counter>").appendTo(this.$countertarget).on('click', function()
			{
				this.resetupdate();
				this.render();
			}.bind(this));
			
		$(this.$loadercontainer ? this.$loadercontainer : this.$container).addClass("outdated");
		
		this.$counter.html(++this.counter);
	},
	
	'clearupdate' : function ()
	{
		this.$el.find(".outdated").removeClass("outdated");
		this.resetupdate();
	},
	
	'resetupdate' : function ()
	{
		this.counter = 0;
		this.$counter.remove();
	}
});