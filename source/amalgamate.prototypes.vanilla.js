(function () {
	
	"use strict";

	
	/* ------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------ */
	/* Vanilla JS prototypes.
	/* ------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------ */

	/* 
		Prototype the remove method onto array.  This method will remove 
		an element from anywhere in an array.  However, this method cannot 
		be used in a loop as removing elements will invalidate the array length.
	*/
	Array.prototype.remove||(Array.prototype.remove=function(t){switch(this.indexOf(t)){case-1:break;case 0:this.shift();break;case this.length-1:this.pop();break;default:this[this.indexOf(t)]=this[this.length-1],this.pop()}});
	
	/* 
		Prototype the getElementsByClassName method.
	*/
	document.getElementsByClassName||(document.getElementsByClassName=function(e){"use strict";var t,l,s,a=document,n=[];if(a.querySelectorAll)return a.querySelectorAll("."+e);if(a.evaluate)for(l=".//*[contains(concat(' ', @class, ' '), ' "+e+" ')]",t=a.evaluate(l,a,null,0,null);s=t.iterateNext();)n.push(s);else for(t=a.getElementsByTagName("*"),l=new RegExp("(^|\\s)"+e+"(\\s|$)"),s=0;s<t.length;s++)l.test(t[s].className)&&n.push(t[s]);return n});

	/*
		Prototype the Date.now method.
	*/
	Date.now||(Date.now=function(){return(new Date).getTime()});
	
	/*
		Prototype the String.trim method.
	*/
	String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")});
	
	/*
		Prototype the String.replaceAll method. 
		
		The standard String.replace method only replaces the first instance it finds
		while the String.replaceAll method replace all instance of the search string.
	*/
	String.prototype.replaceAll=function(e,r){"use strict";return this.replace(new RegExp(e.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1"),"g"),r)};
	
	/*
		Function : bind, 
		Array : filter, 
		Array : indexOf, 
		Object : defineProperties
		Document : querySelector
		Document : querySelectorAll
	*/	
	Function.prototype.bind||(Function.prototype.bind=function(t){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var e=Array.prototype.slice.call(arguments,1),r=this,n=function(){},o=function(){return r.apply(this instanceof n&&t?this:t,e.concat(Array.prototype.slice.call(arguments)))};return n.prototype=this.prototype,o.prototype=new n,o}),Array.prototype.filter||(Array.prototype.filter=function(t){if(void 0===this||null===this)throw new TypeError;var e=Object(this),r=e.length>>>0;if("function"!=typeof t)throw new TypeError;for(var n=[],o=arguments.length>=2?arguments[1]:void 0,i=0;i<r;i++)if(i in e){var l=e[i];t.call(o,l,i,e)&&n.push(l)}return n}),Array.prototype.indexOf||(Array.prototype.indexOf=function(t,e){var r;if(null===this)throw new TypeError('"this" is null or not defined');var n=Object(this),o=n.length>>>0;if(0===o)return-1;var i=0|e;if(i>=o)return-1;for(r=Math.max(i>=0?i:o-Math.abs(i),0);r<o;){if(r in n&&n[r]===t)return r;r++}return-1}),document.querySelectorAll||(document.querySelectorAll=function(t){var e,r=document.createElement("style"),n=[];for(document.documentElement.firstChild.appendChild(r),document._qsa=[],r.styleSheet.cssText=t+"{x-qsa:expression(document._qsa && document._qsa.push(this))}",window.scrollBy(0,0),r.parentNode.removeChild(r);document._qsa.length;)(e=document._qsa.shift()).style.removeAttribute("x-qsa"),n.push(e);return document._qsa=null,n}),document.querySelector||(document.querySelector=function(t){var e=document.querySelectorAll(t);return e.length?e[0]:null});

	
})();