app.controller('SignupCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user) {
    $scope.user = {
        email: '',
        password: '',
        type: 'user'
    };

    $scope.submit = function () {
        $firebaseApp.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
        .then(function (user) {
            return $user.initialize();
        }).then(function () {
            return $user.setType($scope.user.type);
        }).then(function () {
            $ionicPopup.alert({
                title: "Sign up success"
            }).then(function () {
                $user.refresh();
                $state.go('app.home');
            });
        }).catch(function (error) {
            $ionicPopup.alert({
                title: "Sign up failed",
                subTitle: error
            });
        });
    };
});