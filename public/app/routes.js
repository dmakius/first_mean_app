
var app = angular.module("appRoutes", ['ngRoute'])
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
    controllerAs:'register',
    authenticated: false
  })
  .when('/login', {
    templateUrl:'app/views/pages/users/login.html',
    authenticated: false
  })
  .when('/logout', {
    templateUrl:'app/views/pages/users/logout.html',
    authenticated: true
  })
  .when('/profile', {
    templateUrl:'app/views/pages/users/profile.html',
    authenticated: true
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

app.run(['$rootScope','Auth', '$location' ,function($rootScope, Auth, $location){
  $rootScope.$on('$routeChangeStart', function(event, next, current){
    //Scenario: User is going to a authenticated page, check that user IS Authentication
    //note:cevent.preventDefault(); stops the routing
    if(next.$$route.authenticated == true){
      if(!Auth.isLoggedIn()){
        console.log("needs to authenticated");
        event.preventDefault();
        $location.path('/');
      }
    //Scenario: User is going to a NON Authenticated page, check that user is NOT Authneticated
    }else if(next.$$route.authenticated == false){
      if(Auth.isLoggedIn()){
        console.log("should not be  authenticated");
        event.preventDefault();
        $location.path('/profile');
      }
    }else{
      console.log("Authentication does not matter");
    }
  })
}]);
