angular.module('mainController', ['authServices'])
.controller('mainController', function(Auth, $timeout, $location,$rootScope, $window){
  var app = this;
  app.loadme = false;

  $rootScope.$on("$routeChangeStart", function(){
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

  this.doLogin = function(loginData){
    app.loading = true;
    app.errorMsg = false;
    console.log("form submited");
    console.log(this.regData);
    Auth.login(app.loginData).then(function(data){
      console.log(data.data.success);
      console.log(data.data.message);
      if(data.data.success){
        //create success message
        app.loading = false;
        app.successMsg = data.data.message + '....Redirecting';
        $timeout(function(){
            $location.path('/about');
            app.loginData = '';
            app.successMsg = false;
        },2000);
      }else{
        //create error message
        app.loading = false;
        app.errorMsg = data.data.message;
      }
    });
  }
  this.logout = function(){
    Auth.logout();
    $location.path('/logout');
    $timeout(function(){
      $location.path('/');
    }, 2000);
  }
});
