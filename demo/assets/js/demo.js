jQuery(document).ready(function($){

	// FIRE CODE TAGS
  $(window).on('load', function(){
  	var codes = $('code.eval');
  	for(var i=0; i<codes.length; i++){
  		eval($(codes[i]).html());
  	}
  });

});