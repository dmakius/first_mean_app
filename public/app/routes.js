
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
  .when('/activate/:token', {
    templateUrl:"app/views/pages/users/activation/activate.html",
    controller: "emailCtrl",
    controllerAs: 'email',
    authenticated: false
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

app.run(['$rootScope','Auth', '$location', "User" ,function($rootScope, Auth, $location, User){
  $rootScope.$on('$routeChangeStart', function(event, next, current){
    //Scenario: User is going to a authenticated page, check that user IS Authentication
    //note:cevent.preventDefault(); stops the routing
    if(next.$$route !== undefined){
      // Only perform if user visited a route listed above
      if(next.$$route.authenticated == true){
        // Check if authentication is required, then if permission is required
        if(!Auth.isLoggedIn()){
          console.log("needs to authenticated");
          event.preventDefault();
          $location.path('/');
        }else if(next.$$route.permission){
            User.getPermission().then(function(data){
              // Check if user's permission matches at least one in the array
              if (next.$$route.permission[0] !== data.data.permission) {
               if (next.$$route.permission[1] !== data.data.permission) {
                    event.preventDefault(); // If at least one role does not match, prevent accessing route
                    $location.path('/'); // Redirect to home instead
                  }
              }
            });
        }
        //Scenario: User is going to a NON Authenticated page, check that user is NOT Authneticated
        else if(next.$$route.authenticated == false){
            if(Auth.isLoggedIn()){
            console.log("should not be  authenticated");
            event.preventDefault();
            $location.path('/profile');
          }
      }else{
        console.log("Authentication does not matter");
      }
    }
  }
})
}]);
