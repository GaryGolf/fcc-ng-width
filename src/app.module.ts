import * as angular from 'angular';
import dimension from './dimension.component';

export const AppModule = angular.module('app', [])
  .component('dimension', dimension)
  .component('appModule', { 
    template: `
      <div data-ng-click="$ctrl.onClick()">
        Hello {{$ctrl.message}}
        <dimension/>
      </div>
    `,
    controller: function MainModuleController() {
      this.message = 'world';
      this.onClick = function(e) {
        console.log('click', e)
      }
    }
  });
  
  
