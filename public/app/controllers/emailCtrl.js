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
  })
  .controller('passwordCtrl', function(User){
    app = this;
    console.log('hello form password contoller')
    app.sendPassword = function(regData, valid){
        app.errorMsg = false;
        app.successMsg = false;
        app.loading = true;
        app.disabled = true;
      if(valid){
        User.sendPassword(app.resetData).then(function(data){
            app.loading = false;
            console.log(data);
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
    };
  })
  .controller('resetCtrl', function(User, $routeParams, $scope,  $timeout,  $location){
      console.log("hello from reset password controller");
      app = this;
      app.hide = true;
      User.resetUser($routeParams.token).then(function(data){
          console.log(data);
        if(data.data.success){
            app.hide = false;
            app.successMsg = "please enter a new password";
            $scope.username = data.data.user.username;
        }else{
            app.errorMsg = data.data.message;
            $timeout(function(){
              $location.path("/login")
            },2000);
        }
      })

    app.savePassword = function(regData, valid, confirm){
      app.errorMsg = false;
      app.disabled = true;
      app.successMsg = false;
      app.loading = true;
      app.regData.username = $scope.username;
      console.log(app.regData);
      if(valid && confirm){
        User.savePassword(app.regData).then(function(data){
          app.loading = false;
          if(data.data.success){
            app.successMsg = data.data.message + "..redrecting";
            $timeout(function(){
              $location.path("/login")
            },2000);
          }else{
            app.disabled = false;
            app.errorMsg = data.data.message;
          }
        })
      }else{
        app.loading = true;
        app.disabled = false;
        app.errorMsg = "Please check that the form is filled out properly";
      }
    }
  });
