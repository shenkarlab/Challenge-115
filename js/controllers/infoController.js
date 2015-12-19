angular.module('app').controller('infoController',['$scope','$state', function($scope,$state) {
    $scope.greeting = 'Hola!';
    $scope.user.age = 25;
    $scope.user.children = 0;
    $scope.user.city = "תל אביב";
    var marital;


    /*
    * On Checkbox Changed
     */
    $(':checkbox').change(function() {
        console.log('value: ' + this.value);
        var gen = this.value;
        $scope.user.gender = gen;
        // do stuff here. It will fire on any checkbox change

    });

    /*
    * On Marital Picture Click
     */
    $scope.setMarital = function(event,income_marital) {
        if(marital!=null) {
            angular.element(marital).css("opacity",1);
        }
        marital = event.currentTarget;
        angular.element(event.currentTarget).css("opacity",0.5);
        $scope.user.marital = income_marital;
    }

    /*
    * Increment The Aage Parameter
     */
    $scope.increment = function() {
        $scope.user.age ++;
    }

    /*
     * Decrement The Aage Parameter
     */
    $scope.decrement = function() {
        $scope.user.age --;
    }

    /*
    * On Registration Form
     */
    $scope.registerForm = function() {
        angular.forEach($scope.user, function(value, key) {
            console.log('value: ' + value);
        });
        $state.transitionTo('supermarket');
    }
}]);
