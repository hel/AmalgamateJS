/*
	Amalgamate.stylesheet.js : v1.0.0
	
	**** NOT CURRENTLY BEING USED ****

	DESCRIPTION	: Get all the stylesheets within the document and create a multi-dimentional
					array containing all the selectors from the stylesheets and their css styles
					and values.  Then this large array is accessed to get the individual properties
					currently associated with each DOM object so we can access them later and perform
					other actions.
					
	NOTE		: This is only used for IE8.  In IE9+ we can use window.getComputedStyle(element) to 
					get the styles after they have been applied to the elements.  So basically,
					this is a way to extend the window.getComputedStyle(element) method for IE8.
					
	ISSUES		: While this works, it is only able to apply the styles in the order the stylesheets are
					present in the document but does not account for selector order or !important.
					
				: Has performance lag.  This is due to the fact that the attachStylesheet method runs
					accross the entire document every time a node is inserted.
					
				: Running the stylesheet method on page load will get all the stylesheets already in
					the head but it needs to be re-run when a new stylesheet is attached and it needs
					to be intellegent enough to detect a stylesheet attachment event if one exists.
					
				: After the on load event, the attachStylesheet method should only run across the new
					elements inserted.
					
				: There is currently no way to keep track of changes.  So if a class is added to a 
					DOM object, the stylesheet object is not updated.  Same for removal.
					
				: Currently the element styles are not monitored or added at all.
*/

(function () {
	
	"use strict";
	
	/*
		Get all the styles from the stylesheet associated with this class.  This isn't 
		being used yet and won't be able to stand alone.  We need a way to get all the
		styles, including those with unsupported pseudo attributes so we can handle
		them in browsers that don't support them.  The initial idea here is that we
		are parsing out the stylesheets for all the styles associated with the supplied
		class.  But it may be even better to look at the entire stylesheet so that we
		can create or modify styles with overrides that can be handled by older browsers.
		
		For example, IE8 does not support the :checked pseudo selector but it does support
		the [checked=checked] attribute which effectively does the same thing.  And since
		we are handling the checked attribute issue we should be able to right the css in
		a way that we are able to use the :checked pseudo selector and then translate that
		into a style that IE8 can read.  Namely the [checked=checked] attribute.  That way
		we can use all the HTML5 and CSS3 rules without writing the exceptions.  
		
		Another example of this is that we can make enhancements or fixes to things like 
		CSS3Pie where it only accepts rounded corners with the short-hand notation of 
		border-radius and not the long-hand notation of border-left-top-radius.  We should 
		be able to write long-hand or short-hand and have it translated both ways.
		
		This is going to be a complicated process that will take time to write but will act
		as a helper with these things.
	*/
	
	amalgamate.stylesheets = {
		
		selectors : [],
		pseudo : {
			before : []
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
										var key = processing[h][0].trim().toLowerCase();
										var value = processing[h][1].trim().toLowerCase();
										styles[key] = value;
									}

									var pseudo = variants[k].split(':');

									if(pseudo.length > 1){
										switch (true){
											case 
												pseudo[1].substring(0, 6) === 'before' && 
												styles['content'] && styles['content'].length > 3
											: before = true; break;
										}
									}

									this.selectors[i][this.selectors[i].length] = {
										selector : variants[k],
										styles : styles
									};

									if(before === true){
										this.pseudo.before[this.pseudo.before.length] = {
											selector : variants[k],
											styles : styles
										}
									}

								}
							}
						}
					}
				}
			}
		}
		
		
	}
	
	amalgamate.stylesheets.init();
	
	console.log(amalgamate.stylesheets.pseudo.before)
	
	/*
	var attachStylesheet = function(){
		
		// Loop through the stylesheet arrays.
		for(var i = 0; i < init.selectors.length; i++){

			// Loop through the selectors per stylesheet.
			for(var j = 0; j < init.selectors[i].length; j++){
				
				var elements = [];
				
				try{
					elements = document.querySelectorAll(init.selectors[i][j].selector);
				}
				catch(e){
					console.log(i, j, init.selectors[i][j].selector);
				}
				
				// There's at least one matching element.
				if(elements.length > 0){

					// Loop through the matching elements.
					for(var k = 0; k < elements.length; k++){

						// Loop through the selectors attributes.
						for(var key in init.selectors[i][j].styles){ 

							// The attribute is set.
							if(init.selectors[i][j].styles[key]){
								
								// Add the selector attribute to the element.  Additional matches
								// will be overwritten the same as styles are applied.
								elements[k].classes.addStyle(key, init.selectors[i][j].styles[key]);
							}
						}
					}
				}
			}
		}	
	};
	*/
	
})();