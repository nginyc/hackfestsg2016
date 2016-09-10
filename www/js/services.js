angular.module('starter.services', [])

.factory('$firebaseApp', function () {

    var config = {
        apiKey: "AIzaSyAUu0Vvjewlt7oROK1kFg-3n8kXnD4l4Zc",
        authDomain: "hackfestsg2016.firebaseapp.com",
        databaseURL: "https://hackfestsg2016.firebaseio.com",
        storageBucket: ""
    };

    return firebase.initializeApp(config);
})

.factory('$merchants', function ($firebaseApp) {

    var merchants = {
        getByCode: getByCode
    };

    return merchants;

    function getByCode(code) {
        return new Promise(function (resolve, reject) {
            $firebaseApp.database().ref('merchants').once('value')
            .then(function (data) {

                var merchantList = data.val();

                for (var id in merchantList) {
                    var merchant = merchantList[id];
                    if (merchant.code == code) {
                        resolve(merchant);
                        return;
                    }
                }

                reject("No merchant found.");
            }).catch(function (error) {
                reject(error);
            });
        });
    }
})

.factory('$user', function ($firebaseApp, $merchants) {

    var data = {};
    var user = {
        uid: 0,
        setType: setType,
        setMerchantData: setMerchantData,
        initialize: initialize,
        createTransaction: createTransaction,
        refresh: refresh,
        isLoggedIn: function () {
            return this.uid != 0;
        }
    };

    return user;

    function setType(type) {
        var updates = {};
        updates['users/' + user.uid + '/type'] = type;

        return $firebaseApp.database().ref().update(updates);
    }

    function setMerchantData(name, business_no) {
        
        return $firebaseApp.database().ref('merchant_max_code').once('value')
              .then(function (data) {
                  var max_code = data.val();
                  
                  var uid = $firebaseApp.database().ref().child('merchants').push().key;

                  var merchant = {
                      id: uid,
                      name: name,
                      business_no: business_no,
                      code: max_code,
                      balance: 0,
                      device_id: ''
                  };

                  var updates = {};

                  updates['users/' + user.uid + '/merchant_id'] = merchant.id;
                  updates['merchant_max_code'] = max_code + 1;
                  updates['merchants/' + merchant.id] = merchant;

                  return $firebaseApp.database().ref().update(updates);
              });
    }

    function initialize() {
        refresh();

        return $firebaseApp.database().ref('users/' + user.uid).set({
            id: user.uid,
            name: '',
            balance: 0,
            type: 'user',
            transactions: []
        });
    }

    function refresh() {
        var currentUser = $firebaseApp.auth().currentUser;
        if (currentUser == null) {
            user.uid = 0;
        } else {
            user.uid = currentUser.uid;
            Object.assign(user, currentUser);

            $firebaseApp.database().ref('users/' + user.uid).on('value', function (data) {
                Object.assign(user, data.val());
            });
        }
    }

    function createTransaction(merchant_id, amount) {
        var uid = $firebaseApp.database().ref().child('transactions').push().key;

        var transaction = {
            id: uid,
            merchant_id: merchant_id,
            user_id: user.uid,
            amount: parseFloat(amount),
            timestamp: new Date().toDateString(),
            refunded: false
        };
       
        refresh();
        var merchant = {}

        return new Promise(function (resolve, reject) {

            user.balance = parseFloat(user.balance);

            if (user.balance < transaction.amount) {
                reject("User does not have enough balance!");
            }

            $firebaseApp.database().ref('merchants/' + merchant_id).once('value')
            .then(function (data) {

                Object.assign(merchant, data.val());
                merchant.balance = parseFloat(merchant.balance);

                var updates = {};

                updates['users/' + user.uid + '/transactions/' + transaction.id];
                updates['users/' + user.uid + '/balance'] = user.balance - transaction.amount;
                updates['merchants/' + merchant_id + '/balance'] = merchant.balance + transaction.amount;
                updates['transactions/' + transaction.id] = transaction;

                return $firebaseApp.database().ref().update(updates);
            }).then(function () {
                resolve(transaction);
            }).catch(function (error) {
                reject(error);
            });
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
        set: function (key, value) {
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
        get: function (key) {
            // If we have a null at the index then we want to return
            //  the null value, otherwise we JSON.parse the return value
            //  to handle all other types (strings, numbers, objects, arrays)
            return $window.localStorage[key] === null ?
              null : JSON.parse($window.localStorage[key]);
        },

        has: function (key) {
            return $window.localStorage[key] != null;
        }
    };
});
