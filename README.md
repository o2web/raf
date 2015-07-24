# raf.js

RequestAnimationFrame handler is made to increase performance of events fired by the window element

Supports AMD / CommonJS loaders

## Data

All raf.js data you might need is stored in a global variable named raf.

	window.raf = {

		request: 0			// current raf request
		events: [], 		// list of events hooked to raf
		eventsCount: 0, 	// current count of events

		pointer: {},		// pointer position, updated if pointermove event is hooked
		scroll: {},			// scroll position, updated if scroll event is hooked

		on: function(), 	// start raf loop
		off: function(), 	// stop raf loop, useful for debugging
		loop: function(), 	// request another frame
		updateDataSources(), // update dom/prefix combos used for resize detections

		detects: {},		// Events available for detection
		inits: {}, 			// Available init callbacks when first occurence of event is hooked
		kills: {}, 			// Available kill callbacks when last occurence of event is unhooked

		win: {}, 			// Data used for window calculations
		doc: {}, 			// Data used for window calculations

	}

## Available events

- scroll
- pointermove
- windowresize
- documentresize
- afterwindowresize
- afterdocumentresize
- nextframe
- eachframe

## Hooking your callback onto an event

	window.raf.on('scroll', myScrollCallback);
	window.raf.on('documentresize', myResizeCallback);
	window.raf.on('afterdocumentresize', myHeavyResizeCallback);

## Removing your callback from an event

	window.raf.off('scroll', myCallback);




