angular.module('managementCtrl', [])
.controller("managementCtrl", function(User){
  var app = this;

  app.limit = 5;

  app.loading = true;
  app.accessDenied = true;
  app.errorMsg = false;
  app.editAccess = false;
  app.deleteAccess = false;

  function getUsers(){
    User.getUsers().then(function(data){
        if(data.data.success){
          if(data.data.permission === 'admin' ||data.data.permission === 'moderator'){
            console.log("Users Returned: ");
            console.log(data);
            app.users = data.data.users;
            app.loading = false;
            app.acccessDenied = false;
            if(data.data.permission == "admin"){
              app.editAccess = true;
              app.deleteAccess = true;
            }else if(data.data.permission == "moderator"){
                app.editAccess = true;
            }
          }else{
            app.errorMsg = "Insifficient Permission";
            app.loading = false;
          }
        }else{
          app.errorMsg = data.data.message;
          app.loading = false;
        }
      });
    }

    getUsers();

    app.showMore = function(number){
      app.showMoreError = false;
      if(number > 0){
        app.limit = number
      }else{
        app.showMoreError = "Please enter a valid number";
      }
    }

    app.showAll = function(){
        app.limit = undefined;
        app.showMoreError = false;
    }

    app.deleteUser = function(username){
      console.log("deleting");
      User.deleteUser(username).then(function(data){
        if(data.data.success){
          getUsers();
        }else{
          app.showMoreError = data.data.message;
        }
      })
    };
  })

  .controller('editCtrl' , function($scope, $routeParams, $timeout, User){
    app = this;
    $scope.nameTab= 'active';

    app.phase1 = true;

    User.getUser($routeParams.id).then(function(data){
      console.log("reciving data on start");
      console.log(data);
      if(data.data.success){
        $scope.newName = data.data.user.name;
        $scope.newEmail = data.data.user.email;
        $scope.newUsername = data.data.user.username;
        $scope.newPermission = data.data.user.permission;
        app.currentUser = data.data.user._id;

      }else{
        app.errorMsg = data.data.message;
      }
    });

    app.namePhase = function(){
      $scope.nameTab = "active";
      $scope.usernameTab = "default";
      $scope.emailTab = "default";
      $scope.persmissionsTab = "default";
      app.phase1 = true;
      app.phase2 = false;
      app.phase3 = false;
      app.phase4 = false;
    };
    app.usernamePhase = function(){
      $scope.nameTab = "default";
      $scope.usernameTab = "active";
      $scope.emailTab = "default";
      $scope.persmissionsTab = "default";
      app.phase1 = false;
      app.phase2 = true;
      app.phase3 = false;
      app.phase4 = false;
    };
    app.emailPhase= function(){
      $scope.nameTab = "default";
      $scope.usernameTab = "default";
      $scope.emailTab = "active";
      $scope.persmissionsTab = "default";
      app.phase1 = false;
      app.phase2 = false;
      app.phase3 = true;
      app.phase4 = false;
    };
    app.permissionsPhase = function(){
      $scope.nameTab = "default";
      $scope.usernameTab = "default";
      $scope.emailTab = "default";
      $scope.persmissionTab = "active";
      app.phase1 = false;
      app.phase2 = false;
      app.phase3 = false;
      app.phase4 = true;

      app.disableUser= false;
      app.disableModerator= false;
      app.disableAdmin= false;

      if($scope.newPermission === 'user'){
        app.disableUser = true;
      }else if($scope.newPermission === 'moderator'){
          app.disableModerator = true;
      }else if($scope.newPermission === 'admin'){
          app.disableAdmin = true;
      }
    };

    app.updateName= function(newName, valid){
      app.errorMsg = false;
      app.disabled = true;
      var userObject = {};

      if(valid){
        userObject._id = app.currentUser;
        userObject.name = $scope.newName;
        User.editUser(userObject).then(function(data){
          console.log(data);
          if(data.data.success){
            app.successMsg = data.data.message;
            $timeout(function(){
              app.nameForm.name.$setPristine();
              app.nameForm.name.$setUntouched();
              app.successMsg = false;
              app.disabled = false;
            }, 2000);
          }else{
            app.errorMsg = data.data.message;
            app.disabled = false;
          }
        });
      }else{
        app.errorMsg = "Please ensure form is filled out properly";
        app.disabled = false;
      }
    }

    app.updateEmail= function(newEmail, valid){
      app.errorMsg = false;
      app.disabled = true;
      var userObject = {};
      if(valid){
        userObject._id = app.currentUser;
        userObject.email = $scope.newEmail;
        console.log(userObject);
        User.editUser(userObject).then(function(data){
          console.log(data);
          if(data.data.success){
            app.successMsg = data.data.message;
            $timeout(function(){
              app.emailForm.email.$setPristine();
              app.emailForm.email.$setUntouched();
              app.successMsg = false;
              app.disabled = false;
            }, 2000);
          }else{
            app.errorMsg = data.data.message;
            app.disabled = false;
          }
        });
      }else{
        app.errorMsg = "Please ensure form is filled out properly";
        app.disabled = false;
      }
    }

    app.updateUsername= function(newUsername, valid){
      app.errorMsg = false;
      app.disabled = true;
      var userObject = {};
      if(valid){
        userObject._id = app.currentUser;
        userObject.username = $scope.newUsername;
        console.log(userObject);
        User.editUser(userObject).then(function(data){
          console.log(data);
          if(data.data.success){
            app.successMsg = data.data.message;
            $timeout(function(){
              app.usernameForm.username.$setPristine();
              app.usernameForm.username.$setUntouched();
              app.successMsg = false;
              app.disabled = false;
            }, 2000);
          }else{
            app.errorMsg = data.data.message;
            app.disabled = false;
          }
        });
      }else{
        app.errorMsg = "Please ensure form is filled out properly";
        app.disabled = false;
      }
    }

    app.updatePermissions= function(newPermission, valid){
      app.disableUser = true;
      app.disableModerator = true;
      app.disableAdmin = true;

      app.errorMsg = false;
      app.disabled = true;
      var userObject = {};

      if(valid){
        userObject._id = app.currentUser;
        userObject.permission = newPermission;
        console.log(userObject);
        User.editUser(userObject).then(function(data){

          console.log(data);
          if(data.data.success){
            app.successMsg = data.data.message;
            $timeout(function(){
              if(newPermission === 'user'){
                $scope.newPermission = "user";
                app.disableUser = true;
                app.disableModerator = false;
                app.disableAdmin = false;
              }else if(newPermission === 'moderator'){
                $scope.newPermission = "moderator";
                app.disableUser = false;
                app.disableModerator = true;
                app.disableAdmin = false;
              }else if(newPermission === 'admin'){
                $scope.newPermission = "admin";
                app.disableUser = false;
                app.disableModerator = false;
                app.disableAdmin = true;
              }
            }, 2000);
          }else{
            app.errorMsg = data.data.message;
            app.disabled = false;
          }
        });
    };

  }
});
