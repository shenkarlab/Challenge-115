var app = angular.module('app');

app.controller('superController', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {

        $scope.isles = [];
        $scope.strikes = 0;
        $scope.diff;
        $scope.failed = false;
        $scope.finished = false;
        $scope.popUpCounter = 0;

        //this will be taken from the webservice according to the input
        $scope.message = {
            trial_message: "על מה שאישה ביקשה",
            sender: 'האישה',
            content: "היי אתה שחכתי לרשום חלב, אתה יכול לקנות?",
            item: 48
        };

        $http.get('http://localhost:8080/group_by_category').then(function (res) {
            $scope.isles = res.data;
            $("#super").mousewheel(function (event, delta) {

                this.scrollLeft -= (delta * 5);
                event.preventDefault();
            });
        });

        $scope.openFancyBox = function (url) {
            $http.get(url).then(function (response) {
                if (response.status == 200) {

                    var template = angular.element(response.data);
                    var compiledTemplate = $compile(template);
                    compiledTemplate($scope);
                    $.fancybox.open(
                            {
                                content: template,
                                type: 'html',
                                closeBtn: false,
                                helpers: {
                                    overlay: {closeClick: false} // prevents closing when clicking OUTSIDE fancybox
                                }
                            }
                    );
                }
            });
        };

        function pushItem(item) {
            $scope.cart.total += parseFloat(item.price);
            $scope.cart.items.push(item);
        }

        function getItemById(id) {
            var returnItem = 0;
            angular.forEach($scope.isles, function (isle) {
                angular.forEach(isle.items, function (item) {
                    if (item.id == id) {
                        returnItem = item;
                    }
                });
            });
            return returnItem;
        }

        $scope.addItem = function (i, j) {
            var temp_item = $scope.isles[i].items[j];
            pushItem(temp_item);
            $scope.popUpCounter++;
            if ($scope.popUpCounter % 3 === 0) {
                $scope.openFancyBox('partials/template-sms.html');
            }
            if (temp_item.hasOwnProperty('offer')) {
                $scope.offer = temp_item.offer;
                $scope.openFancyBox('partials/template-offer.html');
            }
        };

        $scope.messageAddedItem = function (id) {
            var item = getItemById(id);
            var gift_item = getItemById(item.offer.gift);
            gift_item.gift = 1;
            gift_item.price = 0;
            item.removeGift = item.offer.gift;
            pushItem(item);
            pushItem(gift_item);
            console.log($scope.cart);
        };

        $scope.goToRegister = function () {
            $scope.finished = true;
            if (parseFloat($scope.cart.total) > 115) {
                $scope.diff = parseFloat($scope.cart.total) - 115;
                $scope.cart.failed = true;
                $scope.strikes++;
            }
            else {
                $scope.cart.failed = false;
                $scope.diff = 115 - parseFloat($scope.cart.total);
            }
        };

        $scope.tryAgain = function () {
            $scope.finished = false;
        };
        
        $(document).on("click", ".isle-page", function (event) {
            event.preventDefault();
            var $anchor = $(this).find('a');
            $('#super').stop().animate({
                scrollLeft: $($anchor.attr('data-href')).position().left
            }, 1000);
        });
        
        $('#super').scroll(scrollspy);

    }]);

