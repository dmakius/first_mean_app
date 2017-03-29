angular.module('emailController', [
'userServices'
])
  .controller('emailCtrl', function($routeParams, User, $timeout, $location){
    app = this;
    console.log("NOW IN EMAIL CONTROLLER");
    console.log($routeParams.token);
    User.activateaccount($routeParams.token).then(function(data){
        app.successMsg = false;
        app.successMsg = false;
      if(data.data.success){
        app.successMsg = data.data.message + "....Redirecting";
        $timeout(function(){
          $location.path('/login')
        }, 2000);
      }else{
        app.errorMsg = data.data.message + "....Redirecting";
        $timeout(function(){
          $location.path('/login')
        }, 2000);
      }
    })
  })
  .controller('resendCtrl', function(User){
    console.log("hello form resend controller");
    app = this;
    app.errorMsg = false;

    app.checkCredentials = function(resendData){
      app.disabled = true;
      app.errorMsg = false;
      app.successMsg = false;
      console.log('checkCredentials function WORKING!');
      console.log(resendData);
        User.checkcredentials(app.loginData).then(function(data){
          if(data.data.success){
            //resend the link
            User.resendLink(app.loginData).then(function(data){
              app.successMsg = data.data.message;
            });
          }else{
            app.disabled = false;
            app.errorMsg = data.data.message;
          }
        });
    }
  });
