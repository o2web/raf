// raf.js
// o2web.ca
// 2015

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

  // unset key in array
  function unset(key, array){
    return array.splice(key, 1);
  }

  // find hook inside an event's array
  function findHook(hook, event){
    var key = -1;
    for(var i=0; i<event.length; i++)
      if(event[i].delegate == hook.delegate && event[i].callback == hook.callback) key = i;
    return key;
  }

  // jquery window
  $win = $(window);


  //
  //
  // EVENT OBJECT
  function hookObj(){
    var hook = {};
    hook.event = false;
    hook.callback = false;
    hook.data = false;
    hook.delegate = $win;

    // parse arguments
    for(var i=0; i<arguments.length; i++){
      var arg = arguments[i];
      var type = typeof arg;
      if(type=='string') hook.event = arg
      else if(arg instanceof jQuery || type=='boolean') hook.delegate = arg
      else if(type=='function') hook.callback = arg
      else if(type=='object') hook.data = arg;
    }
    return hook;
  }

  //
  //
  // RAF
  // structure :
  // raf -> events -> hooks -> callback()
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

    // detections
    this.detect = {
      // detect if scroll position has changed
      scroll: function(e){
        var current = {
          top: window.pageYOffset,
          left: window.pageXOffset
        }
        // exit if scroll positions have not changed
        if(current.top == self.scroll.top && current.left == self.scroll.left) return;
        // loop throught hooks on scroll event
        for(var i=0; i<self.events.scroll.length; i++){
          var hook = self.events.scroll[i]
          hook.callback(hook);
        }
        self.scroll = current;
      },
      // detect if pointer has moved
      pointermove: function(e){

      }
    }

    //
    //
    // RAF on()
     // arguments order is not important
    // window.raf.on(type:string, delegate:$(), callback:function(), data:{})
    this.on = function(){
      // parse arguments into a new event
      var hook = hookObj.apply(this, arguments);
      // exit if event type is not set
      if(!hook.event) return false;
      // create / append hook
      if(!self.events[hook.event]){
        // create new event
        self.events[hook.event] = [];
        // update count
        self.eventsCount = count(self.events);
      }
      // push hook into event
      self.events[hook.event].push(hook);
      // start raf
      self.start();
      // return raf object
      return self;
    }
    //
    //
    // RAF off()
    // arguments order is not important
    // window.raf.off(type:string, delegate:$(), callback:function(), data:{}, unsetEntireEvent:bool)
    this.off = function(){
      // parse arguments into a new event
      var hook = hookObj.apply(this, arguments);
      // exit if event is not found
      if(!self.events[hook.event]) return false;
      // get event for this hook
      var event = self.events[hook.event];
      // remove whole event if is not set for a specific selection
      if(hook.delegate===true) unset(hook.event, self.events)
      // else, remove only hook
      else{
        // get hook index
        var hookIndex = findHook(hook, event);
        // if hook is found, unset it
        if(hookIndex>0) unset(hookIndex, event);
        // if event is empty, unset it
        if(event.length==0) unset(hook.event, self.events);
      }
      // update count
      self.eventsCount = count(self.events);
      // stop raf if there's no more events
      if(!self.eventsCount) return self.stop();
      // return raf object
      return self;
    }


    // loop animation
    this.loop = function() {
      // stop loop if no event to detect
      if(!self.eventsCount) return self.stop();
      // parse each event
      for(var e in self.events){
        if(e=='scroll') self.detect.scroll(e);
        if(e=='pointermove') self.detect.pointermove(e);
      }
      // request another frame
      self.request = window.requestAnimationFrame(self.loop);
    }

    // start animation
    this.start = function(){
      if(!self.request) self.loop();
      return self;
    }

    // stop animation
    this.stop = function(){
      if(self.request){
        window.cancelAnimationFrame(self.request);
        self.request = undefined;
      }
      return self;
    }

    //
    //
    //  return raf object
    return;
  }




  //
  //
  // JQUERY INIT
  $(document).ready(function(){
    // init RAF
    window.raf = new raf();
  });

}(jQuery));