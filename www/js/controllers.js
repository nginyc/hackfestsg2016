angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user) {

    $scope.logout = function () {
        $firebaseApp.auth().signOut()
           .then(function () {
               $user.refresh();
               $state.go('login');
           }).catch(function (error) {
               $ionicPopup.alert({
                   title: "Something went wrong",
                   subTitle: error
               });
           });
    };
})

.controller('HomeCtrl', function ($scope, $firebaseApp, $state, $user) {
    if (!$user.isLoggedIn()) {
        $state.go('login');
    }

    $scope.user = $user;
})

.controller('LoginCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user) {
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
})

.controller('SignupCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user) {
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
})

.controller('InputCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user, $merchants) {

    /**
    $firebaseApp.auth().createUserWithEmailAndPassword("yunchuannM@gmail.com", "123456")
    .then(function () {
        $user.refresh();
    })
    .then(function () {
        $user.setMerchantData("CHICKEN RICE", 2);
    });

    /**
    SEARCHING OF MERCHANT BY CODE
    $scope.merchant_code = 3;

    return $merchants.getByCode($scope.merchant_code)
    .then(function (merchant) {
        console.log(merchant + " FOUND!");
    }).catch(function (error) {
        $ionicPopup.alert({
            title: "Merchant search failed",
            subTitle: error
        });
    });
    **/

    /**
    Making a transaction
    $firebaseApp.auth().signInWithEmailAndPassword("beng@beng.com", "123456")
    .then(function () {
        return $user.refresh();
    }).then(function() {
        return $user.createTransaction("-KRH_FUaLRHMXWlPV0cH", -100);
    }).then(function(transaction) {
        $ionicPopup.alert({
            title: "Sent $" + transaction.amount + " to " + , 
            subTitle: error
        });
    }).catch(function (error) {
        $ionicPopup.alert({
            title: "Transaction failed",
            subTitle: error
        });
    });
    **/
})

.controller('MerchantCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user) {

})

.controller('DashboardCtrl', function ($scope, $firebaseApp, $ionicPopup, $state, $user) {

});
