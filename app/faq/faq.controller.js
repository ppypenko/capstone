"use strict";
angular.module('app').controller('FaqController', function ($scope, $rootScope, $location, AppService, UserService) {
    $rootScope.page = $location.path();
    $rootScope.webtitle = "FAQ";
    $scope.faqs = {};
    AppService.GetFaq().then(function (data) {
        $scope.faqs = data;
    });
});