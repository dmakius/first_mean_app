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
  });
