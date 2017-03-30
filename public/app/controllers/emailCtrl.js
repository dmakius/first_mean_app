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
    app = this;
    app.errorMsg = false;

    app.checkCredentials = function(resendData){
      app.disabled = true;
      app.errorMsg = false;
      app.successMsg = false;
      console.log('checkCredentials function WORKING!');
      console.log(resendData);
        User.checkcredentials(app.resendData).then(function(data){
          console.log(data);
          if(data.data.success){
            //resend the link
            User.resendLink(app.resendData).then(function(data){
              app.successMsg = data.data.message;
            });
          }else{
            app.disabled = false;
            app.errorMsg = data.data.message;
          }
        });
    }
  })
  .controller('usernameCtrl', function(User){
    console.log("Hello From username controller");
    app = this;

    app.sendUsername = function(userData, valid){
        app.errorMsg =false;
        app.loading = true;
        app.disabled = true;
      if(valid){
        User.sendUsername(app.userData.email).then(function(data){
          console.log(data);
            app.loading = false;
          if(data.data.success){
            app.successMsg = data.data.message;
          }else{
            app.disabled = false;
            app.disabled = false;
            app.errorMsg = data.data.message;
          }
        });
      }else{
        app.disabled = false;
        app.loading = false;
        app.errorMsg = "Please fill out form entirely";
      }

    }
  });
