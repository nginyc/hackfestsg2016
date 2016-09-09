angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $firebaseApp, $ionicPopup, $state) {
    
    $scope.logout = function () {
        try {
            $firebaseApp.auth().signOut()
            .then(function () {
                $state.go('login');
             }, function(error) {
                throw error;
            });
        } catch (error) {
            $ionicPopup.alert({
                title: "Something went wrong",
                subTitle: error
            });
        }
    };
})

.controller('HomeCtrl', function ($scope, $firebaseApp) {
    $scope.user = $firebaseApp.auth().currentUser;
})

.controller('LoginCtrl', function ($scope, $firebaseApp, $ionicPopup, $state) {
    $scope.user = {};

    $scope.login = function () {
        try {
            $firebaseApp.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password)
            .then(function (user) {
                $state.go('app.home');
            }, function (error) {
                throw error;
            });
        } catch (error) {
            $ionicPopup.alert({
                title: 'Login failed',
                subTitle: error
            });
        }
    };
})

.controller('SignupCtrl', function ($scope, $firebaseApp, $ionicPopup) {
    $scope.user = {};

    $scope.submit = function () {
        try {
            $firebaseApp.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
            .then(function (user) {
                $ionicPopup.alert({
                    title: "Sign up success",
                    okText: "Fine"
                });
            });
        } catch (error) {
            $ionicPopup.alert({
                title: "Sign up failed",
                subTitle: error
            });
        }
    };
});