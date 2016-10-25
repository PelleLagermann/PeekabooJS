# scrollaboo
Small easy to use and flexible vanilla JS script for adding CSS3 animations to HTML elements as they are scrolled into view.

## Installation
To install simply add the `scrollaboo.js` file just before your closing `</body>` tag. 

### Prerequisites
Scrollaboo ships with Daniel Eden's ([daneden](https://github.com/daneden)) awesome [animate.css](https://github.com/daneden/animate.css "animate.css").
If needed you can easily use other animations though. Scrollaboo simply adds a CSS class to an element, when the element is ready to be animated.

## Getting Started
    //Default settings - By default scrollaboo will animate all elements with a data-reveal attribute 
    var boo = scrollaboo()
    
    //Custom selector
    var boo = scrollaboo("h1, .foo")
 
    //Custom settings
    scrollaboo({ 
        selector:       "h1, .foo",
        buffer:         250 
    })

## scrollaboo attributes
    //Default selector
    data-reveal

    //Choose animation
    data-reveal="zoomIn"            //The value of [data-reveal] will be added to the element as a CSS class

    //Animation delay 
    data-reveal-delay="200"         //Delay before the element will be animated. If multiple elements on a row are to be animated, adding a small delay to some of them, can create a nice effect.

## Options
    selector: '[data-reveal]',		//Selector for elems		
	buffer: 0,						//Number of pixels above the bottom of the screen before animating
	delay: 0,						//Delay before animating
	animation: "slideInUp"			//Default animation 

## Methods
