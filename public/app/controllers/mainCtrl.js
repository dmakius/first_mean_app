angular.module('mainController', ['authServices'])
.controller('mainController', function(Auth, $timeout, $location,$rootScope, $window, $interval, $route, AuthToken, User){
  var app = this;
  app.loadme = false;
  app.checkSession = function(){
    if(Auth.isLoggedIn()){
      app.checkingSession = true;
      var interval = $interval(function(){
        var token = $window.localStorage.getItem('token') || null;
        if(token == null){
          $interval.cancel(interval);
        }else{
          // to do: need to decode this!!!!
          self.parseJwt = function(token){
            var base4Url = token.split('.')[1];
            var base64 = base4Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
          }
          var expireTime = self.parseJwt(token);
          var timeStamp = Math.floor(Date.now()/1000);
          console.log(expireTime.exp);
          console.log(timeStamp);
          var timeCheck = expireTime.exp - timeStamp;
          console.log("timecheck:" +timeCheck);
          if(timeCheck <= 0){
            console.log("token has expired");
            showModal(2);
            $interval.cancel(interval);
          }else{
            showModal(1);
            console.log("token has NOT yet expired");
          }
        }
      }, 2000);
    }
  };

  app.checkSession();

  var showModal = function(option){
    console.log("Showing Modal");
    app.choiceMade = false
    app.modalHeader = undefined;
    app.modalBody = undefined;
    app.hideButtons = false;
    if(option == 1){
      app.modalHeader = "Timeout Warning";
      app.modalBody = "Your Session will expire in 5 minutes. Would you like to REWNEW it?";
      $("#myModal").modal({backdrop:"static"});

    }else if(option == 2){
      app.modalHeader = "Logging Out";
      hideButtons = true;
      $("#myModal").modal({backdrop:"static"});
      $timeout(function(){
        Auth.logout();
        $location.path('/');
        hideModal();
        $route.reload();
      }, 2000)
    }
    $timeout(function(){
      if(!app.choiceMade){
        console.log("logged out")
        hideModal();
      }
    }, 3000);


  };

  app.renewSession = function(){
    app.choiceMade = true;
    User.renewSession(app.username).then(function(data){
      if(data.data.success){
        AuthToken.setToken(data.data.token);
        app.checkSession();
      }else{
        app.modalBody = data.data.message;
      }
    })
    console.log("session has been removed");
    hideModal();
  }
  app.endSession = function(){
    app.choiceMade = true;
    console.log("session has ended");
    hideModal();
    $timeout(function(){
      showModal(2);
    }, 2000);
  }

  var hideModal = function(){
      $("#myModal").modal('hide');
  }

  console.log("Hello fom Main Controller");
  $rootScope.$on("$routeChangeStart", function(){

    if(!app.checkingSession)app.checkSession();

    if(Auth.isLoggedIn()){
      app.isLoggedIn  = true;
      Auth.getUser().then(function(data){
        console.log(data.data.username);
        app.username = data.data.username;
        app.useremail = data.data.email;
        app.loadme = true;
      });
    }else{
      app.isLoggedIn = false;
      app.username = '';
      app.loadme = true;
    }
});

  this.facebook = function(){
    console.log($window.location.host);
    console.log($window.location.protocol);
    $window.$location = $window.$location.protocol + '//' + $window.$location.host + '/auth/facebook';
  }

  ///LOGING IN
  this.doLogin = function(loginData){
    app.loading = true;
    app.errorMsg = false
    app.expired = false;
    app.disabled = true;
    console.log("form submited");
    console.log(this.loginData);
    Auth.login(app.loginData).then(function(data){
      console.log(data);
      if(data.data.success){
        //create success message
        app.loading = false;
        app.successMsg = data.data.message + '....Redirecting';
        $timeout(function(){
            $location.path('/');
            app.loginData = '';
            app.successMsg = false;
            app.disabled = false;
            app.checkSession();
        },2000);
      }else{
          app.disabled = false;
        //create error message
        if(data.data.expired){
          console.log(data);
            app.expired = true;
            app.loading = false;
            app.errorMsg = data.data.message;
        }else{
          app.loading = false;
          app.errorMsg = data.data.message;
        }
      }
    });
  }
  ///LOGING OUT
  this.logout = function(){
    Auth.logout();
    $location.path('/logout');
    $timeout(function(){
      $location.path('/');
    }, 2000);
  }
});
