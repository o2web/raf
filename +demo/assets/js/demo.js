jQuery(document).ready(function($){



  // générer des cercles, parce que les placer à la main c'est trop long
  var $circles = $('.demo-parallax .circles');
  var count = 60;
  var colors = ['turquoise','blue','violet'];
  var zMin = -5;
  var zMax = 5;
  var containerH = $circles.height();
  var containerW = $circles.width();
  for(var i=0; i<count; i++){
    var $circle = $('<div class="circle"></div>');
    $circle.addClass( colors[Math.floor(Math.random()*(colors.length))] );
    $circle.attr('z', Math.ceil(Math.random()* (zMax-zMin))+zMin );
    $circle[0].style.bottom = Math.round(Math.random()*containerH)+'px';
    $circle[0].style.left = Math.round(Math.random()*containerW)+'px';
    $circles.append($circle);
  }

	// FIRE CODE TAGS
  $(window).on('load', function(){
  	var codes = $('code.eval');
  	for(var i=0; i<codes.length; i++){
  		eval($(codes[i]).html());
  	}

  });

});