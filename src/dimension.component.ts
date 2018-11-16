import { IController, INgModelController, IComponentOptions }  from 'angular';
import * as styles from './dimension.css';

interface State {
  value: string;
  prefix: string;
}

export class DimensionController implements IController {
  
  private defaultOptions = ['auto', 'px', '%'];
  private options: string[];
  private state: State;
  private ngModelCtrl: INgModelController;
  private menuItems: string[];

  $onInit() {
    this.ngModelCtrl.$render = this.onPropsChange;
    this.resetOptions();
  }


  private onPropsChange = () => {
    const state = this.parseState(this.ngModelCtrl.$viewValue);
    this.setState(state);
  }


  private onSelectChange = () => {
    const { value, prefix } = this.state;

    switch(prefix) {
      case 'auto':
        this.renderState('auto');
        break;
      default: 
        const val = value != 'auto' ? value + prefix : '0' + prefix;
        this.renderState(val);
    }
  }


  private onInputChange = () => {
    const { value, prefix } = this.state;

    if (this.isValid(value)) this.renderState(value);
    else if(this.isValid(value + prefix)) this.renderState();
  }


  private isValid = (value: string): boolean => {

    if(!value) return false;
    const lenUnits = ['%', 'px', 'cm', 'mm', 'in', 'pc', 'pt', 'ch', 'em', 'ex', 'rem', 'vh', 
      'vw', 'vmin', 'vmax'];

    const num = value.replace(/\D*$/,'');
    const suf = value.replace(/[0-9.-]/g, '');

    if (suf == 'auto') return true;
    return !isNaN(Number(num)) && lenUnits.includes(suf);
  }

  private parseState = (value:string):State => {

    const v = '' + parseFloat(value);
    const p = value.split(/\d|[.]/i).pop().trim();
    const isValid = this.isValid(value);

    if (value == 'auto') return { value, prefix: '-' };
    if (isValid) return { value: v, prefix: p };
    return { value: '0', prefix: 'px' };
  }


  private renderState = (val?:string) => {

    if (!!val) {
      const state = this.parseState(val);
      this.setState(state);
    }

    const { value, prefix } = this.state;
    const output = prefix != '-' ? value + prefix : value;
    this.ngModelCtrl.$setViewValue(output);
  }


  private setState = ({value, prefix}:State) => {
    this.resetOptions();
    if (!this.options.includes(prefix)) this.options.push(prefix);
    this.state = { value, prefix };
  }


  private resetOptions = () => {
    this.options = !this.menuItems ? [...this.defaultOptions] : [...this.menuItems];
    // if(!this.options.includes('auto')) this.options.unshift('auto');
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
