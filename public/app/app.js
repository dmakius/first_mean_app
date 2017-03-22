angular.module("userApp",
  ["appRoutes",
  "userController", "mainController",
  "userServices", "authServices",
  "ngAnimate"])
.config(function($httpProvider){
  //adds login token to all headers
  $httpProvider.interceptors.push("AuthInterceptors");
});
