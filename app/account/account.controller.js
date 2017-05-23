"use strict";
angular.module('app').controller('AccountController', function ($scope, $rootScope, $location, $window, UserService, AppService, AuthService) {
    var addressTemplate = {
            firstname: "",
            lastname: "",
            homeaddress: "",
            streetaddress: "",
            city: "",
            state: "",
            zip: "",
            _id: ""
        },
        index = 0,
        autoComplete = {},
        formUser = {},
        init;
    $rootScope.webtitle = "My Account";
    $rootScope.page = $location.path();
    $scope.user = {};
    $scope.locked = true;
    $scope.addresses = [];
    $scope.err = "";
    $scope.formErr = "";
    $scope.popupDelete = false;
    $scope.popupAddressForm = false;
    $scope.formAddress = {};
    $scope.editUser = function (index) {
        formUser = $scope.user;
        $scope.locked = false;
    };
    $scope.updateUser = function () {
        AppService.UserUpdate({
            user: $scope.user,
            token: UserService.getUserID().token,
            _id: UserService.getUserID()._id
        }).then(function (data) {
            if (data.err) {
                $scope.err = "<p>Please review the following:</p><ul>" + data.msg + "</ul>";
            } else {
                $scope.err = "";
                $scope.user = data.data;
                UserService.setUser(data.data);
                $scope.locked = true;
            }
        });
    };
    $scope.clearEdit = function () {
        $scope.user = formUser;
        $scope.locked = true;
    };
    $scope.confirmPhone = function () {
        UserService.setPhone($scope.user.phone.address);
        $window.location.href = "#/phone";
    };
    $scope.confirmEmail = function () {
        UserService.setEmail($scope.user.email.address);
        $window.location.href = "#/email";
    };

    $scope.editAddress = function (i) {
        index = i;
        $scope.formAddress = $scope.addresses[i];
        $scope.popupAddressForm = true;
    };
    $scope.newAddress = function () {
        $scope.formAddress = addressTemplate;
        $scope.popupAddressForm = true;
    };
    $scope.deleteAddress = function (index) {
        var address = {
            addressid: $scope.addresses[index]._id
        };
        AppService.DeleteAddress(address).then(function (data) {
            if (data.err) {
                $scope.err = "<p>Please review the following:</p><ul>" + data.msg + "</ul>";
            } else {
                $scope.addresses.splice(index, 1);
            }
        });
    };
    $scope.deleteAccount = function () {
        AppService.UserDelete(UserService.getUserID()).then(function (data) {
            if (data) {
                UserService.logout();
            }
        });
    };
    $scope.SaveAddress = function () {
        var address = $scope.formAddress.homeaddress + " " + $scope.formAddress.streetaddress + ", " + $scope.formAddress.city + ", " + $scope.formAddress.state + " " + $scope.formAddress.zip;
        if (AuthService.checkAddress(address)) {
            if (!UserService.findAddress($scope.formAddress._id)) {
                AppService.AddAddress($scope.formAddress).then(function (data) {
                    if (data.err) {
                        $scope.formErr = "<p>Please review the following:</p><ul>" + data.msg + "</ul>";
                    } else {
                        $scope.popupAddressForm = false;
                        $scope.addresses.push(data.data);
                        UserService.setAddresses($scope.addresses);
                    }
                });
            } else {
                AppService.UpdateAddress($scope.formAddress).then(function (data) {
                    if (data.err) {
                        $scope.formErr = "<p>Please review the following:</p><ul>" + data.msg + "</ul>";
                    } else {
                        $scope.popupAddressForm = false;
                        $scope.addresses[index] = data.data;
                        UserService.setAddresses($scope.addresses);
                    }
                });
            }
        } else {
            $scope.formErr = "<p>Please review the following:</p><ul><li>Address not found.</li></ul>";
        }
    };

    init = function () {
        AppService.UserDetails(UserService.getUserID()).then(function (data) {
            if (data.err) {
                $scope.err = "<p>Please review the following</p><ul>" + data.msg + "</ul>";
            } else {
                UserService.updateUser(data.data.user);
                $scope.user = data.data.user;
                UserService.setAddresses(data.data.addresses);
                $scope.addresses = data.data.addresses;
            }
        });
    };
    init();
});