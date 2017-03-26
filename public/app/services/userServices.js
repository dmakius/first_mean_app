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

  return userFactory;
});
