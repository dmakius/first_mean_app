angular.module('mainController', ['authServices'])
.controller('mainController', function(Auth, $timeout, $location,$rootScope, $window, $interval, $route, AuthToken, User){
  var app = this;
  app.loadme = false;
  app.checkSession = function(){
    if(Auth.isLoggedIn()){
      app.checkingSession = true;
      var interval = $interval(function(){
        var token = $window.localStorage.getItem('token');
        if(token == null){
          $interval.cancel(interval);
        }else{
            //Parse JWT for timestamp
            // to do: need to decode this!!!!
            self.parseJwt = function(token){
              var base4Url = token.split('.')[1];
              var base64 = base4Url.replace('-', '+').replace('_', '/');
              return JSON.parse($window.atob(base64));
            }
          var expireTime = self.parseJwt(token); //get expiretime from token
          var timeStamp = Math.floor(Date.now()/1000); //get timestamp for NOW
          var timeCheck = expireTime.exp - timeStamp;
          if(timeCheck <= 0){
            console.log("token has expired");
            showModal(2);
            $interval.cancel(interval);
          }else if(timeCheck <= 20){
            showModal(1);
            console.log("token has NOT yet expired");
          }
        }
      }, 2000);//checks EVERY 2000 ms for token
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
    console.log("session is being extended by 10s");
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

  $rootScope.$on("$routeChangeStart", function(){
    console.log("changing route");
    if(!app.checkingSession)app.checkSession();

    //check is user is logged in
    if(Auth.isLoggedIn()){
      app.isLoggedIn  = true;
      Auth.getUser().then(function(data){
        console.log(data.data.username);
        app.username = data.data.username;
        app.useremail = data.data.email;
        User.getPermission().then(function(data){
          console.log(data);
          if(data.data.permission == 'admin' || data.data.permission == 'moderator'){
            app.authorized = true;
            app.loadme = true;
          }else{
            app.loadme = true;
          }
        })
      });
    }else{
      app.isLoggedIn = false;
      app.username = '';
      app.loadme = true;
    }
});

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
