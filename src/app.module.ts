import * as angular from 'angular';
import { dimension } from './dimension.component';

export const AppModule:angular.IModule = angular.module('app', [])
  .component({ dimension })
  .component('appModule', { 
    controller: [ function () {
      this.value = '100%'; // initial value
    }],
    controllerAs: 'vm',
    template: `
    <div>
      <div>ng-model: {{vm.value}}</div>
      <dimension 
        data-menu-items="['px', '%', 'em', 'rem', '-', 'auto']"
        data-ng-model="vm.value"
      ></dimension>
    </div>
    `
  });
  