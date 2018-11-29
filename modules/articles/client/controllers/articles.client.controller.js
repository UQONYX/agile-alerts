(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$state', '$window', 'articleResolve', 'Authentication', 'Notification'];

  function ArticlesController($scope, $state, $window, article, Authentication, Notification) {
    var vm = this;

    vm.article = article;
    vm.authentication = Authentication;
    vm.apply = apply;
    vm.form = {};

    function apply() {
      vm.article.apply()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        console.log("success!");
        $state.go('articles.list'); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Job Applied for Successfully' });
      }

      function errorCallback(res) {
        console.log(res)
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Job Apply Error!' });
      }
      
    }
  }
}());
