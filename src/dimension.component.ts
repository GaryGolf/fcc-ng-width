import { IController, INgModelController, IComponentOptions }  from 'angular';
import * as styles from './dimension.css';

interface State {
  value: string;
  prefix: string;
}

export class DimensionController implements IController {
  
  private options: string[] = ['-', 'auto', 'px', '%'];
  private state: State;
  private ngModelCtrl: INgModelController;
  private menuItems: string[];

  $onInit() {
    this.ngModelCtrl.$render = this.onPropsChange;
    if(this.menuItems) {
      this.options = [...this.menuItems];
      ['auto', '-'].forEach(v => {
        if(!this.options.includes(v)) this.options.unshift(v);
      });
    }

    this.split('123rem123');
    this.split('123rem123pt')
    this.split('.3rem')
    this.split('0.3rem')
  }

  private split = v => {
   console.log(v, v.split(/\d+/).filter(q => !['','.'].includes(q)))
  }


  private onPropsChange = () => {
    this.state = this.parseState(this.ngModelCtrl.$viewValue);
  }


  private onSelectChange = () => {
    const { value, prefix } = this.state;

    switch(prefix) {
      case '-':
        this.state = { value: '0', prefix: '-' };
        this.ngModelCtrl.$setViewValue('0');
        return;
      case 'auto':
        this.state = { value: 'auto', prefix: '-' };
        this.ngModelCtrl.$setViewValue('auto');
        return;
      default: 
        const val = value != 'auto' ? value + prefix : '0' + prefix;
        this.state = this.parseState(val);
        const output = this.state.value + this.state.prefix;
        this.ngModelCtrl.$setViewValue(output);
        return;
    }
  }


  private onInputChange = () => {
    const { value, prefix } = this.state;

    if (this.isValid(value)) {

      const state:State = this.parseState(value);
      if (this.options.includes(state.prefix)) this.state = state;
      else this.state.prefix = '-';
        
      this.ngModelCtrl.$setViewValue(value);
      
    } else if(this.isValid(value + prefix)) {
      this.ngModelCtrl.$setViewValue(value + prefix);
    } 
  }

  private isValid = (value: string): boolean => {

    if(!value) return false;
    const lenUnits = ['%', 'px', 'cm', 'mm', 'in', 'pc', 'pt', 'ch', 'em', 'ex', 'rem', 'vh', 
    'vw', 'vmin', 'vmax'];
    const val = parseFloat(value);
    const prf = value.split(/\d|[.]/i).pop().trim();
    const hasNoDoubles = value.split(/\d+/).filter(v => !['','.'].includes(v)).length < 2;

    if(
      ['0', 'auto'].includes(value) ||  // '0' or 'auto'
      /^\d|\.\d/.test(value) &&         // leading number or comma
      /\D$/.test(value) &&              // trailing symbol is not a number
      value.split('.').length < 3 &&    // has only one comma
      !isNaN(val) &&                    // is a number
      lenUnits.includes(prf) &&         // matches prefix
      hasNoDoubles                      // remove double value
    ) return true;
    return false;
  }

  private parseState = (value:string):State => {

    const v = '' + parseFloat(value);
    const p = value.split(/\d|[.]/i).pop().trim();
    const isValid = this.isValid(value);
    const isExist = this.options.includes(p);

    if (value == 'auto') return { value, prefix: '-' };
    else if (isValid && isExist) return { value: v, prefix: p };
    else if(isValid) return { value, prefix: '-' };
    else return { value: '0', prefix: '-' };
  }

}


export const dimension:IComponentOptions = {
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
