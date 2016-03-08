app.directive('navbar', function ($rootScope, Session, AuthService, AUTH_EVENTS, $state, localStorageService) {
    var cartCt;
    if(!localStorageService.get('cart')){
        cartCt = 0
    }else{
     cartCt = localStorageService.get('cart').tasks.length;
    }
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {
            scope.items = [
                { label: 'Home', state: 'home' },
                { label: 'About', state: 'about' },
                { label: 'For Sale', state: 'tasksForSale'},
                { label: 'Top Ten Bees', state: 'topTen'},
                { label: 'Cart (' + cartCt + ')', state: 'cart'},
                { label: 'New Post', state: 'newPost', auth: true},
                { label: 'My Account', state: 'homepage.purchasehistory', auth: true }
            ];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUser = function () {
                // console.log('do we have auth interceptor?', AuthInterceptor)
                console.log('local:', localStorageService.keys());
                AuthService.getLoggedInUser()
                .then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                console.log('about to remove user (in navbar link function):', scope.user);
                scope.user = null;
            };

            setUser();
            // setCart();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            // $rootScope.$on(AUTH_EVENTS.loginSuccess, setCart);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
