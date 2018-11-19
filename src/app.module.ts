import * as angular from 'angular';
import * as dropdown from 'angular-ui-bootstrap/src/dropdown'
import { DimensionComponent } from './dimension.component';

export const AppModule:angular.IModule = angular.module('app', [dropdown])
  .component('dimension', DimensionComponent )
  .component('appModule', { 
    controller: [ function () {
      this.value = '100%'; // initial value
    }],
    controllerAs: 'vm',
    template: `
    <div class="container">
      <input type="text" data-ng-model="vm.value" />
      <hr/>
      <dimension
        data-menu-items="['auto', 'px', '%', 'em', 'rem']"
        data-ng-model="vm.value"
      ></dimension>
      </div>
      `
  });
  