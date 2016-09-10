app.controller('AppCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user, $localStorage) {
    $scope.logout = function () {
        $firebaseApp.auth().signOut()
           .then(function () {
               $user.refresh();
               $localStorage.set('email', null);
               $localStorage.set('password', null);
               $state.go('signin');
           }).catch(function (error) {
               $ionicPopup.alert({
                   title: "Something went wrong",
                   subTitle: error
               });
           });
    };
});