app.controller('AppCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user) {
    $scope.logout = function () {
        $firebaseApp.auth().signOut()
           .then(function () {
               $user.refresh();
               $state.go('signin');
           }).catch(function (error) {
               $ionicPopup.alert({
                   title: "Something went wrong",
                   subTitle: error
               });
           });
    };
});