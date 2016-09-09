angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $accounts) {
    
    $scope.logout = function () {
        $accounts.logout()
        .then(function (user) {
           //TODO: clear login details
        });
    }, function (reason) {
        $ionicPopup.alert({
            title: "Logout failed",
            subTitle: reason,
            okText: "Fine"
        });
    };
})

.controller('HomeCtrl', function ($scope, $accounts) {
    $scope.user = $accounts.user;
})

.controller('LoginCtrl', function ($scope, $accounts, $ionicPopup) {
    $scope.user = {};

    $scope.login = function () {
        $accounts.login($scope.user.email, $scope.user.password)
        .then(function (user) {
            $ionicPopup.alert({
                title: "Login success",
                okText: "Fine"
            });
        }, function (reason) {
            $ionicPopup.alert({
                title: "Login failed",
                subTitle: reason,
                okText: "Fine"
            });
        });
    };
})

.controller('SignupCtrl', function ($scope, $accounts, $ionicPopup) {
    $scope.user = {};

    $scope.submit = function () {
        $accounts.create($scope.user.email, $scope.user.password)
        .then(function (user) {
            $ionicPopup.alert({
                title: "Sign up success",
                okText: "Fine"
            });
        }, function (reason) {
            $ionicPopup.alert({
                title: "Sign up failed",
                subTitle: reason,
                okText: "Fine"
            });
        });
    };
});