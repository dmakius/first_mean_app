angular.module('managementCtrl', [])
.controller("managementCtrl", function(User){
  var app = this;

  app.limit = 5;

  app.loading = true;
  app.accessDenied = true;
  app.errorMsg = false;
  app.editAccess = false;
  app.deleteAccess = false;

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


  });
