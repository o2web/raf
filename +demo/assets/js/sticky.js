// sticky.js
//
// O2 WEB
// o2web.ca
// 2014

(function($){

	window.sticky = {
		selection: []
	}
	$win = $(window);

	cloneForResize = function($el){
		var $clone = $el.clone();
		$clone[0].style.visibility = 'hidden';
		$clone[0].style.marginBottom = '-'+$clone.outerHeight()+'px';
		return $clone;
	};

	updateContainedOffset = function(e){
		var $selection = (e.data && e.data.$selection) ? e.data.$selection : e;
		// loop throught selection
		for(var s=0; s<$selection.length; s++){
			var el = $selection[s];
			var $el = $(el);

			// prevent double updates
			if(el.stickyAlreadyUpdating) return;

			for(var i=0; i<el.scrollEvents.length; i++)
				if(el.scrollEvents[i].flag=='sticked')
					var options = el.scrollEvents[i];
			if(options){
				el.$stickyClone.insertBefore($el);
				var stickyPosition = el.$stickyClone.position();
				el.$stickyClone[0].style.width = el.$stickyClone.outerWidth()+'px';
				el.$stickyClone[0].style.position = 'absolute';
				el.$stickyClone[0].style.top = stickyPosition.top+'px';
				el.$stickyClone[0].style.left = stickyPosition.left+'px';
				el.stickyAlreadyUpdating = true;

				window.raf.on('nextframe', {$el:$el}, function(e){
					var $el = e.data.$el;
					var el = $el[0];
					if(!el.$stickyClone) return;

					var stickyHeight = el.$stickyClone.outerHeight();
					var containerHeight = options.container.outerHeight();

					// Disable sticky if its height is taller than its container's
					var sticky = $el.scrollEvents('get','sticked');
					var contained = $el.scrollEvents('get','contained');
					var disableIt = stickyHeight > containerHeight - options.offset - options.offsetBottom - stickyPosition.top;
					for(var e = 0; e<sticky.length; e++)
						if( disableIt && !sticky[0].disabled && sticky[e].reset) sticky[e].reset(sticky[e]);
					if(sticky.length && sticky[0].disabled == !disableIt)
						$el.scrollEvents(disableIt ? 'disable' : 'enable','sticked');
					if(contained.length && contained[0].disabled == !disableIt)
						$el.scrollEvents(disableIt ? 'disable' : 'enable','contained');

					// set new offset for event tagged "contained"
					$el.scrollEvents('set','contained', {
						offset: -(containerHeight - stickyPosition.top - stickyHeight - options.offsetBottom ) + options.offset
					});

					// remove clone
					el.$stickyClone.remove();
					el.stickyAlreadyUpdating = null;
				});
			}
		}
	}


	resetSticky = function ($selection) {
		for(var s=0; s<$selection.length; s++){
			var el = $selection[s];
			var $el = $(el);
			for(var i=0; i<el.scrollEvents.length; i++)
				if(el.scrollEvents[i].flag=='sticked')
					var options = el.scrollEvents[i];
			if(options){
				options.reset(options);
			}
		}
	}

	getStickys = function($selection){
		var selected = $();
		for(var e=0; e<$selection.length; e++){
			var found = window.sticky.selection.indexOf($selection[e]);
			if(found>-1) selected.push(window.sticky.selection[found]);
		}
		return selected;
	}

	pushStickys = function($selection){
		for(var e=0; e<$selection.length; e++)
			window.sticky.selection.push($selection[e]);
	}

	setRafref = function(rafref, $selection){
		for(var e=0; e<$selection.length; e++)
			$selection[e].stickyRafref = rafref;
	}

	getRafref = function($selection){
		var refs = [];
		for(var e=0; e<$selection.length; e++){
			var ref = $selection[e].stickyRafref;
			var found = refs.indexOf(ref);
			if(found==-1) refs.push(ref);
		}
		return refs;
	}

	$.extend($.fn, {
		sticky :function(args, options){


			var $selection = $(this);
			if(typeof args == 'string'){
				var $selection = getStickys($selection);
				if(args=='update')
					updateContainedOffset($selection);
				if(args=='destroy'){
					resetSticky($selection);
					var refs = getRafref($selection);
					for(var r=0; r<refs.length; r++)
						window.raf.off(refs[r], 'afterdocumentresize', updateContainedOffset);
				}
				return $(this).scrollEvents(args, options)
			}


			var options = $.extend(true,{
					container: false,
					inverted: false,
					offset: 0,
					offsetBottom: 0,
					// standard sticky
					reset: null,
					fixed: null,
					contained: null,
					// inverted sticky
					fixedTop: null,
					fixedBottom: null,
					scrolling: null,
				}, args);


			//
			//
			// NORMAL STICKY
			if(!options.inverted){

				for(var s=0; s<$selection.length; s++){
					var $el = $($selection[s]);
					// STICKED
					$el.scrollEvents({
						order: 2,
						flag: 'sticked',
						container: options.container,
						offset: options.offset,
						offsetBottom: options.offsetBottom,
						topDown: options.reset,
						topUp: options.fixed,
						reset: options.reset,
						options: options
					});

						// CONTAINED
					if(options.container){
						$el[0].$stickyClone = cloneForResize($el);
						$el.scrollEvents({
							order: 1,
							flag: 'contained',
							offset: -(options.container.outerHeight() - $el.position().top - $el.outerHeight() - options.offsetBottom ) + options.offset,
							container: options.container,
							topDown: options.fixed,
							topUp: options.contained,
							options: options
						});
					}
				}

				if(options.container){
					updateContainedOffset($selection);
					var ref = window.raf.on('afterdocumentresize', {$selection:$selection}, updateContainedOffset).ref;
					setRafref(ref, $selection);
				}

			}

			//
			//
			// INVERTED STICKY
			else{

				$selection.scrollEvents({
					order: 2,
					flag: 'inverted sticky top',
					offset: options.offset,
					topUp: options.fixedTop,
					options: options
				});
				$selection.scrollEvents({
					order: 1,
					flag: 'scrolling top',
					offset: options.offset,
					topDown: options.scrolling,
					options: options
				});
				$selection.scrollEvents({
					order: 1,
					flag: 'scrolling bottom',
					offsetBottom: options.offsetBottom,
					bottomUp: options.scrolling,
					options: options
				});
				$selection.scrollEvents({
					order: 2,
					flag: 'inverted sticky bottom',
					offsetBottom: options.offsetBottom,
					bottomDown: options.fixedBottom,
					options: options
				});

			}


			// Add new stickys to global sticky selection
			pushStickys($selection);

		}
	});

	$win.on('load', function(){
		updateContainedOffset($(window.sticky.selection));
	});

})(jQuery);