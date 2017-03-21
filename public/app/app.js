angular.module("userApp",
  ["appRoutes",
  "userController", "mainController",
  "userServices", "authServices",
  "ngAnimate"])
.config(function(){
  console.log("testing user application");
});
