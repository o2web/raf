// scrollEvents.js
//
// O2 WEB
// o2web.ca
// 2014

//
//
// DEFINE MODULE
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // Define AMD module
    define(['jquery', 'raf'], factory);
  } else {
    // JQUERY INIT
    factory(jQuery);
  }
}

//
//
// MAIN CODE
(this, function($){

	var root = this;
	$win = $(window);

	//
	//
	// GLOBAL VARIABLES
	root.scrollEvents = {
		selection: [],
		t:$win.scrollTop(),
		b:$win.height(),
		wh:$win.height()
	};

	//
	//
	// HELPERS

	// clone functions
	Function.prototype.clone = function() {
	    var that = this;
	    var temp = function temporary() { return that.apply(this, arguments); };
	    for(var key in this) {
	        if (this.hasOwnProperty(key)) {
	            temp[key] = this[key];
	        }
	    }
	    return temp;
	};

	// min max
	minMax = function(n,min,max){
		if(n<min) return min;
		if(n>max) return max;
		return n;
	}

	// sort event by order option
	sortByOrder = function(a,b){
		return 	a.order < b.order ? -1
					: a.order > b.order ? 1
					: 0
	}

	// sort callbacks by closest to top
	sortCallbacksByDistance = function(a,b){
		var distA = a.e.topUp || a.e.topDown ?
									Math.abs(scrollEvents.t - a.e.t) :
									Math.abs(scrollEvents.b - a.e.b) ;
		var distB = b.e.topUp || b.e.topDown ?
									Math.abs(scrollEvents.t - b.e.t) :
									Math.abs(scrollEvents.b - b.e.b) ;
		return 	distA < distB ? 1
					: distA > distB ? -1
					: 0
	}

	// Move check up or down
	moveCheck = function(check, move){

	}


	//
	//
	// CHECKS
	function checkUp(e, activate, callback, update){
		if(
				( e.isVisible && e.b <= scrollEvents.t ) ||
				( update && e.b <= scrollEvents.t )
			){
			if(activate) e.isVisible=false;
			if(!update && callback) e.up(e)
			else if(update && callback) return e.up;
		}
		return false;
	}
	function checkDown(e, activate, callback, update){
		if(
				( e.isVisible && e.t >= scrollEvents.b ) ||
				( update  && e.t >= scrollEvents.b )
			){
			if(activate) e.isVisible=false;
			if(!update && callback) e.down(e)
			else if(update && callback) return e.down;
		}
		return false;
	}
	function checkVisible(e, activate, callback, update){
		if(
				( !e.isVisible && e.t < scrollEvents.b && e.b > scrollEvents.t ) ||
				( update && e.t < scrollEvents.b && e.b > scrollEvents.t)
			){
			if(activate) e.isVisible=true;
			if(!update && callback) e.visible(e)
			else if(update && callback) return e.visible;
		}
		return false;
	}
	function checkTopUp(e, activate, callback, update){
		if(
				( e.isTopVisible && e.t <= scrollEvents.t ) ||
				( update && e.t <= scrollEvents.t )
		){
			if(activate) e.isTopVisible = false;
			if(!update && callback) e.topUp(e)
			else if(update && callback) return e.topUp;
		}
		return false;
	}
	function checkTopDown(e, activate, callback, update){

		if(
				( !e.isTopVisible && e.t > scrollEvents.t ) ||
				( update && e.t > scrollEvents.t )
		){
			if(activate) e.isTopVisible = true;
			if(!update && callback) e.topDown(e)
			else if(update && callback) return e.topDown;
		}
		return false;
	}
	function checkBottomUp(e, activate, callback, update){

		if(
				( e.isBottomVisible && e.b < scrollEvents.b ) ||
				( update && e.b < scrollEvents.b )
		){
			if(activate) e.isBottomVisible = false;
			if(!update && callback) e.bottomUp(e)
			else if(update && callback) return e.bottomUp;
		}
		return false;
	}
	function checkBottomDown(e, activate, callback, update){

		if(
				( !e.isBottomVisible && e.b >= scrollEvents.b ) ||
				( update && e.b >= scrollEvents.b )
		){
			if(activate) e.isBottomVisible = true;
			if(!update && callback) e.bottomDown(e)
			else if(update && callback) return e.bottomDown;
		}
		return false;
	}
	function checkTravel(e, activate, callback, update){
		if(
				( e.isVisible && e.b <= scrollEvents.t ) ||
				( update && e.b <= scrollEvents.t )
		){
			if( activate&&!e.up ) e.isVisible=false;
			if( callback || update ) e.rafref = root.raf.off(e.rafref, e.$container, 'scroll', e.travel).ref;
		}
		if(
				( e.isVisible && e.t >= scrollEvents.b ) ||
				( update && e.t >= scrollEvents.b )
		){
			if( activate&&!e.down ) e.isVisible=false;
			if( callback || update ) e.rafref = root.raf.off(e.rafref, e.$container, 'scroll', e.travel).ref;
		}
		if(
				( !e.isVisible && e.t < scrollEvents.b && e.b > scrollEvents.t ) ||
				( update &&  e.t < scrollEvents.b && e.b > scrollEvents.t )
		){
			if(activate&&!e.visible) e.isVisible=true;
			if(callback || update){
				if(e.rafref) root.raf.off(e.rafref, e.$container, 'scroll', e.travel);
				e.rafref = root.raf.on(e.$container, 'scroll', {
					delta: function(){return minMax(Math.round( ( scrollEvents.t - (e.t - scrollEvents.wh) ) / ( e.h + e.offset + e.offsetBottom + scrollEvents.wh) * e.round)/e.round, 0, 1) },
					$selection: e.$selection,
					index: e.i,
					height: e.h
				}, e.travel).ref;
			}
		}
	}

	//
	//
	// PARSE WHICH CHECKS ARE NECESSARY
	function parseChecks(e){
		e.checks = [];

		if(e.travel){
			e.checks.push(
				{
					event: e,
					fn: checkTravel,
					activate: true,
					callback: !!e.travel
				}
			)
		}
		if(e.up || e.checkdown || e.visible){
			e.checks.push(
				{
					event: e,
					fn: checkUp,
					activate: true,
					callback: !!e.up
				},
				{
					event: e,
					fn: checkDown,
					activate: true,
					callback: !!e.down
				},
				{
					event: e,
					fn: checkVisible,
					activate: true,
					callback: !!e.visible
				}

			)
		}
		if(e.topUp || e.topDown){
			e.checks.push(
				{
					event: e,
					fn: checkTopDown,
					activate: true,
					callback: !!e.topDown
				},
				{
					event: e,
					fn: checkTopUp,
					activate: true,
					callback: !!e.topUp
				}
			)
		}
		if(e.bottomUp || e.bottomDown){
			e.checks.push(
				{
					event: e,
					fn: checkBottomDown,
					activate: true,
					callback: !!e.bottomDown
				},
				{
					event: e,
					fn: checkBottomUp,
					activate: true,
					callback: !!e.bottomUp
				}
			)
		}
	}


	//
	//
	// FIRE EVENTS ON SCROLL
	function eventScroller(e){
		if(typeof e == 'boolean'){
			var update = true;
			var stack = [];
		}
		var oldT = scrollEvents.t;
		scrollEvents.t = $win.scrollTop();
		scrollEvents.b = scrollEvents.t+scrollEvents.wh;
		for(var i=0; i<scrollEvents.selection.length; i++){
			var el = scrollEvents.selection[i];
			for(var j=0; j<el.scrollEvents.length; j++) (function(e){
				if(!e.disabled){
					for(var k=0; k<e.checks.length; k++){
						var c = e.checks[k];
						var call = c.fn(e, c.activate, c.callback, update);
						if(call) stack.push({callback: call, e:e});
					}
				}
			})(el.scrollEvents[j]);
		};
		//if update, sort callbacks by distance from
		if(update && stack.length){
			stack.sort(sortCallbacksByDistance);
			for(var s=0; s<stack.length; s++)
				if(!!stack[s].callback)
					stack[s].callback(stack[s].e);
			// scrollEvents.direction = 'update';
		}
		// else{
			scrollEvents.direction = 	scrollEvents.t > oldT ?
																	'down' :
																	scrollEvents.t < oldT ?
																		'up' :
																			'idle';
		// }
	}

	//
	//
	// RECALCULATE SIZES AND POSITIONS
	function recalculate(){
		scrollEvents.wh = $win.height();
		for(var i=0; i<scrollEvents.selection.length; i++){
			var $el = $(scrollEvents.selection[i]);
			var el = $el[0];
			var h =  $el[0].offsetHeight;
			el.style.position = el.initialStates.position;
			el.style.top = el.initialStates.top;
			var t = Math.round($el.offset().top);
			for(var j=0; j<el.scrollEvents.length;j++){
				var e = el.scrollEvents[j];
				e.h = h;
				e.t = t - e.offset;
				e.b = e.t + e.h + e.offsetBottom;
			}
			el.style.position = '';
			el.style.top = '';
		}
	}

	//
	//
	// RECALCULATE ON RESIZE
	function resizeScroller(){
		root.raf.on('nextframe', function(){
			recalculate();
			eventScroller(true);
		});
	}


	//
	//
	// METHODS AND WHAT TO DO WITH 'EM
	function parseMethods(selection, args, flag, options){
		if(args=='resize'){
			resizeScroller();
		}
		else if(args=='trigger'){
			eventScroller('update');
		}
		else if(args=='update'){
			resizeScroller('update');
		}
		else if(
			args=='destroy' ||
			args=='disable' ||
			args=='enable' ||
			args=='remove' ||
			args=='get' ||
			args=='set' || 
			args=='eval'
		){
			var selection = $(selection);
			var removed = [];
			var returned = [];
			for(var i=0; i<selection.length; i++){
				var el = selection[i];
				if(el.scrollEvents){
					if(args=='destroy' || args=='remove'){
						removed.push(el);
					}
					else{
						for(var j=0;j<el.scrollEvents.length;j++){
							var ev = el.scrollEvents[j];
							if(args=='eval'){

								var o = options && typeof(options=='string') ? options : flag;
								var f = options && typeof(options=='string') ? flag : false;

								if(ev[o] && (!f || (f && f==ev.flag))){
									if(o=='travel'){
										return {
											data: {
													delta: function(){return Math.round( ( scrollEvents.t - (ev.t - scrollEvents.wh) ) / ( ev.h + scrollEvents.wh) *100)/100 },
													selection: ev.$selection,
													index: ev.i,
													height: ev.h
												}
										}
									}
									else{
										return ev[o](ev);
									}
								}
							}
							else{

								if(flag && typeof(flag=='string')){

									if(ev.flag==flag){
										if(args=='disable'){
											ev.disabled = true;
											if(ev.travel)
												root.raf.off(ev.$container, 'scroll', ev.travel);
											if(ev.disable && typeof ev.disable == 'function')
												ev.disable(ev);
										}
										else if(args=='enable'){
											ev.disabled = false;
											if(ev.travel){
												e.isVisible = false;
												checkTravel(ev, true, true);
											}
											if(ev.enable && typeof ev.enable == 'function')
												ev.enable(ev);
										}
										else if(args=='set'){
											$.extend(true, ev, options);
										}
										else if(args=='get'){
											returned.push(ev);
										}
									}
								}
								else{
									if(args=='disable'){
										ev.disabled = true;
										if(ev.travel) root.raf.off(ev.$container, 'scroll', ev.travel);
									}
									else if(args=='enable'){
										ev.disabled = false;
										if(ev.travel){
											ev.isVisible = false;
											checkTravel(ev, true, true);
										}
									}
									else if(args=='set'){
										$.extend(true, ev, options);
									}
									else if(args=='get'){
										returned.push(ev);
									}
								}
							}
						}
					}
				}
			}

			if(args=='destroy' || args=='remove'){
				removed.sort(function(a, b){return b.scrollEvents.se-a.scrollEvents.se});
				for(var k=0;k<removed.length; k++){
					var el = removed[k];
					if(el.scrollEvents)
						for(var e=0; e<el.scrollEvents.length; e++)
							if(el.scrollEvents[e].travel)
								root.raf.off(el.scrollEvents[e].rafref, el.$container, 'scroll', el.scrollEvents[e].travel);
					scrollEvents.selection.splice(el.scrollEvents.se,1);
					el.scrollEvents = [];
				}
				for(var i=0; i<scrollEvents.selection.length; i++){
					scrollEvents.selection[i].scrollEvents.se = i;
				}
			}

			if(args=='destroy' || !scrollEvents.selection.length){
				root.raf.off(scrollEvents.scrollRafref, 'scroll', eventScroller);
				root.raf.off(scrollEvents.resizeRafref, 'afterdocumentresize', resizeScroller);
			}

			if(args=='get'){
				return returned;
			}
		}
		return selection;
	}

	//
	//
	// JQUERY FUNCTION
	$.extend($.fn, {
		scrollEvents: function(args, flag, options){

			if(typeof(args)=='string'){
				return parseMethods(this, args, flag, options);
			}

			$(this).each(function(k,v){
				var e = $.extend(true,{
						$selection: $(this),
						$container: $win,
						flag: false,
						order: 0,
						offset: 0,
						offsetBottom: 0,
						round: 100,
						//
						visible: false,
						up: false,
						down: false,
						topUp: false,
						topDown: false,
						bottomUp: false,
						bottomDown: false,
						travel: false,
						//
						disable: false,
						enable: false,
						//
						direction: 'idle',
						//
						isVisible: false,
						isTopVisible: false,
						isBottomVisible: false,
						//
						h: this.offsetHeight,
						t: 0,
						b: this.offsetHeight,
						i: k,
						disabled: false,
						checks: []
					}, args);
				e.travel = args.travel ? args.travel.clone() : false;

				parseChecks(e);
				e.checks.sort(sortByOrder);

				//
				//
				var duplicate = false;
				for(var i=0; i<scrollEvents.selection.length; i++ ){
					if(scrollEvents.selection[i]==this){
						duplicate = true;
					}
				}
				if(!duplicate){
					scrollEvents.selection.push(this);
					e.se = scrollEvents.selection.length;
					this.initialStates = {
					 	position: $(this).css('position'),
					 	top: $(this).css('top')
					};
				}
				if(!this.scrollEvents){
					this.scrollEvents = [];
				}
				this.scrollEvents.push(e);
				this.scrollEvents.sort(sortByOrder);
			});

			// un hook events, then rehook 'em
			if(scrollEvents.scrollRafref != undefined) root.raf.off(scrollEvents.scrollRafref, 'scroll', eventScroller);
			scrollEvents.scrollRafref = root.raf.on('scroll', eventScroller).ref;
			if(scrollEvents.resizeRafref != undefined) root.raf.off(scrollEvents.resizeRafref, 'afterdocumentresize',  resizeScroller);
			scrollEvents.resizeRafref = root.raf.on('afterdocumentresize', resizeScroller).ref;
			return this;
		}
	});

	$(document).ready(function(){
			resizeScroller();
	})

	$win.on('load', function(){
		resizeScroller('update');
	});

}));