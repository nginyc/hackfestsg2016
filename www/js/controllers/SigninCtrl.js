app.controller('SigninCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user, $localStorage) {

    $scope.$on("$ionicView.afterEnter", function () {
        $scope.user = {
            email: $localStorage.get('email'),
            password: $localStorage.get('password')
        };

        if ($scope.user.email != null && $scope.user.email.toLower() != "a@merchants.com") {
            $scope.login();
        }
    });

    $scope.login = function () {
        $firebaseApp.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password)
        .then(function (user) {
            $localStorage.set('email', $scope.user.email);
            $localStorage.set('password', $scope.user.password);
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