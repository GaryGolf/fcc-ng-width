import * as angular from 'angular';

export const AppModule = angular.module('app',[])
  .controller('widthController', function($scope) {
    $scope.message="Hello Angular";
  });