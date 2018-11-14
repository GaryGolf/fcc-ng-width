import { IController, INgModelController }  from 'angular';
import * as styles from './dimension.css';

interface State {
  value: any;
  prefix: string;
}

export class DimensionController implements IController {
  
  private options: string[] = ['-', 'auto', 'px', '%'];
  private savedValue: number | 'auto' = 0;
  private state: State;
  private ngModelCtrl: INgModelController;
  private menuItems: string[];

  $onInit = () => {
    this.ngModelCtrl.$render = this.onPropsChange;
    if(this.menuItems) {
      this.options = this.menuItems;
      ['px', '-', 'auto'].forEach(v => {
        if(!this.options.includes(v)) this.options.push(v);
      })
    }
  }


  private onPropsChange = () => {
    this.state = this.parseState(this.ngModelCtrl.$viewValue);
    this.savedValue = this.state.value;
  }


  private onSelectChange = () => {
    const { value, prefix } = this.state;
    let output: any
    switch(prefix) {
      case '-' :
        this.state.value = 0;
        output = 0;
        break;
      case 'auto' :
        this.state.value = 'auto';
        this.state.prefix = '-';
        output = 'auto';
        break;
      default :
        if (isNaN(value)) this.state.value = 0;
        output = this.state.value + prefix;
      }
      this.ngModelCtrl.$setViewValue(output);
  }


  private onInputChange = () => {
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

    this.ngModelCtrl.$setViewValue(this.state.value + this.state.prefix);
  }


  private parseState = (value:string):State => {

    const v = parseFloat(value);
    const p = value.split(/\d|[.]/i).pop().trim();
    const isExist = this.options.includes(p);

    if (!isExist || value == 'auto' ) return { value: 'auto', prefix: '-' };

    if(!p || !v) return { value: 0, prefix: '-' };

    return { value: v, prefix: p };
  }

}


export const dimension:angular.IComponentOptions = {
  bindings: {
    menuItems: '<'
  },
  require: { ngModelCtrl: 'ngModel' },
  controller: DimensionController,
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
