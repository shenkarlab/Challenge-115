var app = angular.module('app');

app.controller('statisticsController', ['$scope', '$http', '$state','statsFactory', function ($scope, $http, $state,statsFactory) {
    $scope.favoriteProducts = [];
    $scope.rejectedProducts = [];
    $scope.favoriteRelative = "חבר";
    $scope.favoriteOffer = "מבצע";
    $scope.carts = [];
    $scope.cities = [{id: 0,name:"bbb"}];
    $scope.children = -1;

    $scope.passedCount = 0;
    $scope.failedCount = 0;
    $scope.maleCount = 0;
    $scope.femaleCount = 0;

    $scope.predicate = '';

    $scope.filters = {
        "passed" : "",
        "sex" : "",
        "children" : "",
        "city" : ""
    };

    $scope.order = function(predicate) {
        $scope.predicate = predicate;
    };

    statsFactory.countPassed().then(function(succ) {
            $scope.passedCount = succ.data;
        }
    );
    statsFactory.countFailed().then(function(succ) {
            $scope.failedCount = succ.data;
        }
    );
    statsFactory.countMale().then(function(succ) {
            $scope.maleCount = succ.data;
        }
    );
    statsFactory.countFemale().then(function(succ) {
            $scope.femaleCount = succ.data;
        }
    );

    statsFactory.getPopularProducts().then(function(succ){
        $scope.favoriteProducts = succ.data.slice(0,5);
    });

    statsFactory.getMostRejectedProducts().then(function(succ){
        $scope.rejectedProducts = succ.data.slice(0,5);
    });

    statsFactory.getCarts().then(function(succ){
        $scope.carts = succ.data;
        console.log(succ.data);
    });

    function suggest_city(term) {
        var q = term.toLowerCase().trim();
        var results = [];

        // Find first 10 states that start with `term`.
        for (var i = 0; i < $scope.cities.length && results.length < 10; i++) {
            var city = $scope.cities[i];
            if (city.name.toLowerCase().indexOf(q) === 0)
                results.push({ label: city.name, value: city.name });
        }

        return results;
    }

    $scope.autocomplete_options = {
        suggest: suggest_city
    };

    $http.get('./misc/israel-cities.json').then(function(res){
        $scope.cities = res.data;
    });

    $scope.toggleSuccess = function(succ) {
        if (succ === 'passed') {
            if ($scope.filters.passed === true) {
                $scope.filters.passed = "";
            }
            else {
                $scope.filters.passed = true;
            }
        }
        else {
            if ($scope.filters.passed === false) {
                $scope.filters.passed = "";
            }
            else {
                $scope.filters.passed = false;
            }
        }
    };

    $scope.toggleSex = function(sex) {
        if (sex === 'male') {
            if ($scope.filters.sex === "zahar") {
                $scope.filters.sex = "";
            }
            else {
                $scope.filters.sex = "zahar";
            }
        }
        else {
            if ($scope.filters.sex === "female") {
                $scope.filters.sex = "";
            }
            else {
                $scope.filters.sex = "female";
            }
        }
    };

    $scope.increment = function() {
        if ($scope.children == 8) {
            return;
        }
        $scope.children ++;
        $scope.filters.children = $scope.children;

    };

    $scope.decrement = function() {
        if ($scope.children >= 0) {
            $scope.children --;
            if ($scope.children == 0) {
                $scope.filters.children = "";
            }
            else {
                $scope.filters.children = $scope.children;
            }
        }
    };

    $scope.childrenRange = function(n) {
        var input = [];
        for (var i = 0; i < n; i += 1) {
            input.push(i);
        }
        return input;
    }


}]);
