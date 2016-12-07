/*************************************************************************
 * 				!!!!!!!! Requires animate.css !!!!!!!!
 * 				https://daneden.github.io/animate.css/
 * 
 * 								AUTHOR
 * 						Pelle Lagermann Jensen
 * 
 * USAGE
 * [1] Add script to page
 * [2] Run script: reveal({... options ...}})
 * [3] Add a data-reveal attribute to all elements that needs to be animated
 * --- optionals
 * [4] Specify per element animations by assigning animate.css classes to the data-reveal attribute 
 * [5] Set per element animation delay (ms) with data-reveal-delay="200" 
*************************************************************************/

(function (window, document, undefined) {
	"use strict";

	var _peekaboo = window.peekaboo;

	// Default settings
	var defaults = {
			selector: '[data-peekaboo]',			//Selector for elems		
			buffer: 200,							//Number of pixels above the bottom of the screen before animating
			delay: 0,								//Delay before animating
			animation: "slideInUp",					//Default animation 
			animateOnInit: true,					//Should items animate on page load or only when scolled into view
			resetAnimations: true,					//Determines if items should animate everytime they are scrolled into view
			callback: function () {}				//Callback with revealed element
		},
		globals = {
			windowDimensions: null,
			scrollPosition: {
				before: null,
				now: null
			},
			bufferZone: {
				top: null,
				bottom: null
			}
		},
		settings;

	var forEach = function ( collection, callback, scope ) {
		if ( Object.prototype.toString.call( collection ) === '[object Object]' ) {
			for ( var prop in collection ) {
				if ( Object.prototype.hasOwnProperty.call( collection, prop ) ) {
					callback.call( scope, collection[prop], prop, collection );
				}
			}
		} else {
			for ( var i = 0, len = collection.length; i < len; i++ ) {
				callback.call( scope, collection[i], i, collection );
			}
		}
	};

	var extend = function () {
		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;
	};

	var getDocumentHeight = function () {
		return Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
		);
	};

	var getWindowScrollPos = function () {
		// Calculate the page scroll. 
		// All browsers except IE<9 support `pageXOffset/pageYOffset`, and in IE when DOCTYPE is set, the scroll can be taken from documentElement(<html>), 
		// otherwise from `body` - so we take what we can.
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
	    	scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;

		return {
			top: scrollTop ? scrollTop : 0,
			left: scrollLeft ? scrollLeft : 0
		};		
	};

	function getPosition(elem) {
		// http://javascript.info/tutorial/coordinates
	    // (1) - Get the enclosing rectangle
	    var box = elem.getBoundingClientRect(),	    
	    	body = document.body,
	    	docElem = document.documentElement;
	    
	    var windowScrollPos = getWindowScrollPos();
	    	    
	    // (3) - The document (`html` or `body`) can be shifted from left-upper corner in IE. Get the shift.
	    var clientTop = docElem.clientTop || body.clientTop || 0,
	    	clientLeft = docElem.clientLeft || body.clientLeft || 0;
	    
	    // (4) - Add scrolls to window-relative coordinates and substract the shift of `html/body` to get coordinates in the whole document.
	    var top  = box.top + windowScrollPos.top - clientTop,
	    	bottom = box.bottom + windowScrollPos.top - clientTop;			
	    
	    return { top: Math.round(top), bottom: Math.round(bottom) };
	}

	var getElems = function (selector) {
		var _elems = document.querySelectorAll( selector ),
			elems = [];
				
		forEach( _elems, function (elem) {
			elem.classList.add("animated");
			elem.style.visibility = 'hidden';				
			elems.push({
				elem: elem,
				position: {
					top: 0,
					bottom: 0
				},
				revealAnim: elem.getAttribute("reveal") || elem.getAttribute("data-reveal") || settings.animation,
				revealDelay: elem.getAttribute("reveal-delay") || elem.getAttribute("data-reveal-delay") || settings.delay
			});			
		});

		return elems;		
	};

	var sortElems = function (elems) {
		elems.sort( function (a, b) {
			if (a.position.top > b.position.top) {
				return 1;
			}
			if (a.position.top < b.position.top) {
				return -1;
			}
			return 0;
		});

		return elems;
	};

	var elemInBufferZone = function (elem, direction) {
		//Determines if an elem is within the buffer zone based on the scroll direction 

	};

	var animateElem = function (elem) {
		setTimeout(function() {
			elem.elem.style.visibility = '';			
			elem.elem.classList.add(elem.revealAnim);										
		}, elem.revealDelay);		
	};
	
    window.peekaboo = function (input1, input2) {
		var r = {},			
			eventTimeout,
			options = {},
			eventThrottler = function (event) {
				console.log("eventThrottler");
			if ( !eventTimeout ) {
				eventTimeout = setTimeout(function() {
					eventTimeout = null;					
					
					if ( event.type === 'resize' ) {
						console.log("resize");
						r.setDistances();
						r.update(false, false);					
					}
					else { //Scrolling
						console.log("Scrolling");
						r.update(false, true);					
					}
									
				}, 66);
			}
		};

		if (typeof input1 === "object") {
			options = input1;
		} else if (typeof input1 === "string") {
			if (typeof input2 === "object") {
				options = input2;
			}
			options.selector = input1;
		}		

		r.setDistances = function () {						
			var windowScrollPosition = getWindowScrollPos();
			globals.windowDimensions = {
				width: document.documentElement.clientWidth || document.body.clientWidth,
				height: document.documentElement.clientHeight || document.body.clientHeight
			};
			
			console.log("windowScrollPosition.top", windowScrollPosition.top);
			console.log("settings.buffer", settings.buffer);
			globals.bufferZone.top = windowScrollPosition.top + settings.buffer;
			globals.bufferZone.bottom = windowScrollPosition.top + globals.windowDimensions.height - settings.buffer;

			window.scrollTo(0, 0);
			forEach(this.elems, function (elem) {					
				elem.position = getPosition(elem.elem);							
			});

			window.scrollTo(windowScrollPosition.left, windowScrollPosition.top);
					
			this.elems = sortElems(this.elems);			
		};	
		
		r.init = function () {
			console.log("*** INIT ***");
			
			//Initialize scroll position
			globals.scrollPosition.now = globals.scrollPosition.before = getWindowScrollPos();
						
			//Gets elements
			r.elems = getElems(settings.selector);
			if (r.elems.length === 0 ) {
				console.info("No elements matched the selector '" + settings.selector + "'.");
				return;	
			}
			//Sets distances on all elements
			r.setDistances();
   			
			//Sets inital values for data-in-view and data-animate-on-peek
			//Animates items in view if settings.animateOnInit
			///settings.resetAnimations
			var bufferZoneTop = globals.scrollPosition.now.top + settings.buffer,
				bufferZoneBottom = globals.scrollPosition.now.top + globals.windowDimensions.height - settings.buffer;
			
			console.log("bufferZone.top", globals.bufferZone.top, "bufferZone.bottom", globals.bufferZone.bottom);
			forEach(this.elems, function (elem) {
				//Is item in view?
				console.log("elem top", elem.position.top, "elem bottom", elem.position.bottom, elem.elem);
				console.log("above & below", elem.position.top >= globals.bufferZone.top && elem.position.top <= globals.bufferZone.bottom);
				console.log("bottom in view", elem.position.bottom >= globals.bufferZone.top && elem.position.bottom <= globals.bufferZone.bottom);
				console.log("top in view", elem.position.top <= globals.bufferZone.top && elem.position.bottom >= globals.bufferZone.bottom);
				if ((elem.position.top >= globals.bufferZone.top && elem.position.top <= globals.bufferZone.bottom) ||
					(elem.position.bottom >= globals.bufferZone.top && elem.position.bottom <= globals.bufferZone.bottom) ||
					(elem.position.top <= globals.bufferZone.top && elem.position.bottom >= globals.bufferZone.bottom)) 
				{
					elem.elem.dataset.inView = "true";

					if (settings.animateOnInit) {
						console.log("animate on init");
						animateElem(elem);						
					}
				} else {
					elem.elem.dataset.inView = "false";
				}
				
				// else {
				// 	elem.elem.dataset.inView = "false";

				// 	//if above fold
				// 		//If !resetAnimations, set data-animate-on-peek to false for all items above the fold
				// 		if (settings.resetAnimations) {
				// 			elem.elem.dataset.animateOnPeek = "true";
				// 		} else {
				// 			elem.elem.dataset.animateOnPeek = "false";
				// 		}

				// 	//if below fold
				// 		//elem.elem.dataset.animateOnPeek = "true";
					
				// }
				// We operate with two different custom data attributes
				// - data-in-view: Indicates if an item is within the buffer zone or not
				// - data-animate-on-peek: Indicates if the item will be animated when scrolled into view
				
				// Reset animations === true
				// - data-animate-on-peek will always be true								
				
				// Reset animations === false
				// - data-animate-on-peek will be false for all items that have already been animated and items that were above the fold on load			
				





				// if (elem.position.top <= (scrollPosition.now.top + windowDimensions.height - settings.buffer)) {					
				// 	setTimeout(function() {
				// 		elem.elem.style.visibility = '';
						
				// 			elem.elem.classList.add(elem.revealAnim);
													
				// 	}, elem.revealDelay);
										
				// 	elem.elem.dataset.inView = "true";					
					
				// 	settings.callback({
				// 		elem: elem.elem,
				// 		inView: true
				// 	});					
				// }				
			});
		};

		r.update = function (scrolling) {
			console.log("*** UPDATE ***");
			var windowScrollPosition = getWindowScrollPos();
			globals.windowDimensions = {
				width: document.documentElement.clientWidth || document.body.clientWidth,
				height: document.documentElement.clientHeight || document.body.clientHeight
			};			
			globals.bufferZone.top = windowScrollPosition.top + settings.buffer;
			globals.bufferZone.bottom = windowScrollPosition.top + globals.windowDimensions.height - settings.buffer;

			globals.scrollPosition.before = globals.scrollPosition.now;
			globals.scrollPosition.now = getWindowScrollPos();
			var scrollDirection = scrolling ? (globals.scrollPosition.before.top < globals.scrollPosition.now.top ? "down" : "up") : null;
			
			forEach(this.elems, function (elem) {
				// ANIMATION FLOW
				// We operate with two different custom data attributes
				// - data-in-view: Indicates if an item is within the buffer zone or not
				// - data-animate-on-peek: Indicates if the item will be animated when scrolled into view
				
				// Reset animations === true
				// - data-animate-on-peek will always be true								
				
				// Reset animations === false
				// - data-animate-on-peek will be false for all items that have already been animated and items that were above the fold on load			
				
				if ((elem.position.top >= globals.bufferZone.top && elem.position.top <= globals.bufferZone.bottom) ||
					(elem.position.bottom >= globals.bufferZone.top && elem.position.bottom <= globals.bufferZone.bottom) ||
					(elem.position.top <= globals.bufferZone.top && elem.position.bottom >= globals.bufferZone.bottom)) 
				{
					elem.elem.dataset.inView = "true";
					setTimeout(function() {
						elem.elem.style.visibility = '';						
						elem.elem.classList.add(elem.revealAnim);													
					}, elem.revealDelay);					
				} else {
					elem.elem.dataset.inView = "false";
				}

				// if (elem.position.top <= (scrollPosition.now.top + windowDimensions.height - settings.buffer)) {					
				// 	setTimeout(function() {
				// 		elem.elem.style.visibility = '';						
				// 		elem.elem.classList.add(elem.revealAnim);													
				// 	}, elem.revealDelay);
										
				// 	elem.elem.dataset.inView = "true";					
					
				// 	settings.callback({
				// 		elem: elem.elem,
				// 		inView: true
				// 	});					
				// }				
			});			
		};

				

    	// Merge default and user options
		settings = extend( defaults, options );

    	
   		r.init();		
   				
		// Listen for events
		window.addEventListener('resize', eventThrottler, false);
		window.addEventListener('scroll', eventThrottler, false);

		return r;
	};	

	peekaboo.noConflict = function() {
		window.peekaboo = _peekaboo;
        return this;
	};	

})(this, document);