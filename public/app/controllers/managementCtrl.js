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

  .controller('editCtrl' , function($scope, $routeParams){
    app = this;
    $scope.nameTab= 'active';
    app.phase1 = true;
    app.phase2 = false;
    app.phase3 = false;
    app.phase4 = false
    User.getUser($routeParams.id).then(function(data){
      if(data.data.success){
        $scope.newName = data.data.user.name;
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
      $scope.persmissionsTab = "active";
      app.phase1 = false;
      app.phase2 = false;
      app.phase3 = false;
      app.phase4 = true;
    };

    app.updateName= function(newName, valid){
      app.errorMsg = false;
      app.disabled = true;

      if(valid){

      }else{
        app.errorMsg = "Please ensure form is filled out properly";
        app.disabled = false;
      }
    }

  });
