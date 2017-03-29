angular.module("userApp",
  ["appRoutes", "userController", "mainController",
   "emailController", "userServices", "authServices",
  "ngAnimate" ])
.config(function($httpProvider){
  //adds login token to all headers
  $httpProvider.interceptors.push("AuthInterceptors");
});
