app.controller('SigninCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user) {
    $scope.user = {};

    $scope.login = function () {
        $firebaseApp.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password)
        .then(function (user) {
            $user.refresh().then(function () {
                if ($user.type == "user") {
                    $state.go('app.home');
                } else if ($user.type == "merchant") {
                    $state.go('merchant');
                }
            })
        }).catch(function (error) {
            $ionicPopup.alert({
                title: 'Login failed',
                subTitle: error
            });
        });
    };

    $scope.signup = function () {
        $state.go('signup');
    }
});