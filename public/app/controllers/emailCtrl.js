angular.module('emailController', [])

  .controller('emailCtrl', function($routeParams){
    console.log($routeParams.token);
  });
