angular.module('userController', ['userServices'])
.controller('regCtrl', function($http, $location, $timeout, User){
  var app = this;
  this.regUser = function(regData, valid){
    app.loading = true;
    app.errorMsg = false;
    // console.log("form submited");
    // console.log(this.regData);
    if(valid){
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
    }else{
      app.loading = false;
      app.errorMsg = "Please ensure Form is filled out properly";
    }
  }
  this.checkeUsername = function(regData){
    app.checkinguUsername = true;
    app.usernameMsg = false;
    app.usernameInvalid = false;
    User.checkusername(app.regData).then(function(data){
      if(data.data.success){
          app.checkinguUsername = true;
          app.usernameInvalid = false;
          app.usernameMsg = data.data.message
      }else{
          app.checkinguUsername = false;
          app.usernameInvalid = true;
          app.usernameMsg = data.data.message
      }
    });
  }
  this.checkEmail = function(regData){
    app.checkinguEmail = true;
    app.emailMsg = false;
    app.emailInvalid = false;
    User.checkemail(app.regData).then(function(data){
        console.log(data);
      if(data.data.success){

          app.checkingEmail = true;
          app.emailInvalid = false;
          app.emilMsg = data.data.message
      }else{
          app.checkinguUsername = false;
          app.usernameInvalid = true;
          app.usernameMsg = data.data.message
      }
    });
  }
})
.directive('match', function(){
  return{
    restrict:'A',
    controller:function($scope){

      $scope.doConfirm = function(values){

        values.forEach(function(ele){
          if($scope.confirm == ele){
            $scope.confirmed = true;
          }else{
            $scope.confirmed = false;
          }
          console.log(ele);
          });
      }
    },
    link: function(scope, element, attrs){
      attrs.$observe('match', function(){
        scope.matches = JSON.parse(attrs.match);
        scope.doConfirm(scope.matches);
      });
      scope.$watch('confirm', function(){
        scope.matches = JSON.parse(attrs.match);
        scope.doConfirm(scope.matches);
      });
    }
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
