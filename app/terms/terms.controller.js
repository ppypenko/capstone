"use strict";
angular.module('app').controller('TermsController', function ($scope, $rootScope, $location, AppService, UserService) {
    $rootScope.page = $location.path();
    $rootScope.webtitle = "Terms of Service";
    $scope.terms = {};
    AppService.GetTerms().then(function (data) {
        $scope.terms = data;
    });
});