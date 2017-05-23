angular.module('app', ['ngRoute', 'ngCookies', 'ngSanitize'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main/main.html',
                controller: 'MainController'
            }).when('/account', {
                templateUrl: 'account/account.html',
                controller: 'AccountController'
            }).when('/list', {
                templateUrl: 'list/list.html',
                controller: 'ListController'
            }).when('/login', {
                templateUrl: 'login/login.html',
                controller: 'LoginController'
            }).when('/register', {
                templateUrl: 'register/register.html',
                controller: 'RegisterController'
            }).when('/faq', {
                templateUrl: 'faq/faq.html',
                controller: 'FaqController'
            }).when('/terms', {
                templateUrl: 'terms/terms.html',
                controller: 'TermsController'
            }).when('/forgot', {
                templateUrl: 'forgot/forgot.html',
                controller: 'ForgotController'
            }).when('/email', {
                templateUrl: 'confirm/email.html',
                controller: 'EmailController'
            }).when('/phone', {
                templateUrl: 'confirm/phone.html',
                controller: 'PhoneController'
            }).when('/logout', {
                templateUrl: 'login/logout.html',
                controller: 'LogoutController'
            });
    });