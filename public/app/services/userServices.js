angular.module('userServices', [])
.factory("User", function($http){
  var userFactory = {};
  // User.create(regData)
  userFactory.create = function(regData){
    return $http.post('/api/users', regData);
  }
  // User.checkusername(regData)
  userFactory.checkusername = function(regData){
    return $http.post('/api/checkusername', regData);
  }
  // User.checkemail(regData)
  userFactory.checkemail = function(regData){
    return $http.post('/api/checkemail', regData);
  }
  //User.activateAccount(token)
  userFactory.activateaccount = function(token){
    return $http.put('/api/activate/' + token);
  }
  //User.checkcredentials(loginData)
  userFactory.checkcredentials = function(){
    return $http.post('/api/resend', resendData);
  };

  //User.resendLink(username)
  userFactory.resendLink = function(){
    return$http.put('/api/resend', username)
  }
  return userFactory;
});
