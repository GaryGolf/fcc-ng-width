import * as angular from 'angular';

export const AppModule = angular.module('app', [])
  .component('appModule', { 
    template: `
      <div ng-click="$ctrl.onClick()">
        Hello {{$ctrl.message}}
      </div>
    `,
    controller: function MainModuleController() {
      this.message = 'world';
      this.onClick = function(e) {
        console.log('click', e)
      }
    }
  });
