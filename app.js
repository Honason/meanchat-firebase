require('angular');
require('firebase');
require('angularfire');

var ref = new Firebase("https://meanchat.firebaseio.com/");

angular.module('chat', ['firebase'])

  .service('authService', function($firebaseAuth){
    var auth = $firebaseAuth(ref);

    this.login = function() {

      auth.$authWithOAuthPopup("google").then(function(authData) {
        console.log("Logged in as:", authData.uid);
      }).catch(function(error) {
        console.log("Authentication failed:", error);
      });
    };

    this.logout = function() {
      ref.unauth();
    };

    this.checkLogin = function(callback) {
      ref.onAuth(function(authData){
        callback(authData);
      });
    };
  })

  .controller('mainController', function($firebaseArray, authService){
    var scope = this;

    authService.checkLogin(function(authData){
      if (authData) {
        scope.user = authData;
      }
    });

    scope.login = authService.login;
    scope.logout = function() {
      authService.logout();
      scope.user = null;
    };

    var messagesRef = ref.child('messages');

    scope.messages = $firebaseArray(messagesRef);

    console.log(scope.messages);

    scope.sendMessage = function() {
      scope.messages.$add({
        body: scope.messageInput
      });
      scope.messageInput = '';
    };

  });
