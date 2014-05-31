/**
 *	Loader functions
 *
 *	loadListeners	Loads a list of events to be listened to, links them to the loadRender function
 *	addLoader		Adds the progress bar dinamically to the container div
 *	loadRender		Updates the width of the progress bar according to the stage (event)
 *	finishLoading	Ends the loading animation effect & readies it for the next loading (ie: filters)
 *	rollBack		Responsible for the rollback effect
 *
**/

Backbone.View = Backbone.View.extend({

	'loadListeners' : function(model, states){
		var length = states.length;

		for(i in states){
			this.listenTo(model, states[i], this.loadRender.bind(this, Number(i)+1, length));
		}
		//Add the progress-bar dinamicaly
		this.on("rendered", this.addLoader);
	},

	'addLoader' : function(){
		this.container = this.$loadercontainer ? this.$loadercontainer : this.$container;
		this.loader = $(Templates.progressbar).appendTo(this.container);
	},

	'loadRender' : function(index, length){
		//Just to make it moving from the beggining
		if(!this.loader) return;

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
	}
});