"use strict";
angular.module('app').factory('UserService', function ($cookies, $window, $rootScope) {
    var service = {},
        userDetails = {},
        addressList = [],
        itemsList = [],
        email = "",
        phone = "",
        logd = false,
        token = "",
        saveditem = false;

    function setList(list) {
        itemsList = list;
    }

    function setAddresses(addresses) {
        addressList = addresses;
    }

    function setItem(item) {
        saveditem = item;
    }

    function getItem() {
        return saveditem;
    }

    function clearItem() {
        saveditem = false;
    }

    function setPhone(address) {
        phone = address;
    }

    function getPhone() {
        return phone;
    }

    function setEmail(address) {
        email = address;
    }

    function getEmail() {
        return email;
    }

    function setCookie(username) {
        var date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        $cookies.put("price_bot_online_user", username, {
            expires: date
        });
    }

    function updateUser(user) {
        return {
            token: userDetails.token,
            user: user
        };
    }

    function logout() {
        $window.localStorage.removeItem("Token");
        userDetails = false;
        $rootScope.username = "";
        logd = false;
    }

    function getCookie() {
        return $cookies.get("price_bot_online_user");
    }

    function getLogd() {
        return logd;
    }

    function setUser(user) {
        if (user.token) {
            $window.localStorage.setItem("Token", user.token);
            setCookie(user.name);
            $rootScope.username = user.name;
            userDetails = user;
            logd = true;
            token = user.token;
        }
    }

    function setAddresses(addresses) {
        addressList = addresses;
    }

    function findAddress(addressid) {
        var i = 0,
            length = addressList.length,
            check = false;
        for (i = 0; i < length; i += 1) {
            if (addressList[i]._id === addressid) {
                check = true;
                break;
            }
        }
        return check;
    }

    function getUserID() {
        return {
            _id: userDetails._id,
            token: token
        };
    }
    service.findAddress = findAddress;
    service.setAddresses = setAddresses;
    service.updateUser = updateUser;
    service.setPhone = setPhone;
    service.getPhone = getPhone;
    service.setEmail = setEmail;
    service.getEmail = getEmail;
    service.getUserID = getUserID;
    service.logout = logout;
    service.getCookie = getCookie;
    service.setUser = setUser;
    service.setItem = setItem;
    service.getItem = getItem;
    service.clearItem = clearItem;
    service.setList = setList;
    service.setAddresses = setAddresses;
    service.getLogd = getLogd;
    return service;
});