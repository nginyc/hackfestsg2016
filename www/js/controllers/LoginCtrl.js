﻿app.controller('LoginCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user) {
    $scope.user = {};

    $scope.login = function () {
        $firebaseApp.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password)
        .then(function (user) {
            $user.refresh();
            $state.go('app.home');
        }).catch(function (error) {
            $ionicPopup.alert({
                title: 'Login failed',
                subTitle: error
            });
        });
    };
});