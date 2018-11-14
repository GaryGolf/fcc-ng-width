import * as angular from 'angular';
import { dimension } from './dimension.component';

export const AppModule:angular.IModule = angular.module('app',[])
  .component({ dimension })
  .component('appModule', { 
    controller: [ function () {
      this.value = '12rem'; // initial value
    }],
    controllerAs: 'vm',
    template: `
    <div>
      <div>{{vm.value}}</div>
      <dimension 
        data-ng-model="vm.value"
      ></dimension>
    </div>
    `
  });
  