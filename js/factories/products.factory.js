app.factory('productsFactory', function($http, $q) {
    console.log('factory called');
    var prodFactory = {};
    prodFactory.isles = []; // represent the products array

    /*
    * Initially Get All Products Resolved By Category
     */
    prodFactory.initialize = function() {
        var deferred = $q.defer();

        var promise = $http.get('https://ws115.herokuapp.com/group_by_category').success(function (data) {
            prodFactory.isles = data.data;
            //console.log('hey factory ' + data.data);
        });

        return promise;
    };

    /*
     * Initially Get All Products Resolved By Category
     */
    prodFactory.getProducts = function(category) {
        console.log('inside getProducts');
        return prodFactory.isles[category];
    };

    return prodFactory;
});