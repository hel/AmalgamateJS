/*
	DESCRIPTION: This file contains all the directives used to build and work with
					the form elements.
*/

/*jshint multistr: true */

angular.module('amalgamate.directives.forms', [])

	.filter('startsWithDD', [function(){
		
		"use strict";
		
		return function(options, value){
			
			if(value.length > 0){
				
				for(var i = 0; i < options.length; i++){
					
					if(
						options[i].label.slice(0, value.length).toLowerCase() === value.toLowerCase() && 
						(
							options[i].value.length > 0 ||
							options[i].value > 0
						)
					){
						return options[i];
					}
				}
			}
			
			return false;
		};
	}])

	.directive('xgRadio',function(){
	
		"use strict";
	
		return{
			restrict:'E',
			replace:true,
			scope:{
				name : '@',
				options : '=',
				option : '=',
				xgChange : '='
			},
			controller:function($scope){
				$scope.set = function(opt){
					$scope.option = opt;
				};
			},
			template:
				'<label class="xg radio" ng-repeat="opt in options">'+
					'<input type="radio" name="{{name}}" ng-value="opt.value" ng-model="option" ng-checked="option === opt.value" ng-click="set(opt.value)">'+
					'<i></i>{{opt.label}}'+
				'</label>'
		};
	})

	.directive('xgCheckbox',function(){
	
		"use strict";
	
		return{
			restrict:'E',
			replace:true,
			scope:{
				name : '@',
				options : '=',
				xgChange : '&'
			},
			template:
				'<label class="xg checkbox" ng-repeat="opt in options">'+
					'<input type="checkbox" name="{{name}}" ng-model="opt.value" ng-checked="opt.value" ng-change="xgChange();">'+
					'<i></i>{{opt.label}}'+
				'</label>'
		};
	})

	.directive('xgInput',function(){
	
		"use strict";
	
		return {
			restrict: 'E',
			replace:true,
			scope:{
				name:'@',
				placeholder:'@',
				required:'@',
				value:'@',
				label:'@',
				blur:'&',
				model:'='
			},
			template:
				'<div class="form-group" style="float:left;width:100%;">'+
					'<label for="{{name}}" ng-if="label.length > 0" ng-class="{rq : required !== undefined}">{{label}}:</label>'+
					'<input normalize-data-type id="{{name}}" type="text" class="xg override form-control" ng-blur="blur()" ng-model="model" name="{{name}}" placeholder="{{placeholder}}" value="{{value}}">'+
				'</div>'
		};	
	})

	.directive('xgTextarea',function(){
	
		"use strict";
	
		return {
			restrict: 'E',
			replace:true,
			scope:{
				name:'@',
				required:'@',
				value:'@',
				label:'@',
				model:'='
			},
			template:
				'<div class="form-group" style="float:left;width:100%;">'+
					'<label for="{{name}}" ng-if="label.length > 0" ng-class="{rq : required !== undefined}">{{label}}:</label>'+
					'<textarea class="xg override form-control" rows="5" id="{{name}}" ng-model="model" name="{{name}}"></textarea>'+
				'</div>'
		};	
	})

	.directive('xgSelect',['$timeout', function($timeout){
	
		"use strict";
	
		return {
			restrict: 'E',
			replace:true,
			scope:{
				label:'@',
				name:'@',
				required:'@',
				options:'=',
				option:'=',
				value:'=',
				xgClick:'&',
				xgDisabled:'&'
			},
			controller:function($scope, $filter){
				
				$scope.keyString = '';
				
				$scope.initial = [{label : 'Please Select...', value : ''}];
				
				$scope.selections = $scope.initial;
				
				$scope.selected = $scope.selections[0];
				
				/*
				
				*/
				$scope.set = function(opt){

					$scope.selected = opt;
					
					$scope.option = opt;
					
					$scope.value = opt.value;
					
					$scope.validate();

					$timeout(function(){
						$scope.xgClick({selected:opt});
						$('#'+$scope.name).trigger('change');
					});
					
				};
				
				/*
					If there isn't an override disable method, create the
					default method.
				*/
				if($scope.xgDisabled() === undefined){
					$scope.xgDisabled = function(){
						return (
							$scope.selections.length === 1 && 
							(
								$scope.selected.value === -1 || 
								$scope.selected.value.length === 0
							)
						);
					};					
				}
				
				/*
					Set the active class on the active list item.
				*/
				$scope.active = function(opt){
					return ($scope.selected && opt.value == $scope.selected.value);
				};
				
				/*
					
				*/
				$scope.display = function(opt){
					return (opt.value !== '');
				};
				
				/*
					Removes the default "Please Select..." option from the
					dropdown.  Once selected, the dropdown cannot be unselected.
				*/
				$scope.validate = function(){
					if(
						$scope.selected.value !== -1 && 
						$scope.selections[0].value === -1
					){
						$scope.selections.shift();
					}					
				};
				
				/*
					Set the scroll position of the dropdown to the selected 
					item.  
					
					NOTE: We have to open the dropdown to get the scroll position
							so we open it, set the position, and close it.  This
							should happen so fast the user shouldn't notice it happen.
				*/
				$scope.position = function(){
					
					// Get the active list item.
					var active = $('[name="'+$scope.name+'"] li.active')[0];
					
					// There is an active list item.
					if(active){
						// Set the scroll position.
						active.parentNode.scrollTop = active.offsetTop - 5;
					}
				};
				
				/*
					The keyup method searches and sets the selected option
					based on what the user types in when the dropdown is
					in focus.
				*/
				$scope.keyup = function($event){

					// The keys are only required for IE8.
					var keys = {
						65:'a',66:'b',67:'c',68:'d',69:'e',70:'f',71:'g',72:'h',73:'i',74:'j',
						75:'k',76:'l',77:'m',78:'n',79:'o',80:'p',81:'q',82:'r',83:'s',84:'t',
						85:'u',86:'v',87:'w',88:'x',89:'y',90:'z',
						
						8:'Backspace',46:'Delete'
					}
					
					var key = $event.originalEvent.key;
					
					// This will be undefined in IE8.
					if(key === undefined){
						key = keys[$event.which];
					}
					
					if(key && key.length === 1){
						$scope.keyString += key;
					}
					
					else{
						if(key === 'Backspace' || key === 'Delete'){
							$scope.keyString = '';
						}
					}
					
					var search = function(){
						
						var option = $filter('startsWithDD')($scope.options, $scope.keyString);

						if(option !== false){
							$scope.set(option);
						}
						
						else{
							
							// The key string has more than one character.  If the string
							// was only a single character and wasn't found, there is no
							// reason to continue recursively searching.  Otherwise, we
							// want to grab the last character entered and start a new search
							// with that character.
							if($scope.keyString.length > 1){
								
								// Get the last character entered.
								$scope.keyString = $scope.keyString.slice(-1);
								
								// Start the search over.
								search();								
							}
						}						
					};
					
					if(
						// Search string has at least 1 character AND...
						$scope.keyString.length > 0 &&
						// Key pressed is a letter. (65 - 90)
						$event.which > 64 && $event.which < 91
					){
						search();
					}
				};
				
				$scope.validate();

			},
			template:
				'<div class="xg select auto-width dropdown form-group">'+
					'<label for="{{name}}" ng-if="label.length > 0" ng-class="{rq : required !== undefined}">{{label}}:</label>'+
					'<input type="hidden" id="{{name}}" name="{{name}}" value="{{selected.value}}">'+
					'<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" ng-class="{disabled:xgDisabled()}" ng-keyup="keyup($event)" ng-click="position();">'+
						'{{selected.label}}'+
						'<span class="caret"></span>'+
					'</button>'+
					'<ul class="dropdown-menu">'+
						'<li ng-repeat="opt in selections" ng-click="set(opt);" ng-class="{active:active(opt)}" ng-if="display(opt)"><a>{{opt.label}}</a></li>'+
					'</ul>'+
				'</div>',
			link:function(scope){
				
				scope.$watch('options', function(){
					$timeout(function(){
						if(scope.options !== undefined){
							scope.selections = scope.initial.concat(scope.options);
							scope.selected = scope.selections[0];
						}
					});
				});
				
				scope.$watch('option', function(){
					$timeout(function(){
						if(scope.option !== undefined){
							scope.selected = scope.option;
							scope.value = scope.selected.value;
						}
						
						scope.position();
					});
				});
				
			}
		};	
	}])

	.directive('normalizeDataType', function(){
	
		"use strict";
	
		return {
			require: 'ngModel',
			link: function(scope, ele, attr, ctrl){
				ctrl.$parsers.unshift(function(viewValue){
					return (!isNaN(viewValue - 0) ? viewValue - 0 : viewValue);
				});
			}
		};
	});
