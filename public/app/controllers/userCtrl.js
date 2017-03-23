angular.module('userController', ['userServices'])
.controller('regCtrl', function($http, $location, $timeout, User){
  var app = this;
  this.regUser = function(regData){
    app.loading = true;
    app.errorMsg = false;
    // console.log("form submited");
    // console.log(this.regData);
    User.create(app.regData).then(function(data){
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
})
.controller('facebookCtrl', function($routeparams, Auth, $location){
  var app = this;
  if($window.$locaion.pathname =='/facebookerror'){
      app.errorMsg = "facebook email not found in database";
  }else{
    Auth.facebook($routeparams.token);
    $location.get('/');
  }

});
