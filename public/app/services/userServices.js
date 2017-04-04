angular.module('userServices', [])
.factory("User", function($http){
  var userFactory = {};
  // User.create(regData)
  userFactory.create = function(regData){
    return $http.post('/api/users', regData);
  };
  // User.checkusername(regData)
  userFactory.checkusername = function(regData){
    return $http.post('/api/checkusername', regData);
  };
  // User.checkemail(regData)
  userFactory.checkemail = function(regData){
    return $http.post('/api/checkemail', regData);
  };
  //User.activateAccount(token)
  userFactory.activateaccount = function(token){
    return $http.put('/api/activate/' + token);
  };
  //User.checkcredentials(loginData)
  userFactory.checkcredentials = function(resendData){
    return $http.post('/api/resend', resendData);
  };;

  //User.resendLink(username)
  userFactory.resendLink = function(username){
    return $http.put('/api/resend', username);
  };
  //User.sendUsername(userdata)
  userFactory.sendUsername = function(userDate){
    return $http.get('/api/resetusername/' + userDate);
  };
  //User.sendPassword(reserData)
  userFactory.sendPassword = function(resetData){
    return $http.put('/api/resetpassword/', resetData)
  };

  // User.resetUser(token)
  userFactory.resetUser = function(token){
    return $http.get('/api/resetpassword/' + token);
  };
  //User.savePassword(regData)
  userFactory.savePassword = function(regData){
    return $http.put('/api/changepassword', regData);
  }

  userFactory.renewSession = function(username){
    return $http.get('/api/renewusername/' + username);
  }

  userFactory.getPermission = function(){
    return $http.get('/api/permission');
  }

  userFactory.getUsers = function(){
    return $http.get('/api/management/');
  }

  userFactory.getUser = function(id){
    return $http.get('/api/edit/'+ id);
  }

  userFactory.deleteUser = function(username){
    return $http.delete('/api/management/deleteuser/'+ username);
  }

  userFactory.editUser = function(id){
    return $http.put('/api/edit' + id);
  }

  return userFactory;
});
