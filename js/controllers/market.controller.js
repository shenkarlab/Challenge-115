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
            $scope.pages.push(  {"id":"veg_page", "name": "פירות וירקות"},
                {"id":"dairy_page", "name": "חלב, ביצים וסלטים"},
                {"id":"salats_page", "name": "סלטים"},
                {"id":"cooking_page", "name": "בישול ואפייה"},
                {"id":"preserved_and_oils_page", "name": "שימורים ושמנים"},
                {"id":"legumes_page", "name": "קטניות"},
                {"id":"meat_and_fish", "name": "בשר ודגים"},
                {"id":"frozen", "name": "קפואים"},
                {"id":"breads", "name": "לחם ומאפים"},
                {"id":"cerealsnackspreads", "name": "חטיפים,דגנים וממרחים"},
                {"id":"beverages", "name": "משקאות"});
            $scope.counter = 0;
            var htmlCounter = null;

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

            /*
             * Set Scroll To The Right
             */
            var redirectToRight = function() {
                var leftPos = $('body').scrollLeft();
                $('body').animate({scrollLeft: leftPos + calculateWidth()}, 0.001);
            };


            function getItemByName(name){
                for (var i = 0 ; i < $scope.isles.length ; i++) {
                    for (var j = 0; j < $scope.isles[i].items.length ; j++) {
                        if (name === $scope.isles[i].items[j].name) {
                            return $scope.isles[i].items[j];
                        }
                    }
                }
                return null;
            }


            $scope.openFancyBox = function (url, _class,height) {
                // Gets template url
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
                                    modalOpen = false;
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


            $scope.messageAddedItem = function () {
                for (var i = 0; i < $scope.currMessage.itemId.length; i++) {
                    item = getItemByName($scope.currMessage.itemId[i]);
                    if (item) {
                        addItem(item, "");
                    }
                }
                $scope.answeredSMS.push($scope.currMessage);
            };

            /**
             * get gifts from DB
             */
            giftsFactory.getGifts().then(function (succ) {
                $scope.popupGifts = succ.data[0].items;
                $scope.giftTrigger = succ.data[1].items;
            });


            function showGift() {
                if (modalOpen) {
                    return;
                }
                modalOpen = true;

                var giftClass = $scope.currentGift.gift ? " gift " : "";
                giftClass += " super offer ";
                $scope.openFancyBox('partials/template-offer.html', giftClass);
            }

            $scope.addGiftToCart = function () {
                for (var i = 0; i < $scope.currentGift.giftItem.length; i++) {
                    item = getItemByName($scope.currentGift.giftItem[i].name);
                    $scope.cart.items.push(item);
                    $scope.cart.total += parseFloat(item.price * (100/$scope.currentGift.giftItem[i].name ));
                    $scope.counter += 1;
                    htmlCounter.innerHTML = $scope.counter.toString();
                }
                answeredOffer.push($scope.currentGift.id);
                $.fancybox.close();

            };

            /**
             * popup every minute
             */
            var popupToggle = true;
            setInterval(function () {
                if (modalOpen || $scope.finished) {
                    return;
                }

                if (popupToggle) {
                    var i = getRandomIntInclusive(0,$scope.popupGifts.length - 1);
                    $scope.currentGift = $scope.popupGifts[i];
                    showGift();
                }
                else {
                    showSMS();
                }
                popupToggle = !popupToggle;

            }, 60000);


            $scope.openCart = function(){
                modalOpen = true;
                $scope.openFancyBox('partials/template-cart.html', 'cart',300);
            };

            /*
             * Calculate all isles width
             */
            var calculateWidth = function() {
                var width = null;
                var supermarket_isles = $('.supermarket_container .isle');
                $.each( supermarket_isles, function(key, isle) {
                    width += isle.offsetWidth;
                });
                return width;
            };

            /*
             * Check For Mobile Compatibility
             */
            var detectMobileHeight = function() {
                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                    $('.ng-scope').css( "overflow-y","hidden");
                }
            };


            /*
             * DOM Ready Trigger
             */
            angular.element(document).ready(function () {
                console.log('controller: document is ready, Initalize Started');
                console.log('------------------------------------------------');




                /* Iterate each page and assign onload svg function */
                var c_page = null; // current page
                var c_name = null;
                var loaded = 0;
                //load_page(loaded);

                // 1. init data

                for(var i=0; i<$scope.pages.length; i++) {
                    c_page = document.getElementById($scope.pages[i].id);
                    c_name = $scope.pages[i].name;
                    c_page.addEventListener('load', function(c_name) {
                        console.log(c_name + ' was loaded: ');
                        loaded ++;

                        if(loaded == $scope.pages.length) {
                            console.log('1. All SVG Isles Are Loaded');
                            /*var w  = calculateWidth();*/


                            $('.supermarket_container').width(calculateWidth());

                            /*var leftPos = $('body').scrollLeft();
                            $('body').animate({scrollLeft: leftPos + calculateWidth()}, 0.001);*/

                            redirectToRight();

                            //$('.supermarket_container').css( "cursor","none");
                            //$('.supermarket_container').css("position","relative");
                            /*$('.supermarket_container').removeProp("position");
                            $('.supermarket_container').animate().css("position","relative");*/
                            //$('.supermarket_container').css( "position","relative");
                            //$('body').removeProp("margin");





                            detectMobileHeight();
                            //$('.ng-scope').css( "overflow-y","hidden");

                            htmlCounter = $('.products_counter')[0];
                            //htmlCounter.innerHTML = "0";     overflow-y: hidden; .css( "color", "green" )

                            //document.getElementsByTagName("html")[0].setAttribute("style", "overflow-y: hidden;");
                            //$('.supermarket_container').animate({ scrollLeft:w}, "fast");
                            init();
                        }
                    });
                }
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



            /*
             * Add Another Item To The Cart Function
             */
            function addItem(product, product_element) {
                //console.log('hello item: ' + product.e_id);
                //console.log('product: ' + product.parentElement.id);
                $scope.cart.items.push(product);
                $scope.cart.total += parseFloat(product.price);
                $scope.counter ++;
                //console.log('counter: ' + $scope.counter);
                htmlCounter.innerHTML = $scope.counter.toString();
                //counter_element.innerHTML = $scope.counter;
                $(product_element).hide(350);

                for (var i = 0; i < $scope.giftTrigger.length; i++) {
                    if ($scope.giftTrigger[i].triggerItem == product.name) {
                        $scope.currentGift = $scope.giftTrigger[i];
                        showGift();
                    }
                }

            }


            $scope.removeItem = function(i) {
                var item = $scope.cart.items[i];
                $scope.cart.items.splice(i,1);
                $scope.cart.total -= parseFloat(item.price);
                $scope.counter --;
                htmlCounter.innerHTML = $scope.counter.toString();
            };



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

            /*
            * Try Again Function
             */
            $scope.tryAgain = function () {
                $scope.finished = false;
                redirectToRight();


                // Recognize Libra Test
                /*if($scope.answeredSMS.length >=2) {
                    modalOpen = true;
                    $scope.openFancyBox('partials/template-libra-test.html', 'libra');

                }*/
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
                    if ("name" in $scope.cart.items[i] ) {
                        cart.items.push($scope.cart.items[i].name);
                    }
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
                cart.budget = $scope.budget;

                statsFactory.saveCart(cart).then(function (respone) {
                    $.fancybox.close();
                    $state.transitionTo("statistics");
                });
            };

            /*
             * 1. Assign Cursor: Pointer to every product
             * 2. Assign event click --> addItem()
             */
            var assignProductsEvents =  function() {
                var current_product = {};
                var g_items = [];

                /*
                 * for every svg page
                 */
                for(var i =0; i<$scope.pages.length; i++) {
                    // 1. iterate over every svg page
                    var a = document.getElementById($scope.pages[i].id);
                    // Get the SVG document inside the Object tag
                    var svgDoc = a.contentDocument;
                    // we got all <g> tags
                    var g_groups =  svgDoc.children[0].children;
                    var isle_num = null, product_num = null;

                    // Match Between page.name & isles[i]['_id']
                    for(var j=0; j< $scope.isles.length; j++) {
                        if($scope.isles[j]['_id'] == $scope.pages[i].name) {
                            isle_num = j;
                            //console.log('matched: ' + $scope.isles[j]['_id']);
                            var items = $scope.isles[j].items;    // we need every --> items.e_id
                            // iterate over that isle items
                            for(var k=0;k<items.length;k++) {
                                current_product.num = k;                     // product number in isle
                                current_product.name = items[k]['e_id']; // product name
                                // relate between (server product.e_id == DOM group of product <g>'s)
                                try {
                                    g_items = g_groups[current_product.name].children; // specific g products from DOM
                                    //console.log('k: ' + k + ' current_product: ' + current_product);
                                }
                                catch(err) {
                                    console.log('k: ' + k + ' current_product: ' + current_product.name);
                                    console.log('dom error');
                                    console.log(err);
                                    // retry here
                                    try {
                                        g_items = g_groups[current_product.name].children; // specific g products from DOM
                                    }
                                    catch(e) {
                                        console.log('second time fell | current_product: ' + current_product.name);
                                    }
                                }


                                // now we can assign for sure
                                $.each( g_items, function(key, child) {

                                    // enter in if contains product name
                                    if( (child['id'].indexOf(current_product.name)) >= 0 ) {
                                        var temp_item = $scope.isles[isle_num].items[current_product.num];

                                        //console.log('child: ' + child.id );
                                        //$(this).attr( "ng-click", "addItem()" );
                                        $(this).css('cursor','pointer');
                                        $(this).bind("click", function() {
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
            };

            function getRandomIntInclusive(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }


        }]);
