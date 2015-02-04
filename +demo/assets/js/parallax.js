// parallax.js
//
// O2 WEB
// o2web.ca
// Tous droits réservés
// All rights reserved
// 2015



(function($){
	$win = $(window);

  // global variable for parallax.js
  window.parallax = {};
  parallax.items = [];
  parallax.options = {
    perspective: 200,
    transform: Modernizr.prefixed('transform')
  }

  // jquery function
  $.fn.parallax = function(args, options){
    $selection = $(this);

    // Pass methods directly to scrollevents
    var type = typeof(args);
    if(type == 'string'){ return $(this).scrollEvents(args, options) }

    // set scrollEvents
    $selection.each(function(){
      var $el = $(this);
      var el = $el[0];
      el.z = parseFloat($el.attr('z'));
      $el.scrollEvents({
        flag: 'parallax',
        round: 1000,
        offset: el.z ? (parallax.options.perspective * Math.abs(el.z)) : 0,
        offsetBottom: el.z ? (parallax.options.perspective * Math.abs(el.z)) : 0,
        travel: function(e){
          var el = e.data.selection[0];
          var z = el.z;
          var delta = z>0 ? 1 - e.data.delta() : e.data.delta();
          var travel = (parallax.options.perspective* Math.abs(z) )
          var y = Math.round((delta*travel) - (travel/2));

          el.style[parallax.options.transform] = 'translate3d(0,'+y+'px, 0)';
        }
      });

      return $selection;
    })
  }



})(jQuery);