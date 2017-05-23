"use strict";
angular.module('app').factory('AppService', function ($http, $q, config) {
    var service = {};

    function success(res) {
        return res.data;
    }

    function failure(res) {
        return $q.reject(res.data);
    }

    function GetItemList(user) {
        return $http.post(config.mainApiUrl + '/api/item/list', user).then(success, failure);
    }

    function UpdateItem(user) {
        return $http.post(config.mainApiUrl + '/api/item/update', user).then(success, failure);
    }

    function AddItem(user) {
        return $http.post(config.mainApiUrl + '/api/item/add', user).then(success, failure);
    }

    function DeleteItem(user) {
        return $http.post(config.mainApiUrl + '/api/item/delete', user).then(success, failure);
    }

    function AddAddress(user) {
        return $http.post(config.mainApiUrl + '/api/address/add', user).then(success, failure);
    }

    function UpdateAddress(user) {
        return $http.post(config.mainApiUrl + '/api/address/update', user).then(success, failure);
    }

    function DeleteAddress(user) {
        return $http.post(config.mainApiUrl + '/api/address/delete', user).then(success, failure);
    }

    function UserDetails(user) {
        return $http.post(config.mainApiUrl + '/api/user/details', user).then(success, failure);
    }

    function UserDelete(user) {
        return $http.post(config.mainApiUrl + '/api/user/delete', user).then(success, failure);
    }

    function UserUpdate(user) {
        return $http.post(config.mainApiUrl + '/api/user/update', user).then(success, failure);
    }

    function EmailConfirm(user) {
        return $http.post(config.mainApiUrl + '/api/email/confirm', user).then(success, failure);
    }

    function EmailSend(user) {
        return $http.post(config.mainApiUrl + '/api/email/send', user).then(success, failure);
    }

    function PhoneConfirm(user) {
        return $http.post(config.mainApiUrl + '/api/phone/confirm', user).then(success, failure);
    }

    function PhoneSend(user) {
        return $http.post(config.mainApiUrl + '/api/phone/send', user).then(success, failure);
    }

    function ForgotEmail(user) {
        return $http.post(config.mainApiUrl + '/forgot/email', user).then(success, failure);
    }

    function ForgotPhone(user) {
        return $http.post(config.mainApiUrl + '/forgot/phone', user).then(success, failure);
    }

    function Login(user) {
        return $http.post(config.mainApiUrl + '/login', user).then(success, failure);
    }

    function Register(user) {
        return $http.post(config.mainApiUrl + '/register', user).then(success, failure);
    }

    function GetTerms() {
        return $http.get(config.mainApiUrl + '/terms').then(success, failure);
    }

    function GetPrivacy() {
        return $http.get(config.mainApiUrl + '/privacy').then(success, failure);
    }

    function GetFaq() {
        return $http.get(config.mainApiUrl + '/faq').then(success, failure);
    }

    function Logout() {
        return $http.get(config.mainApiUrl + '/logout').then(success, failure);
    }

    function ItemSearch(item) {
        return $http.post(config.proxyApiUrl + '/search', item).then(success, failure);
    }

    function ItemCheck(item) {
        return $http.post(config.proxyApiUrl + '/check', item).then(success, failure);
    }

    service.GetItemList = GetItemList;
    service.UpdateItem = UpdateItem;
    service.AddItem = AddItem;
    service.DeleteItem = DeleteItem;
    service.AddAddress = AddAddress;
    service.UpdateAddress = UpdateAddress;
    service.DeleteAddress = DeleteAddress;
    service.UserDetails = UserDetails;
    service.UserDelete = UserDelete;
    service.UserUpdate = UserUpdate;
    service.EmailConfirm = EmailConfirm;
    service.EmailSend = EmailSend;
    service.PhoneConfirm = PhoneConfirm;
    service.PhoneSend = PhoneSend;
    service.ForgotEmail = ForgotEmail;
    service.ForgotPhone = ForgotPhone;
    service.Login = Login;
    service.Register = Register;
    service.GetTerms = GetTerms;
    service.GetPrivacy = GetPrivacy;
    service.GetFaq = GetFaq;
    service.Logout = Logout;
    service.ItemSearch = ItemSearch;
    service.ItemCheck = ItemCheck;
    return service;
});