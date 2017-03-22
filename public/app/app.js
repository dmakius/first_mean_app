angular.module("userApp",
  ["appRoutes",
  "userController", "mainController",
  "userServices", "authServices",
  "ngAnimate"])
.config(function($httpProvider){
  $httpProvider.interceptors.push("AuthInterceptors");
});
