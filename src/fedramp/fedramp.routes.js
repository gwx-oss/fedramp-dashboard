(function () {
    'use strict';

    angular
        .module('fedramp')
        .config(routeConfig);

    // Add items to inject for safe minification
    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    /**
     * Configures the routes and views for the FedRAMP application
     */
    function routeConfig ($stateProvider, $urlRouterProvider) {
        // Go to root if something goes wrong
        $urlRouterProvider.otherwise('/');

        // Routes
        $stateProvider
            .state('fedramp', {
                abstract: true,
                templateUrl: 'src/fedramp/fedramp.html',
                resolve: {
                    fedrampData: FedRampData
                }
            })
            .state('fedramp.home', {
                url: '/',
                templateUrl: 'src/fedramp/home/home.html',
                controller: 'HomeController as homeController'
            });

        /**
         * Retrieves the providers for a particular day
         */
        FedRampData.$inject = ['DataService'];
        function FedRampData (DataService) {
            return DataService.pull().then(function (storage) {
                return storage;
            });
        }
    }
})();
