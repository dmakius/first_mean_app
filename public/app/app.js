console.log("app working!");
angular.module("userApp", ["appRoutes", "userController"])
.config(function(){
  console.log("testing user application");
});
