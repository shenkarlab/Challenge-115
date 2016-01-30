angular.module('app').controller('marketController',
    ['$rootScope', '$scope', '$state', 'productsFactory',
        'smsFactory', '$http', '$compile', 'statsFactory', 'giftsFactory',
        function ($rootScope, $scope, $state,
                  productsFactory, smsFactory, $http, $compile, statsFactory, giftsFactory) {

            $scope.greeting = 'Hola!';
            $scope.user.age = 25;
            $scope.user.children = 0;
            $scope.category = "פירות וירקות";
            $scope.isles = [];
            $scope.pages = [];
            $scope.pages.push({"id": "veg_page", "name": "פירות וירקות"});
            $scope.counter = 0;

            $scope.giftTrigger = [];
            $scope.popupGifts = [];
            $scope.currentGift = {};

            $scope.userMessage = "";

            $scope.finished = false;
            $scope.success = false;

            $scope.strikes = 0;
            $scope.budget = $scope.$parent.user.budget;

            var modalOpen = false;

            smsSent = 0;
            $scope.answeredSMS = [];

            var answeredOffer = [];

            /* Globals */
            var counter_element = null;

            var smsArr = [];


            $scope.openFancyBox = function (url, _class,height) {
                $http.get(url).then(function (response) {
                    if (response.status == 200) {

                        var template = angular.element(response.data);
                        var compiledTemplate = $compile(template);
                        compiledTemplate($scope);

                        $.fancybox.open(
                            {
                                content: template,
                                type: 'html',
                                minHeight: height,
                                maxHeight: height,
                                minWidth: '40%',
                                maxWidth: '40%',
                                openEffect:'elastic',
                                helpers: {
                                    overlay: {closeClick: false} // prevents closing when clicking OUTSIDE fancybox
                                },
                                beforeShow: function () {
                                    $(".fancybox-wrap").addClass(_class);
                                },
                                afterClose: function () {
                                    modalOpen = !!modalOpen;
                                }
                            }
                        );
                    }
                });
            };

            //remove later
            $scope.$parent.user.marital = "single";
            $scope.$parent.user.sex = "zahar";
            $scope.$parent.user.children = 0;
            $scope.budget = 115;

            /**
             * get the sms from the db according to user
             *
             */
            var hasChildren = ($scope.$parent.user.children > 0) && ($scope.$parent.user.marital != "single");
            smsFactory.getSms($scope.$parent.user.marital, $scope.$parent.user.sex, hasChildren).then(function (succ) {
                smsArr = succ.data;

            });

            /**
             * every minute send sms
             */
            setInterval(function () {
                showSMS();
            }, 60000);

            /**
             * open sms modal
             */
            function showSMS() {
                if (modalOpen || $scope.finished) {
                    return;
                }
                modalOpen = true;
                if (smsSent < 3) {
                    $scope.currMessage = smsArr[smsSent];
                    smsSent++;
                    $scope.openFancyBox('partials/template-sms.html', 'super sms');
                }
            }

            $scope.messageAddedItem = function (products) {
                for (var i = 0; i < ids.length; i++) {
                    addItem(products[i], "");
                }
                $scope.answeredSMS.push(currMessage);
            };

            /**
             * get gifts from DB
             */
            giftsFactory.getGifts().then(function (succ) {
                $scope.giftTrigger = succ.data[0].items;
                $scope.popupGifts = succ.data[1].items;
            });

            /**
             * popup gift every minute
             */
            setInterval(function () {
                if (modalOpen) {
                    return;
                }
                var i = getRandomIntInclusive(0,$scope.popupGifts.length - 1);
                $scope.currentGift = $scope.popupGifts[i];
                showGift();
            }, 60000);

            function showGift() {
                if (modalOpen) {
                    return;
                }
                modalOpen = true;

                var giftClass = $scope.currentGift.gift ? " gift " : "";
                giftClass += " offer ";
                $scope.openFancyBox('partials/template-offer.html', giftClass);
            }

            $scope.addGiftToCart = function () {
                for (var i = 0; i < $scope.currentGift.giftItem; i++) {
                    $scope.cart.items.push($scope.currentGift.giftItem[i].name);
                    //$scope.cart.total += parseFloat();
                    $scope.counter += 1;
                }
                answeredOffer.push($scope.currentGift.id);

            };


            $scope.openCart = function(){
                modalOpen = true;
                $scope.openFancyBox('partials/template-cart.html', 'cart',300);
            };

            // init only when DOM is ready
            angular.element(document).ready(function () {
                console.log('controller: document is ready');

                var svg = document.getElementById('veg_page');
                svg.addEventListener('load', function () {
                    // Operate upon the SVG DOM here
                    console.log('svg is ready');
                    init();
                    //e.getSVGDocument().querySelector('#some-node').textContent = "New text!";
                });


            });


            var init = function () {
                productsFactory.initialize().then(function (results) {
                    console.log('after factory promise');
                    productsFactory.ready = true;
                    $scope.isles = results.data;
                    console.log('isles are ready');
                    // now that were ready, activate Events Function

                    var a = document.getElementById("veg_page");
                    // Get the SVG document inside the Object tag
                    var svgDoc = a.contentDocument;
                    // we got all <g> tags
                    var g_groups = svgDoc.children[0].children;
                    var panel = g_groups['panel'];
                    counter_element = g_groups['panel'].children['shoppingcart'].children['itemscounter'];
                    //counter_element.innerHTML = $scope.counter;

                    assignProductsEvents();
                });

            };


            function addItem(product, product_element) {
                console.log('hello item');
                //console.log('product: ' + product.parentElement.id);
                $scope.cart.items.push(product);
                $scope.cart.total += parseFloat(product.price);
                $scope.counter += 1;
                counter_element.innerHTML = $scope.counter;
                $(product_element).hide(350);

                for (var i = 0; i < $scope.giftTrigger; i++) {
                    if ($scope.giftTrigger[i].triggerItem == product.name) {
                        $scope.currentGift = $scope.giftTrigger[i];
                        showGift();
                    }
                }

            }

            $scope.goToRegister = function () {
                $scope.finished = true;
                if (parseFloat($scope.cart.total) > $scope.budget) {
                    $scope.diff = parseFloat($scope.cart.total) - $scope.budget;
                    $scope.cart.failed = true;
                    $scope.success = false;
                    $scope.strikes++;
                }
                else {
                    $scope.cart.failed = false;
                    $scope.success = true;
                    $scope.diff = $scope.budget - parseFloat($scope.cart.total);
                }
            };

            $scope.tryAgain = function () {
                $scope.finished = false;
            };

            $scope.finish = function (quit) {
                $scope.quit = quit;
                $scope.openFancyBox('partials/template-write-message.html', 'super write-message');
            };

            $scope.goToStatistics = function () {
                var cart = {
                    items: []
                };
                for (var i = 0; i < $scope.cart.items.length; i++) {
                    cart.items.push($scope.cart[i].name);
                }
                cart.passed = $scope.success;
                cart.quit = $scope.quit;
                cart.sex = $scope.$parent.user.sex;
                cart.children = $scope.$parent.user.children;
                cart.marital = $scope.$parent.user.marital;
                cart.city = $scope.$parent.user.city;
                cart.message = $scope.userMessage;
                cart.total = $scope.cart.total;
                cart.strikes = $scope.strikes;
                cart.date = new Date();
                //cart.ansewredSMS
                //cart.rejectedProducts
                cart.answeredOffer = answeredOffer;

                statsFactory.saveCart(cart).then(function (respone) {
                    $.fancybox.close();
                    $state.transitionTo("statistics");
                });
            };

            /*
             * 1. Assign Cursor: Pointer to every product
             * 2. Assign event click --> addItem()
             */
            var assignProductsEvents = function () {
                var current_product = {};
                var g_items = [];

                /*
                 * for every svg page
                 */
                for (var i = 0; i < $scope.pages.length; i++) {
                    // 1. iterate over every svg page
                    var a = document.getElementById("veg_page");
                    // Get the SVG document inside the Object tag
                    var svgDoc = a.contentDocument;
                    // we got all <g> tags
                    var g_groups = svgDoc.children[0].children;
                    var isle_num = null, product_num = null;

                    // Match Between page.name & isles[i]['_id']
                    for (var j = 0; j < $scope.isles.length; j++) {
                        if ($scope.isles[j]['_id'] == $scope.pages[i].name) {
                            isle_num = j;
                            //console.log('matched: ' + $scope.isles[j]['_id']);
                            var items = $scope.isles[j].items;    // we need every --> items.e_id
                            // iterate over that isle items
                            for (var k = 0; k < items.length; k++) {
                                current_product.num = k;                     // product number in isle
                                current_product.name = items[k]['e_id']; // product name
                                // relate between (server product.e_id == DOM group of product <g>'s)
                                try {
                                    g_items = g_groups[current_product.name].children; // specific g products from DOM
                                    //console.log('k: ' + k + ' current_product: ' + current_product);
                                }
                                catch (err) {
                                    console.log('k: ' + k + ' current_product: ' + current_product.name);
                                    console.log('dom error');
                                    console.log(err);
                                    // retry here
                                    try {
                                        g_items = g_groups[current_product.name].children; // specific g products from DOM
                                    }
                                    catch (e) {
                                        console.log('second time fell | current_product: ' + current_product.name);
                                    }
                                }


                                // now we can assign for sure
                                $.each(g_items, function (key, child) {

                                    // enter in if contains product name
                                    if ((child['id'].indexOf(current_product.name)) >= 0) {
                                        var temp_item = $scope.isles[isle_num].items[current_product.num];

                                        //console.log('child: ' + child.id );
                                        //$(this).attr( "ng-click", "addItem()" );
                                        $(this).css('cursor', 'pointer');
                                        $(this).bind("click", function () {
                                            /* Assign addItem() Function with isle_number & the item number in isle */
                                            addItem(temp_item, this);
                                        });
                                    }
                                });
                                // empty g_items
                                g_items = [];
                            }
                        }
                    }

                }
            }

            function getRandomIntInclusive(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }


        }]);
