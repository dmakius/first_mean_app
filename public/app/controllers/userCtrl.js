
angular.module('userController', [])
.controller('regCtrl', function($http){
  this.regUser = function(regData){
    console.log("form submited");
    console.log(this.regData);
    $http.post('/api/users', this.regdata).then(function(data){
      console.log(data);
    });
  }
});
