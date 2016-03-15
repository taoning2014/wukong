exports.welcomeTitle = function() {
  return {
    controller: 'WelcomeTitleController',
    templateUrl: '/views/welcome-title.html'
  };
};

exports.userAttributeBoard = function() {
  return {
    controller: 'UserAttributeBoard',
    templateUrl: '/views/user-attribute-board.html'
  };
};

exports.projectList = function() {
  return {
    controller: 'ProjectListController',
    templateUrl: '/views/project-list.html'
  };
};

exports.dynamicNews = function() {
  return {
    controller: 'DynamicNewsController',
    templateUrl: '/views/dynamic-news.html'
  };
};
