app.factory('statsFactory', function($http, $q) {


    var url = '//ws115.herokuapp.com';

    function getCarts() {
        return ($http.get(url + '/carts')
            .then(handleSuccess,handleError));
    }

    function getPopularProducts() {
        return ($http.get(url + '/popular_products')
            .then(handleSuccess, handleError));
    }

    function getMostRejectedProducts() {
        return ($http.get(url + '/most_rejected_products')
            .then(handleSuccess, handleError));
    }

    function favoriteRelative() {
        return ($http.get(url + '/favorite_relative')
            .then(handleSuccess, handleError));
    }

    function favoriteOffer() {
        return ($http.get(url + '/favorite_offer')
            .then(handleSuccess, handleError));
    }


    function countPassed() {
        return ($http.get(url + '/carts/count/passed')
            .then(handleSuccess, handleError));
    }
    function countFailed() {
        return ($http.get(url + '/carts/count/failed')
            .then(handleSuccess, handleError));
    }

    function countMale() {
        return ($http.get(url + '/carts/count/male')
            .then(handleSuccess, handleError));
    }

    function countFemale() {
        return ($http.get(url + '/carts/count/female')
            .then(handleSuccess, handleError));
    }
    function handleSuccess(response) {
        return response;
    }

    function handleError(response) {
        if (!angular.isObject(response.data) || !response.data.message) {
            return($q.reject("An unknown error occurred."));
        }
        return($q.reject(response.data.message));
    }

    return({
        getPopularProducts: getPopularProducts,
        getMostRejectedProducts: getMostRejectedProducts,
        favoriteRelative: favoriteRelative,
        favoriteOffer: favoriteOffer,
        getCarts: getCarts,
        countFemale:countFemale,
        countMale : countMale,
        countPassed: countPassed,
        countFailed: countFailed
    });

});
