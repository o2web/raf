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

  // count keys in object array
  function count(obj){
    var count = 0;
    for(var key in obj)
      if (obj.hasOwnProperty(key))
        count++;
    return count;
  }


  //
  //
  // RAF
  window.raf =  {};
  // raf object
  function raf(){
    //
    //
    // SETUP
    var self = this;

    // events holder
    this.events = [];
    // raf request
    this.request = undefined;
    //  scroll data
    this.scroll = {
      top: window.pageYOffset,
      left: window.pageYOffset
    };
    // pointer data
    this.pointer = {
      x: 0,
      y: 0
    }

    // checks
    this.check = {
      // detect if scroll position has changed
      scroll: function(e){
        var current = {
          top: window.pageYOffset,
          left: window.pageXOffset
        }
        if(current.top != self.scroll.top || current.left != self.scroll.left){
          for(var i=0; i<self.events.scroll.length; i++){
            self.events.scroll[i].callback();
          }
        }
      },
      // detect if pointer has moved
      pointermove: function(e){

      }
    }

    //
    //
    // RAF on()
    this.on = function(){

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
      if(eventIndex<0){
        self.events[event.type] = [];
        self.eventsCount = count(self.events);
      }
      self.events[event.type].push(event);

      // start raf
      self.start();

    }

    // loop animation
    this.loop = function() {
      // stop loop if no event to check
      if(!self.eventsCount) return self.stop();
      // parse each event
      for(var e in self.events){
        if(e=='scroll') self.check.scroll(e);
        if(e=='pointermove') self.check.pointermove(e);
      };
      // request another frame
      self.request = window.requestAnimationFrame(self.loop);
    }

    // start animation
    this.start = function(){
      if(!self.request) self.loop();
    }

    // stop animation
    this.stop = function(){
      if(self.request){
        window.cancelAnimationFrame(self.request);
        self.request = undefined;
      }
    }

    return self;

  }



  //
  //
  // JQUERY INIT
  $(document).ready(function(){
    window.raf = new raf();
  });

}(jQuery));