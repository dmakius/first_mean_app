angular.module('userController', ['userServices'])
.controller('regCtrl', function($http, $location, $timeout, User){
  console.log("Hello fom USER Controller");

  var app = this;
  this.regUser = function(regData, valid){
    app.disabled = true;
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
          app.disabled = false;
          app.loading = false;
          app.errorMsg = data.data.message;
        }
      });
    }else{
      app.disabled = false;
      app.loading = false;
      app.errorMsg = "Please ensure Form is filled out properly";
    }
  }

  this.checkUsername = function(regData){
    app.checkingUsername = true;
    app.usernameMsg = false;
    app.usernameInvalid = false;
    User.checkusername(app.regData).then(function(data){
        console.log(data);
      if(data.data.success){
          app.checkingUsername = false;
          app.usernameInvalid = false;
          app.usernameMsg = data.data.message;
      }else{
          app.checkingUsername = false;
          app.usernameInvalid = true;
          app.usernameMsg = data.data.message;
      }
    });
  }

  this.checkEmail = function(regData){
    app.checkingEmail = true;
    app.emailMsg = false;
    app.emailInvalid = false;
    User.checkemail(app.regData).then(function(data){
        console.log(data);
      if(data.data.success){
          app.checkingEmail = true;
          app.emailInvalid = false;
          app.emailMsg = data.data.message
      }else{
          app.checkingEmail = false;
          app.usernameInvalid = true;
          app.emailMsg = data.data.message
      }
    });
  }
})
//define custom directive to check matching password
.directive('match', function(){
  return{
    restrict:'A',//restrict to HTML attributes
    controller:function($scope){
      $scope.confirmed = false; //Set matching passwords to false as default

      //custom function that checks both inputs against each other
      $scope.doConfirm = function(values){
        //Run as a loop that checks both inputs against each other
        values.forEach(function(ele){
          console.log(ele);
          //check if inputs match set variable in $scope
          if($scope.confirm == ele){
            $scope.confirmed = true; //if inputs match
          }else{
            $scope.confirmed = false;//if inputs do NOT match
          }

          });
      }
    },
    link: function(scope, element, attrs){
      //grab the atribute and observe it
      attrs.$observe('match', function(){
        scope.matches = JSON.parse(attrs.match);//parse to JSON
        scope.doConfirm(scope.matches);//run custom function that checks both inoputs against each other
      });
      //grab the ng-model and watch it
      scope.$watch('confirm', function(){
        scope.matches = JSON.parse(attrs.match);//parse to JSON
        scope.doConfirm(scope.matches);//run custom function that checks both inputs against each other
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
