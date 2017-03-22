angular.module('mainController', ['authServices'])
.controller('mainController', function(Auth, $timeout, $location){
  var app = this;
  if(Auth.isLoggedIn()){
    console.log("Sucess: User is Logged in");
    Auth.getUser().then(function(data){
      console.log(data);
    })
  }else{
    console.log("Failer: User is Nont Logged in");
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
            $location.path('/');
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
