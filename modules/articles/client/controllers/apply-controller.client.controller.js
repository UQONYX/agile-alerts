(function() {
  'use strict';

  angular
    .module('articles')
    .controller('ApplyControllerController', ApplyControllerController);

  ApplyControllerController.$inject = ['$scope'];

  function ApplyControllerController($scope) {
    var vm = this;
    vm.article = article;

    // Apply controller controller logic
    // ...

    init();

    function init() {
      article.$apply();
    }
  }
})();
