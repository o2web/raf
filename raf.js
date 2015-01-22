// raj.js
// o2web.ca
// 2014

// RAF polyfill
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function($) {

  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
    window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };

  // check if object is empty
  // http://stackoverflow.com/questions/3426979/javascript-checking-if-an-object-has-no-properties-or-if-a-map-associative-arra#answer-3427021
  function isEmpty(map){
    for(var key in map)
      if (map.hasOwnProperty(key))
        return false;
    return true;
  }


  //
  //
  // RAF
  window.raf =  {};
  function raf(){
    //
    //
    // SETUP
    var self = this;

    // events holder
    this.events = [];
    // raf request
    this.request = undefined;
    // checks
    this.check = {
      scroll: function(e){
        // console.log('scroll');
      },
      mousemove: function(e){
        // console.log('mousemove');
      }
    }

    //
    //
    // RAF on()
    self.on = function(){

      // arguments passed to the function will go here
      var event = {
        type: false,
        callback: false,
        data: false,
        delegate: false
      };

      // parse arguments
      for(var i=0; i<arguments.length; i++){
        var arg = arguments[i];
        var type = typeof arg;
        if(type=='string') event.type = arg;
        if(type=='function') event.callback = arg;
        if(type=='object') event.data = arg;
        if(arg instanceof jQuery) event.$selection = arg;
      }

      // create / append event
      var eventIndex = self.events.indexOf(event.type);
      if(eventIndex<0) self.events[event.type] = [];
      self.events[event.type].push(event);

      // start raf if not already started
      self.start();

    }

    // loop animation
    self.loop = function() {
      // console.log(self);
      if(isEmpty(self.events)) return self.stop();
      // parse each event
      for(var e in self.events){
        if(e=='scroll') self.check.scroll(e);
        if(e=='mousemove') self.check.mousemove(e);
      };
      // request another frame
      self.request = window.requestAnimationFrame(self.loop);
    }

    // start animation
    self.start = function(){
      if(!self.request) self.loop();
    }

    // stop animation
    self.stop = function(){
      if(self.request){
        window.cancelAnimationFrame(self.request);
        this.request = undefined;
      }
      return false;
    }

  }



  //
  //
  // JQUERY INIT
  $(document).ready(function(){
    window.raf = new raf();
  });

}(jQuery));