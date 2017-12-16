

var amalgamate = {
	
	/*
		Merges two objects together. Existing keys are overritten unless
		those keys are in the exclusion list.
	*/
    merge: function(root, branch, exclude) {
		
		"use strict";
		
        for (var key in branch) {
            if (
                !exclude ||
                exclude.length === 0 ||
                exclude.indexOf(key) === -1
            ) {
                root[key] = branch[key];
            }
        }
    },
    bool: function(num) {
		
		"use strict";
		
        switch (parseInt(num)) {
            case 0:
                return false;
            case 1:
                return true;
        }
    },
    format: function(obj) {
		
		"use strict";
		
        for (var key in obj) {
			if (typeof obj[key] === 'object'){
				obj[key] = this.format(obj[key]);
			}
			else{
				if (!isNaN(obj[key] - 0)) {
					obj[key] = obj[key] - 0;
				}				
			}
        }

        return obj;
    },
	trigger: function(element, eventName){
		
		"use strict";
		
		var event;
	
		if (document.createEvent) {
			event = document.createEvent("HTMLEvents");
			event.initEvent(eventName, true, true);
		} 
		
		else {
			event = document.createEventObject();
			event.eventType = eventName;
		}

		event.eventName = eventName;
	
		if (document.createEvent){
			element.dispatchEvent(event);
		}
		
		else {
	
			if (eventName === "resize") {
				var savedWidth=document.documentElement.style.width;
				document.documentElement.style.width="99.999999%";
				setTimeout(function() { 
					document.documentElement.style.width = savedWidth;
				}, 5);
			} 
			
			else{
				element.fireEvent("on" + event.eventType, event);
			}
		}		
	},
	
	fa : {
		
		selectors : [],
		
		search : function(cssClass){
			
			selector = '.'+cssClass+':before';
			
			for(var i = 0; i < this.selectors.length; i++){
				if(this.selectors[i].selector === selector){
					return this.selectors[i].styles;
				}
			}

			return null;
			
		},
		
		init : function() {
		
			var css = document.styleSheets;

			if(css.length > this.selectors.length){

				for(var i = 0; i < css.length; i++){

					this.selectors[i] = [];

					var classes = document.styleSheets[i].rules || document.styleSheets[i].cssRules;

					var href = document.styleSheets[i].href;

					if(classes){

						for (var j = 0; j < classes.length; j++) {

							if(classes[j].selectorText){

								var variants = classes[j].selectorText.replace(/\s*([>])\s*/g, '$1');

								variants = variants.split(', ');

								for(var k = 0; k < variants.length; k++){
								
									if(variants[k].substring(0, 4) === '.fa-'){

										var styles = {},
											before = false;

										var text = (classes[j].cssText) ? classes[j].cssText : classes[j].style.cssText;

										// Separate selector text from rules.
										var processing = text.split('{');

										if(processing.length > 1){
											// Remove last curly brace.
											processing = processing[1].substr(0, processing[1].length - 1);
										}
										else{
											processing = processing[0];
										}
										// Separate rules.
										processing = processing.split('; ');

										// There was a semicolon at the end of the last split
										// so it created an empty array element at the end so
										// we need to remove it.
										if(processing[processing.length - 1].trim().length === 0){processing.pop();}

										// Separate the individual rules from their values.
										for(var h = 0; h < processing.length; h++){
											processing[h] = processing[h].split(':');
										}

										// Create the style object. We have to trim the keys
										// and values because they have an extra whitespace
										// at the beginning as a result of how the css text
										// is structured.
										for(h = 0; h < processing.length; h++){

											var key = processing[h][0]
															.trim()
															.toLowerCase();

											var value = processing[h][1]
															.replaceAll("'", '')
															.replaceAll('"', '')
															.replaceAll(' ', '')
															.trim()
															.toLowerCase();

											styles[key] = value;
										}

										if(styles.content && styles.content.length > 1){
											this.selectors[this.selectors.length] = {
												selector : variants[k],
												styles : styles
											};
										}

									}
								}
							}
						}
					}
				}
			}
		}
		
		
	},
	
	registered : {
		list : [],
		length : 0,
		is : function(){
			
		},
		added : function(nodes){
			
			"use strict";
			
			var added = [],
				elements = nodes ? nodes : this.dom();

			for(var i = 0; i < elements.length; i++){
				
				if(!elements[i].xg){
					elements[i].xg = this.length;
					added.push(elements[i]);
					this.length++;
				}
	
			}
			
			return added;

		},
		removed : function(){
			
			"use strict";
			
			var removed = [];

			for(var i = 0; i < this.list.length; i++){
				
				if(!this.list[i]){
					removed.push(this.list[i]);
				}

			}
			
			return removed;
		},
		add : function(nodes){
			
			"use strict";
			
			var added = this.added(nodes);

			this.list = this.list.concat(added);
			
			return added;
			
		},
		remove : function(){
			
			"use strict";
			
			var removed = this.removed();
			
			for(var i = 0; i < removed.length; i++){
				this.list.remove(removed[i]);
			}			
			
			return removed;
		},
		dom : function(){
			
			"use strict";
			
			var elements = [],
				main = document.body;
			
			var loop = function(main) {

				if(main){
					do {
						if(parseInt(main.nodeType) === 1){
							elements.push(main);
						}
						if(main.hasChildNodes()){
							loop(main.firstChild);
						}
					}
					while (main = main.nextSibling);					
				}

			};
			
			loop(main);
			
			return elements;
		}
	},
	
	// Search nodes starting at event point.
	scan : function(nodes){
		
		"use strict";

		// There are nodes to process.
		if(nodes.length > 0){
			
			// Process all nodes in the node list.
			for(var i = 0; i < nodes.length; i++){
				
				switch(nodes[i].nodeName){
					case '#comment':
					case 'HTML':
					case 'HEAD':
					case 'TITLE':
					case 'SCRIPT':
					case 'STYLE':
					case 'LINK':
					case 'META':
						break;

					default:
						
						this.init.all(nodes[i]);
						
						// Process nodes for Stretch and
						// Ellipsis classes.
						this.SE(nodes[i]);
						
						break;
				}	
					
			}
		}			
	},
	
	
	/* --------------------------------------------------------------------- */
	/* --------------------------------------------------------------------- */
	/* --------------------------------------------------------------------- */
	
	// Stretch and Ellipsis class processing.
	SE : function(node){
		
		"use strict";
		
		// Get the nodes classes.
		var classes = node.classList;
		
		// The node has classes.
		if(classes){
			
			// Init local vars.
			var e = false, 
				s = false;
			
			// Search the nodes classes for the stretch
			// and ellipsis classes.
			for(var j = 0; j < classes.length; j++){
				if(classes[j] === 'ellipsis'){e = true;}
				if(classes[j] === 'stretch'){s = true;}
			}

			// The ellipsis or stretch class was found.
			if(e || s){
				
				// Get the parent node.
				var parent = node.parentNode;
				
				// Save the padding so we can re-add it after
				// the width calculation is done.
				//var left = parent.style.paddingLeft;
				//var right = parent.style.paddingRight;

				// Clear parents padding so we can ensure 
				// the width of the node is the same as it's
				// parent.
				parent.style.paddingLeft = '0px';
				parent.style.paddingRight = '0px';
		
				// This timeout gives Angular and other
				// frameworks time to parse their templates.
				setTimeout(function(){
					
					// Save content.
					var html = node.innerHTML;

					// Clear the nodes content so we can get the 
					// parent nodes actual width.  This is necessary
					// auto sized parents.
					//node.innerHTML = '';

					// This timeout gives time for the browser to
					// adjust the width of the parent without content
					// or padding.
					setTimeout(function(){
						
						// Set the nodes width to the parent nodes width.
						node.style.width = node.parentNode.clientWidth+'px';
						
						// Add the content back to the node.
						//node.innerHTML = html;	
						
						node.title = html;
						
						// Set the left and right padding of the parent
						// back to it's original values.
						// Commented out for now until I can figure out
						// how to add css style properties.
						//parent.style.paddingLeft = '';
						//parent.style.paddingRight = '';

					}, 50);
				}, 50);
			}
		}
	},
	
	/* ------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------ */
	/* Initialization object.
	/* ------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------ */
	
	/*
		Initializes all the fixes for all the DOM components.  In many cases 
		things do not work properly because of poorly handled implementations
		between browsers or expected behavior that doesn't exist.  So this
		will add those behaviors when the page is loaded or nodes are added
		to the DOM.
	*/
	init : {
		
		// Processes all element types for adjustments.
		all : function(el){
			
			"use strict";

			var tag = ['I'];
			
			if(
				window.PIE && 
				tag.indexOf(el.tagName) !== -1
			){
				window.PIE.attach(el);
			}
			
			// Element is an input tag.
			if(el.tagName === 'INPUT'){
				
				// Initialize radio buttons for x-radio.
				if(
					el.type === 'radio' &&
					$(el).parent().is('.xg.radio')
				){
					this.radio(el);
				}

				// Initialize checkboxes for x-checkbox.
				if(
					el.type === 'checkbox' &&
					$(el).parent().is('.xg.checkbox')
				){
					this.checkbox(el);
				}
			}
			
			// Element is a button tag for an x-dropdown
			// being used as a select list.
			if(
				el.tagName === 'BUTTON' && 
				$(el).hasClass('dropdown-toggle') &&
				$(el).parent().is('.xg.dropdown.select')
			){
				this.dropdown(el);
			}
			
			// Element is a list tag for an x-dropdown
			// being used as a select list option.
			if(
				el.tagName === 'LI' &&
				$(el).parent().parent().is('.xg.dropdown.select')
			){
				this.option(el);
			}
			
			if($(el).is('.modal')){
				this.modal(el);
			}
			
			if($('html').hasClass('no-boxsizing') && $(el).is('.fa')){
				this.fa(el);				
			}
			
		},
		
		fa : function(el){
			
			"use strict";
			
			var classlist = $(el).attr('class').split(/\s+/);

			for(var i = 0; i < classlist.length; i++){

				if(classlist[i].substring(0, 3) === 'fa-'){

					var styles = amalgamate.fa.search(classlist[i]);

					if(styles !== null){
						if(styles.content){
							$(el).html(styles.content);
						}
					}

				}
			}
		},
		
		modal : function(el){
			
			"use strict";
			
			$(el).on('hidden.bs.modal', function () {
				
			})
			
			$(el).on('shown.bs.modal', function () {
				
				var main = el;

				var loop = function(main) {

					if(main){
						do {
							if(parseInt(main.nodeType) === 1){
								amalgamate.scan(main);
							}
							if(main.hasChildNodes()){
								loop(main.firstChild);
							}
						}
						while (main = main.nextSibling);					
					}

				};

				loop(main);
			})
			
		},
		
		// Process a select list option for an x-dropdown.
		option : function(el){
			
			"use strict";

			/*
			
			*/
			el.onclick = function(){
				el.parentNode.scrollTop = el.offsetTop - 5;
			};
		},
		
		// Process a select list for an x-dropdown.
		dropdown : function(el){
			
			"use strict";
			
			/*
				Fixes the bootstrap dropdowns by adding a scroll position to the dropdown
				for the selected item. When you click on the dropdown it will scroll the
				list to the selected item.  This is only for x-dropdowns with the select
				class.
				
				Using the dropdowns for select lists is necessary for IE8.  In IE8 the select
				lists are too glitchy and adding styles with libraries like CSS3Pie cause
				that glitchy behavior to be amplified.  So we're just going to use these
				bootstrap dropdowns as select lists to avoid the issues.
			*/
			el.onclick = function(){
				
				// We cannot determine the offsetTop property of the active list item until 
				// the container UL is shown. A zero timeout gives it a chance to be shown.
				setTimeout(function(){
					
					// Get the first active list item.  There should only be one but
					// the querySelectorAll method returns an array.
					var active = (el.parentNode.querySelectorAll('li.active'))[0];
					
					// Set the scroll position to the active list items offsetTop
					// position.  We're subtracting 5 here to account for the 5px
					// of margin at the top of the UL container.
					if(active){
						active.parentNode.scrollTop = active.offsetTop - 5;
					}
					
				}, 0);
			};	
		},
		
		// Process a checkbox.
		checkbox : function(e){
			
			"use strict";
			
			/*
				Fixes the checked attribute by setting or unsetting it
				based on the clicked element.  This will correspond to 
				the checked property on the element.  
				
				This is necessary because the browsers don't usually add
				the checked attribute onto the tag and it's needed for older
				IE browsers (especially IE8).
				
				Also, the cover for the radio uses an :after pseudo class. IE8 
				does not always refresh after attribute updates so we're 
				forcing a redraw of the element by setting the classname to
				itself.
				
			*/
			e.onclick = function(){
				
				// Get this radio buttons radio group.
				var checkboxes = document.querySelectorAll('[name="'+e.name+'"]');

				var afters = Array.prototype.slice.call(
					document.querySelectorAll('[name="'+e.name+'"]+i'), 0
				);
				
				afters = afters.concat(
					Array.prototype.slice.call(
						document.querySelectorAll('[name="'+e.name+'"]+css3pie+i'), 0
					)
				);
				
				// Loop through radio group applying fixes to the radio buttons.
				for(var i = 0; i < checkboxes.length; i++){
				
					if(e === checkboxes[i]){
						
						// This radio is the one clicked.
						if(e.checked === true){

							// Create & Set checked attribute on tag.
							checkboxes[i].setAttribute('checked', 'checked');
						}

						// Not the clicked radio.
						else{

							// Remove checked attribute.
							checkboxes[i].removeAttribute('checked');
						}
						
						if(afters[i]){
							afters[i].className = afters[i].className;
						}
					}
					
				}
			};
		},
		
		// Process a radio button.
		radio : function(e){
			
			"use strict";
			
			/*
				Fixes the checked attribute by setting or unsetting it
				based on the clicked element.  This will correspond to 
				the checked property on the element.  
				
				This is necessary because the browsers don't usually add
				the checked attribute onto the tag and it's needed for older
				IE browsers (especially IE8).
				
				Also, the cover for the radio uses an :after pseudo class. IE8 
				does not always refresh after attribute updates so we're 
				forcing a redraw of the element by setting the classname to
				itself.
				
			*/
			e.onclick = function(){
				
				var afters = [];

				// Get this radio buttons radio group.
				var radios = document.querySelectorAll('[name="'+e.name+'"]');
				
				var lookup = document.querySelectorAll('[name="'+e.name+'"]+i');
				
				if(lookup.length > 0){
					for(var i = 0; i < lookup.length; i++){
						afters.push(lookup[i]);
					}
					//afters = afters.concat(Array.prototype.slice.call(lookup, 0));					
				}
				
				
				var lookup = document.querySelectorAll('[name="'+e.name+'"]+css3pie+i');
				
				if(lookup.length > 0){
					for(var i = 0; i < lookup.length; i++){
						afters.push(lookup[i]);
					}
					//afters = afters.concat(Array.prototype.slice.call(lookup, 0));
				}
				

				// Loop through radio group applying fixes to the radio buttons.
				for(var i = 0; i < radios.length; i++){
				
					// This radio is the one clicked.
					if(e === radios[i]){

						// Create & Set checked attribute on tag.
						radios[i].setAttribute('checked', 'checked');
					}
					
					// Not the clicked radio.
					else{

						// Remove checked attribute.
						radios[i].removeAttribute('checked');
					}
					
					if(afters[i]){
						afters[i].className = afters[i].className;
					}
					
				}
			};
		}
	}
};


