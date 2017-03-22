
angular.module("appRoutes", ['ngRoute'])
.config(function($routeProvider,  $locationProvider){
  $routeProvider
  .when('/', {
    templateUrl:'app/views/pages/home.html'
  })
  .when('/about', {
    templateUrl:'app/views/pages/about.html'
  })
  .when('/register',{
    templateUrl:'app/views/pages/users/register.html',
    controller :'regCtrl',
    controllerAs:'register'
  })
  .when('/login', {
    templateUrl:'app/views/pages/users/login.html'
  })
  .when('/logout', {
    templateUrl:'app/views/pages/users/logout.html'
  })
  .otherwise({
    templateUrl:'app/views/pages/home.html'
  });

//gets rid of the '#' fromt he URL
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false });
    // Required to remove AngularJS hash from URL (no base is required in index file)

});
