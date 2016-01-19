/******************************
 *
 * Bottom Parts directive
 *
 ******************************/
app.directive('bottomBar',function(){
    return {
        restrict: 'E',
        replace: true,
        scope:{
        },
        templateUrl: 'templates/bottom-bar.html',
        compile: function(tElem,attrs) {
            return function(scope,elem,attrs) {
            };
        }
    };
});