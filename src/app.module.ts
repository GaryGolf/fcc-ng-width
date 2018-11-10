import * as angular from 'angular';
import * as template from './app.module.html'

export const AppModule = angular.module('app', [])
  .component('appModule', { template,
    controller: function MainModuleController() {
      this.message = 'world';
    }
  });
