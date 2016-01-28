var app = angular.module('app');

app.controller('statisticsController', ['$scope', '$http', '$state','statsFactory','$compile', function ($scope, $http, $state,statsFactory, $compile) {
    $scope.favoriteProducts = [];
    $scope.rejectedProducts = [];
    $scope.favoriteRelative = "חבר";
    $scope.favoriteOffer = {
        header: "פסטה + שמנת",
        content: "קנה פסטה קבל חבילת שמנת"
    };
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
            if ($scope.children == -1) {
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
    };


    $scope.pressedCart = false;
    $scope.openDescription = function(cart) {
        $http.get('partials/template_statistics_pop_up.html').then(function (response) {
            if (response.status == 200) {
                var popupdetailes = {};
                var souls;

                popupdetailes.sex = cart.sex == "zahar" ? "זכר" : "נקבה" ;
                popupdetailes.city = cart.city;
                if (cart.sex == "zahar") {
                    if (cart.marital == "married") {
                        popupdetailes.marital = "נשוי";
                        souls = 2;
                    }
                    else if (cart.marital == "divorced") {
                        popupdetailes.marital = "גרוש";
                        souls = 1;

                    }
                    else if (cart.marital == "single") {
                        popupdetailes.marital = "רווק";
                        souls = 1;

                    }
                    popupdetailes.bought = "רכש";
                    popupdetailes.failedword = "נכשל";

                }
                else {
                    if (cart.marital == "married") {
                        popupdetailes.marital = "נשואה";
                        souls = 2;

                    }
                    else if (cart.marital == "divorced") {
                        popupdetailes.marital = "גרושה";
                        souls = 1;

                    }
                    else if (cart.marital == "single") {
                        popupdetailes.marital = "רווקה";
                        souls = 1;
                    }
                    popupdetailes.bought = "רכשה";
                    popupdetailes.failedword = "נכשלה";

                }

                souls += cart.children;

                switch (souls) {
                    case 1:
                        popupdetailes.souls = "נפש אחת";
                        break;
                    case 2:
                        popupdetailes.souls = "שתי נפשות";
                        break;
                    case 3:
                        popupdetailes.souls = "שלושה נפשות";
                        break;
                    case 4:
                        popupdetailes.souls = "ארבעה נפשות";
                        break;
                    case 5:
                        popupdetailes.souls = "חמישה נפשות";
                        break;
                    case 6:
                        popupdetailes.souls = "שישה נפשות";
                        break;
                    case 7:
                        popupdetailes.souls = "שבעה נפשות";
                        break;
                    case 8:
                        popupdetailes.souls = "שמונה נפשות";
                        break;
                    case 9:
                        popupdetailes.souls = "תשעה נפשות";
                        break;
                    case 10:
                        popupdetailes.souls = "עשרה נפשות";
                        break;
                }

                popupdetailes.message = "שמחתי מאוד שהצלחתי להוכיח לעצמי שבלה בלה בהל י שבלה בלה בה י שבלה בלה בה י שבלה בלה בה י שבלה בלה בה י שבלה בלה בה י שבלה בלה בה";
                $scope.popupdetailes = popupdetailes;
                var template = angular.element(response.data);
                var compiledTemplate = $compile(template);
                compiledTemplate($scope);

                $.fancybox.open(
                    {
                        content: template,
                        type: 'html',
                        maxWidth: '30%',
                        helpers: {
                            overlay: {closeClick: false} // prevents closing when clicking OUTSIDE fancybox
                        }
                    },
                    {
                        afterClose : function () {
                            $scope.pressedCart = false;
                        }
                    }
                );

            }
        });
    }


}]);
