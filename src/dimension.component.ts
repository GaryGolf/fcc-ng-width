import { IController, INgModelController, IComponentOptions }  from 'angular';
// import './dimension.css';

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


  private isValid(value: string): boolean {

    if(!value) return false;
    const lenUnits = ['%', 'px', 'cm', 'mm', 'in', 'pc', 'pt', 'ch', 'em', 'ex', 'rem', 'vh', 
      'vw', 'vmin', 'vmax'];

    const num = value.replace(/\D*$/,'');
    const suf = value.replace(/[0-9.-]/g, '');

    if (suf == 'auto') return true;
    return !isNaN(Number(num)) && lenUnits.includes(suf);
  }

  private parseState(value:string):State {

    const v = '' + parseFloat(value);
    const p = value.split(/\d|[.]/i).pop().trim();
    const isValid = this.isValid(value);

    if (value == 'auto') return { value, prefix: '-' };
    if (isValid) return { value: v, prefix: p };
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
    <div class="row">
      <div class="input-group col-lg-1">
        <input class="form-control text-right"
          type="text" 
          data-ng-model="vm.state.value" 
          data-ng-change="vm.onInputChange()"
          data-ng-value="vm.state.value"
        />
        <span class="input-group-addon" uib-dropdown is-open="false">
          <span uib-dropdown-toggle>
            {{vm.state.prefix}}
          </span>
          <ul class="dropdown-menu" uib-dropdown-menu>
            <li data-ng-repeat="item in vm.menuItems">
              <a data-ng-click="vm.onSelectChange(item)">{{item}}</a>
            </li>
          </ul>
        </span>
      </div>
    </div>
  `
};
