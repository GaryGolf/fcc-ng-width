import * as angular from 'angular';
import * as styles from './dimension.css';


export const dimension:angular.IComponentOptions = {
  bindings: {
    ngModel: '<'
  },
  require: { ngModelCtrl: 'ngModel' },
  controller: [ '$scope', function ($scope) {
    this.options = ['-', 'px', 'em', 'auto', '%'];
    this.state = { value: 0, prefix: 'auto' };

    this.$onInit = () => {
      this.state = this.parseState(this.ngModel);
    }

    this.onInputChange = () => {
      const { value, prefix } = this.state;
      if(!!value && (prefix == "-" || prefix == 'auto')) { 
          this.state.prefix = 'px';
      }
      this.ngModel = this.state.value + this.state.prefix;
      this.ngModelCtrl.$setViewValue(this.ngModel);
    }

    this.onSelectChange = () => {
      const { value, prefix } = this.state;
      switch(prefix) {
        case '-' :
          this.state.value = 0;
          this.ngModel = 0;
          break;
        case 'auto' :
          this.state.value = '';
          this.ngModel = prefix;
          break;
        default :
          if (value == '') this.state.value = 0;
          this.ngModel = this.state.value + prefix;
      }
      this.ngModelCtrl.$setViewValue(this.ngModel);
    }

    this.parseState = value => {

      const v = parseFloat(value);
      const p = value.split(/\d|[.]/i).pop().trim();
      const isExist = this.options.includes(p);

      if (!isExist || value == 'auto' ) return { value: '', prefix: 'auto' };

      if(!p || !v) return { value: 0, prefix: '-' };

      return { value: v, prefix: p };
    }
  }],
  controllerAs: 'vm',
  template: `
    <div class="${styles.dimension}">
      <input 
        type="number" 
        data-ng-model="vm.state.value" 
        data-ng-change="vm.onInputChange()"
      />
      <select 
        data-ng-model="vm.state.prefix"
        data-ng-change="vm.onSelectChange()"
      >
        <option 
          value="{{opt}}"
          data-ng-repeat="opt in vm.options" 
        >
          {{opt}}
        </option>
      </select>
    </div>
  `
};
