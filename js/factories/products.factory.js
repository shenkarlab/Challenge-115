app.factory('productsFactory', function($http, $q) {
    var prodFactory = {};
    prodFactory.isles = []; // represent the products array
    console.log('factory initialized');


    /*
    * Initially Get All Products Resolved By Category
     */
    /*$http.get('https://ws115.herokuapp.com/group_by_category').success(function (res) {
        prodFactory.isles = res.data;
        console.log('hey factory ' + res.data);
    }); */

    //console.log('factory isles: ' + prodFactory.isles);

    var getData = function() {
        console.log('hey factory ');
        return $http.get('https://ws115.herokuapp.com/group_by_category').then(function(result){
            return result.data;
            console.log('hey factory ' + result.data);
        });
    };




    return { getData: getData };






    //console.log(_prodFactory.getProducts());
    //return prodFactory;
});