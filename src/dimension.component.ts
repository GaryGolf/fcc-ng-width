import { IController, INgModelController, IComponentOptions }  from 'angular';
import './dimension.css';

interface State {
  value: string;
  prefix: string;
}

export class DimensionController implements IController {

  static $inject: ['dropdown'];
  private state: State;
  private ngModelCtrl: INgModelController;
  private menuItems: string[];

  
  $onInit() {
    this.ngModelCtrl.$render = this.onPropsChange;
    this.menuItems = this.menuItems || ['px', '%'];
  }


  private onPropsChange = () => {
    this.state = this.parseState(this.ngModelCtrl.$viewValue);
  }

  private onSelectChange(prefix) {
    const { value } = this.state;
    this.state.prefix = prefix;

    switch(prefix) {
      case 'auto':
        this.renderState('auto');
        break;
      default: 
        const val = value != 'auto' ? value + prefix : '0' + prefix;
        this.renderState(val);
    }
  }


  private onInputChange() {
    const { value, prefix } = this.state;

    if (this.isValid(value)) this.renderState(value);
    else if(this.isValid(value + prefix)) this.renderState();
  }


  private isValid(val: string): boolean {

    if(!val) return false;
    const lenUnits = ['%', 'px', 'cm', 'mm', 'in', 'pc', 'pt', 'ch', 'em', 'ex', 'rem', 'vh', 
      'vw', 'vmin', 'vmax'];

    const value = val.replace(/\D*$/,'');
    const prefix = val.replace(/[0-9.-]/g, '');

    if (prefix == 'auto') return true;
    return !isNaN(Number(value)) && lenUnits.includes(prefix);
  }

  private parseState(val:string):State {

    if(!val) return { value: '0', prefix: 'px' };
    
    const value = val.replace(/\D*$/,'');
    const prefix = val.replace(/[0-9.-]/g, '');
    const isValid = this.isValid(val);

    if (val == 'auto') return { value: 'auto', prefix: '-' };
    if (isValid) return { value, prefix };
    return { value: '0', prefix: 'px' };
  }


  private renderState(val?:string) {

    if (!!val) {
      this.state = this.parseState(val);
    }

    const { value, prefix } = this.state;
    const output = prefix != '-' ? value + prefix : value;
    this.ngModelCtrl.$setViewValue(output);
  }

}


export const dimension:IComponentOptions = {
  bindings: {
    menuItems: '<'
  },
  require: { ngModelCtrl: 'ngModel' },
  controller:  DimensionController,
  controllerAs: 'vm',
  template: `
    <div class="dimension" ng-class="{ active: vm.active }">
      <div class="input-group">
        <input class="form-control text-right"
          type="text" 
          data-ng-model="vm.state.value" 
          data-ng-change="vm.onInputChange()"
          data-ng-focus="vm.active = true"
          data-ng-blur="vm.active = false"
          data-ng-value="vm.state.value"
        />
        <span class="input-group-addon" 
          data-on-toggle="vm.active = vm.isopen"
          data-is-open="vm.isopen"
          uib-dropdown 
          uib-dropdown-toggle
        >
          <span class="" >
            {{vm.state.prefix}}
          </span>
          <ul class="dropdown-menu" 
            aria-haspopup="true" 
            aria-expanded="true"
            uib-dropdown-menu
            is-open="vm.isopen"
          >
            <li data-ng-repeat="item in vm.menuItems">
              <a data-ng-click="vm.onSelectChange(item)">{{item}}</a>
            </li>
          </ul>
        </span>
      </div>
    </div>
  `
};
