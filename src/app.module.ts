import * as angular from 'angular';
import dimension from './dimension.component';

export const AppModule:angular.IModule = angular.module('app',[])
  .component({ dimension })
  .component('appModule', { 
    controller: [ '$scope', function ($scope) {
      this.dimension = 'auto';
     
    }],
    controllerAs: 'vm',
    template: `
    <div>
      <dimension 
        data-ng-model="vm.dimension"
      />
      <div>{{vm.dimension}}</div>
    </div>
    `
  });
  