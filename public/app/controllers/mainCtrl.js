angular.module('mainController', ['authServices'])
.controller('mainController', function(Auth, $timeout, $location){
  var app = this;
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
});
