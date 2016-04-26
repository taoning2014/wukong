exports.WelcomeTitleController = function($scope, $http, $state, UserService) {
  $scope.user = UserService.user.data;
  if ($scope.user.profile) {
    $scope.isLogin = true;
    $scope.title = 'Welcome Back ' + $scope.user.data.github.name;
  } else {
    $scope.title = 'New hackers, welcome to join us!';
  }
  $scope.logout = function() {
    console.log('click logout');
    $http.get('api/auth/logout').then(function() {
      window.location.reload(true);
    });
  };
};


exports.TextDividerController = function($scope) {
  $scope.text = 'Recent Updates';
  $scope.description_l1 = 'Below is the detail of the latest interesting projects and talented hackers.';
  $scope.description_l2 = 'To see more, Please find a study group to join.';
};


exports.UserAttributeBoardController = function($scope) {
  $scope.range = [
    { label: 'Beginner' },
    { label: 'Level' },
    { label: 'Experience' },
    { label: 'Projects' },
    { label: 'Group' },
    { label: 'Profile' },
    { label: 'Registratered Events' },
    { label: 'Else' }
  ];
};

exports.DynamicNewsController = function($scope, $http) {
  $http.get("http://52.32.15.147:3000/events?counts=3")
   .then(function(response) {
      $scope.news = response.data;
   });
};

exports.ProjectListController = function($scope, $http) {
  $scope.selectedIndex = 0;
  $http.get("http://52.32.15.147:3000/posts?counts=0")
  .then(function(response) {
    var projects = response.data;
    var formatedProjects = [];
    projects.forEach(function(p, idx) {
      if(p.content && formatedProjects.length < 4) {
        var project = {
          thumbnail: p.images[0],
          projectNumber: "project" + idx,
          projectName: p.content,
          description: ''
        };
        formatedProjects.push(project);
      }
    });
    $scope.projects = formatedProjects;
  });
};

exports.GithubActivityController = function($scope, $http) {
  $http.get("https://api.github.com/users/Yuqin1990/events")
   .then(function(response) {
     var activity = [];
     response.data.forEach(function(a) {
       if(activity.length < 5) {
         activity.push({
           image: a.org? a.org.avatar_url : a.actor.avatar_url,
           userName: a.actor.login,
           type: a.type.replace(/([a-z](?=[A-Z]))/g, '$1 '),
           repoName: a.repo.name,
           createdAt: formateDate(a.created_at)
         });
       }
      });

      $scope.activity = activity;

   });
};

function formateDate( date ) {
  var fmDate = new Date(date);
  return fmDate.getFullYear() + '年' + fmDate.getMonth() + '月' + fmDate.getDate() + '日 ' + fmDate.getHours() + ':' + fmDate.getMinutes();
}