$(document).ready(function(){
	
	"use strict";
	
	amalgamate.ready = false;

	// Internet Explorer less than 11.  This is a polling service that
	// runs every half second.  It's job is to monitor the DOM for changes.
	if(document.attachEvent){
		
		// This is only for IE7.
		if($('html').hasClass('no-boxsizing')){
			
			// Init font awesome support.
			amalgamate.fa.init();		
		}
		
		/*
			This process is only for IE7 and IE8 because those
			browsers do not support media queries.  Media queries
			will be used for other browsers.
		*/
		if($('html').hasClass('no-mediaqueries')){

			// Init the current breakpoint.
			var breakpoint = null;

			// Figure out the browsers breakpoint using the window width.
			var checkWidth = function(){

				// Get the window width.
				var w = parseInt($(window).width());

				// Add the breakpoint class to the body.
				var set = function(bp){

					// Breakpoint has changed.
					if(bp !== breakpoint){

						// Remove other breakpoints and add the new one.
						$('body')
							.removeClass('phone tablet xs sm md lg')
							.addClass(bp);
					}
				};

				// Phone breakpoint.
				if(w >= 0 && w < 640){set('phone');}

				// Tablet breakpoint.
				if(w >= 640 && w < 768){set('tablet');}

				// Extra-small desktop breakpoint.
				if(w >= 768 && w < 1024){set('xs');}

				// Small desktop breakpoint.
				if(w >= 1024 && w < 1280){set('sm');}

				// Medium desktop breakpoint.
				if(w >= 1280 && w < 1366){set('md');}

				// Large desktop breakpoint.
				if(w >= 1366 && w < 1920){set('lg');}

				// Extra-large desktop breakpoint.
				if(w >= 1920){set('xl');}

			};		

			// Initialize the breakpoint.
			checkWidth();

			// Recheck breakpoint when the browser is resized.
			$(window).resize(function(){ checkWidth(); });

		}
		
		var wait = false;
			
		setInterval(function(){

			if(wait === false){wait = true;}else{return;}
			
			var dom = amalgamate.registered.dom(),
				added = amalgamate.registered.add(dom),
				removed = amalgamate.registered.remove(dom);
			
			if(added.length > 0){ 
				amalgamate.scan(added);
			}
			
			if(removed.length > 0){
				
				for(var i = 0; i < removed.length; i++){
					
					if(window.PIE){
						window.PIE.detach(removed[i]);
					}
				}
				
			}

			wait = false;
			
			amalgamate.ready = true;
			
		}, 1000);
		
	}
	
	// All other browsers.
	else{
		
		document.addEventListener("DOMNodeInserted",function(event){
			var added = amalgamate.registered.add([event.target]);
			amalgamate.scan(added);
		},false);
		
		document.addEventListener("DOMNodeInsertedIntoDocument",function(event){
			var added = amalgamate.registered.add([event.target]);
			amalgamate.scan(added);
		},false);
		
		document.addEventListener("DOMNodeRemoved",function(){
			var removed = amalgamate.registered.remove();
		},false);
		
		document.addEventListener("DOMNodeRemovedFromDocument",function(){
			var removed = amalgamate.registered.remove();
		},false);	
	}
	
});