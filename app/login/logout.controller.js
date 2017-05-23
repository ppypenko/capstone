"use strict";
angular.module('app').controller('LogoutController', function ($window, $rootScope, UserService, AppService) {

    UserService.logout();
    $window.location.href = "#/";
    AppService.Logout();
});