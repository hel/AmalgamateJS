(function ($) {
	
	"use strict";
	
	/*
		Add getStyles method to jQuery.  This method will get all the styles,
		including the stylesheet styles, and add them to the element.  This 
		is important for some of the methods to be able to make decisions based
		on styles associated with the element.
	*/
	$.fn.getStyles=function(){var e,t=this.get(0),r={};if(window.getComputedStyle){for(var n=function(e,t){return t.toUpperCase()},u=0,o=(e=window.getComputedStyle(t,null)).length;u<o;u++){var i=(a=e[u]).replace(/\-([a-z])/g,n),l=e.getPropertyValue(a);r[i]=l}return r}if(e=t.currentStyle){for(var a in e)r[a]=e[a];return r}return this.css()};


	
})(jQuery);