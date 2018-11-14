import * as angular from 'angular';
import * as styles from './dimension.css';


export const dimension:angular.IComponentOptions = {
  bindings: {
    ngModel: '<',
    menuItems: '<'
  },
  require: { ngModelCtrl: 'ngModel' },
  controller: [ '$scope', function ($scope) {
    this.options = ['-', 'auto', 'px', '%'];
    this.savedValue = '';
    this.state = { value: 0, prefix: 'auto' };

    this.$onInit = () => {
      this.state = this.parseState(this.ngModel);
      this.savedValue = this.state.value;
      if(this.menuItems) {
        this.options = this.menuItems;
        ['px', '-', 'auto'].forEach(v => {
          if(!this.options.includes(v)) this.options.push(v)
        })
      }
    }

    this.onSelectChange = () => {
      const { value, prefix } = this.state;
      switch(prefix) {
        case '-' :
          this.state.value = 0;
          this.ngModel = 0;
          break;
        case 'auto' :
          this.state.value = 'auto';
          this.state.prefix = '-'
          this.ngModel = 'auto';
          break;
        default :
          if (isNaN(value)) this.state.value = 0;
          this.ngModel = this.state.value + prefix;
      }
      this.ngModelCtrl.$setViewValue(this.ngModel);
    }

    this.onInputChange = () => {
      const { value, prefix } = this.state;
      const validate = s => s.match(/^[0-9]*\.?[0-9]*$/);

      if (value == 'auto') {
        this.state.value = 0;
        this.state.prefix = 'px';
        this.savedValue = 0;
      } else if (!validate(value)) {
        this.state.value = this.savedValue;
      } else {
        this.savedValue = value;
      }

      if(prefix == '-') this.state.prefix = 'px';

      this.ngModel = this.state.value + this.state.prefix;
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
        type="text" 
        data-ng-model="vm.state.value" 
        data-ng-change="vm.onInputChange()"
        data-ng-value="vm.state.value"
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
