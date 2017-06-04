app.service('usersService', function ($http) {
    this.GetUser = function () {
        $http.get("/api/users").then(function (response) {
           return response.data;
        });
    }
});