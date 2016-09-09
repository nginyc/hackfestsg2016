angular.module('starter.services', [])

.factory('$accounts', function () {

    var config = {
        apiKey: "AIzaSyCb_5n7K-f1eq_Q5vJYfNJpxjlnJyJIlzs",
        authDomain: "hackfestsg.firebaseapp.com",
        databaseURL: "https://hackfestsg.firebaseio.com",
        storageBucket: "hackfestsg.appspot.com"
    };

    var firebaseApp = firebase.initializeApp(config);

    var user = {
        isLoggedIn: false,
        email: ''
    };

    return {
        user: user,
        login: login,
        logout: logout,
        create: create
    };

    function login(email, password) {
        return new Promise(function (resolve, reject) {
            try {
                firebaseApp.auth().signInWithEmailAndPassword(email, password)
                .then(function (user) {
                    updateUser();
                    resolve(user);
                }, function (error) {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    function updateUser() {
        var newUser = firebaseApp.auth().currentUser;
        if (newUser == null) {
            user.isLoggedIn = false; 
        } else {
            user.isLoggedIn = true;
            user.email = newUser.email;
        }
    }

    function create(email, password) {
        return new Promise(function (resolve, reject) {
            try {
                firebaseApp.auth().createUserWithEmailAndPassword(email, password)
                .then(function (user) {
                    updateUser();
                    resolve(user);
                }, function (error) {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    function logout() {
        return new Promise(function (resolve, reject) {
            try {
                firebaseApp.auth().signOut()
                .then(function () {
                    updateUser();
                    resolve();
                }, function (error) {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
})

.factory('$localStorage', function ($window) {

    return {
        /**
         * @name set
         * @description
         * Set a key value pair into the local storage for persistence.
         * 
         * @param {string} key - the index at which the value will be set
         * @param {mixed} value - the value to set at the given index
         */
        set: function(key, value) {
            // If we are trying to set an object in here then we need
            //  to make sure it is a string, so we json encode it.
            if (angular.isArray(value) || angular.isObject(value)) {
                value = JSON.stringify(value);  
            }

            $window.localStorage[key] = value;
        },
        
        /**
         * @name get
         * @description
         * Return a value in local storage at a specific key.
         *
         * @param {string} key - the index at which to return the stored value in
         *                       in local storage
         * 
         * @return {mixed} - the value stored at the given key in local storage
         */
        get: function(key) {
            // If we have a null at the index then we want to return
            //  the null value, otherwise we JSON.parse the return value
            //  to handle all other types (strings, numbers, objects, arrays)
            return $window.localStorage[key] === null ?
              null : JSON.parse($window.localStorage[key]);
        },

        has: function(key) {
            return $window.localStorage[key] != null;
        }
    };
});
