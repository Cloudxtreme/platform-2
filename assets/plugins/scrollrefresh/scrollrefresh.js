(function($){

	var dis;

	this.init = function(options){

		dis = this;
		
		this.settings = {
			scrolltext 		: 'slide up to refresh!',
			loadingtext		: 'Loading...',
			effectdiv 		: 'effect-div',
			style			: 'sr-default',
			effectheight	: 40,
			scrolltime 		: 200,
			easing		 	: null,
			easingstrength	: 10,
			scrollsteps		: 0.5,
			scrollvalue		: 10,
			callback		: null,
			animation		: null // options object (implement couple different animations)
		};

		this.variables = {
			scrolltimeout 	: null,
			yposition		: null,
			currentheight	: 0,
			originalheight	: 0,
			scrolling		: false
		}

		this.easingfunctions = {
			linear: function (t) { return (t/dis.settings.easingstrength)},
			quad: function (t) { return t*t/(dis.settings.easingstrength*100)  }
		}

		if(options){ //Apply custom options
			dis.settings = $.extend(dis.settings, options);
		}

		//Messy...
		this.effectdiv = '<div class="'+this.settings.effectdiv+' '+this.settings.style+'" style="margin-top:-'+dis.settings.effectheight+'px;">'+this.settings.scrolltext+'</div>';

		this.variables.currentheight = -Math.abs(this.settings.effectheight);
		this.variables.originalheight = -Math.abs(this.settings.effectheight);
		
		//TODO: Check if default style has been overriden & auto calculate effect height

		//Insert loading div
		this.prepend(this.effectdiv);

		//Bind scroll event to mousewheel
		if (window.addEventListener){
			this[0].addEventListener('DOMMouseScroll', onScroll, false );
			this[0].addEventListener('mousewheel', onScroll, false );
			this[0].addEventListener('MozMousePixelScroll', onScroll, false );
		}else{
			this[0].attachEvent("onmousewheel", _onWheel);
		}
	};

	this.onScroll = function (e){

		if(dis.scrollTop()==0){

			if (e.wheelDelta) { delta = e.wheelDelta/120; }
        	if (e.detail) { delta = e.detail / 3; }
        	if(delta < dis.settings.scrollsteps) delta = dis.settings.scrollsteps;
		}
		
		dis.variables.yposition = dis.scrollTop();

		if(dis.variables.yposition <= 0){

			//Clear the timeout
			window.clearTimeout(dis.variables.scrolltimeout);
			
			//Calculates the scroll amount
			if(dis.settings.easing){

				updatePos(calcScroll(dis.settings.easing, dis.variables.currentheight));
			}else{
				updatePos(delta);
			}
		}
	};

	this.updatePos = function(h){

		dis.variables.currentheight = dis.variables.currentheight + h;
		$("."+dis.settings.effectdiv).css('margin-top',dis.variables.currentheight+"px");

		//Hack to keep scrolling!!
		dis.scrollTop(1);
		
		dis.variables.scrolltimeout = window.setTimeout(function(){
			restart();
		},dis.settings.scrolltime);

		if(dis.variables.currentheight >= 0){
			refresh(); //Refresh settings
		}
	};

	this.restart = function() {
		dis.variables.currentheight = dis.variables.originalheight;
		$("."+dis.settings.effectdiv).animate({marginTop: dis.variables.originalheight}, 200);
	};

	this.refresh = function(){

		$("."+dis.settings.effectdiv).html(dis.variables.loadingtext);

		//Clear the timeout
		window.clearTimeout(dis.variables.scrolltimeout);

		//stop the scroling
		dis.unbind("scroll");
					
		// set CSS to avoid "over-scrolling"
		$("."+dis.settings.effectdiv).css('margin-top', '0px');

		if(dis.settings.callback){
			//Do the callback (container refresh through Ajax?)
			dis.settings.callback();
		}else{

			$("."+dis.settings.effectdiv).html(dis.settings.loadingtext);
			//Refresh browser
			location.reload();	
		}
	};

	this.calcScroll = function(easing, value){

		return Math.abs(dis.easingfunctions[easing](value));
	};

	$.fn.scrollrefresh = function(){
		
		return init.apply(this, arguments);
	}

})(jQuery);