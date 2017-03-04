app.controller('myCtrl', function($scope, $http,$timeout) {
  $scope.show=false;
  $scope.InsertUser=function(){
  $http.post("/api/users",{'name':$scope.name}).then(function(response) {
  if(response.data){
   $scope.created=true;
   $timeout(function() {
   $scope.created=false;
        }, 3000); // 3 seconds
        $scope.GetUser();
      }
  });
  
  }

   $scope.GetUser=function(){
   $http.get("/api/users").then(function(response) {
     $scope.users=response.data;
     $scope.show=false;
   });
  }
  $scope.GetUser();
  $scope.UpdateUser=function(){
  $http.put("/api/users/"+$scope.id1,{'name':$scope.name1}).then(function(response) {   
       $scope.updated=true; 
       $timeout(function() {
       $scope.updated=false;
    }, 3000); // 3 seconds
    $scope.GetUser();
  });
  
  }

   $scope.DeleteUser=function(id){
   $http.delete("/api/users/"+id).then(function(response) {   
      $scope.deleted=true;
    $timeout(function() {
    $scope.deleted=false; 
    }, 3000); // 3 seconds
  $scope.GetUser();
    
  });
  }

$scope.Edit=function(dt){
  $scope.show=true;
  $scope.name1=dt.name;
  $scope.id1=dt._id;
  }
  
});