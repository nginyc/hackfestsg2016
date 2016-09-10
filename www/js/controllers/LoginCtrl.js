app.controller('LoginCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user, $localStorage) {
    $scope.user = {
        email: '',
        password: ''
    };

    $scope.login = function () {
        $firebaseApp.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password)
        .then(function (user) {
            $user.refresh().then(function () {
                $state.go('app.home');
            })
        }).catch(function (error) {
            $ionicPopup.alert({
                title: 'Login failed',
                subTitle: error
            });
        });
    };
});