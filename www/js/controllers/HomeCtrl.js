app.controller('HomeCtrl', function ($scope, $firebaseApp, $state, $user) {
    if (!$user.isLoggedIn()) {
        $state.go('login');
    }

    $scope.user = $user;
});