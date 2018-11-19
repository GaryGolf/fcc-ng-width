import { IController, INgModelController, IComponentOptions }  from 'angular';
import './dimension.css';

interface State {
  value: string;
  unit: string;
}

export class DimensionController implements IController {

  static $inject: ['dropdown'];
  private state: State;
  private ngModelCtrl: INgModelController;
  private menuItems: string[];

  
  $onInit() {
    this.ngModelCtrl.$render = () => {
      this.state = this.parseState(this.ngModelCtrl.$viewValue);
    }
    this.menuItems = this.menuItems || ['px', '%'];
  }


  private onSelectChange(unit:string) {

    const { value } = this.state;
    let val = value + unit;

    if (unit == 'auto') val = 'auto';
    else if(value == 'auto') val = '0' + unit;
    this.renderState(val);
  }


  private onInputChange() {
    const { value, unit } = this.state;

    if (this.isValid(value)) this.renderState(value);
    else if(this.isValid(value + unit)) this.renderState();
  }


  private isValid(val: string): boolean {

    if(!val) return false;
    const lenUnits = ['%', 'px', 'cm', 'mm', 'in', 'pc', 'pt', 'ch', 'em', 'ex', 'rem', 'vh', 
      'vw', 'vmin', 'vmax'];

    const value = val.replace(/\D*$/,'');
    const unit = val.replace(/[0-9.-]/g, '');

    if (unit == 'auto') return true;
    return !isNaN(Number(value)) && lenUnits.includes(unit);
  }

  private parseState(val:string):State {

    if(!val) return { value: '0', unit: 'px' };
    
    const value = val.replace(/\D*$/,'');
    const unit = val.replace(/[0-9.-]/g, '');
    const isValid = this.isValid(val);

    if (val == 'auto') return { value: 'auto', unit: '-' };
    if (isValid) return { value, unit };
    return { value: '0', unit: 'px' };
  }


  private renderState(val?:string) {

    if (!!val) {
      this.state = this.parseState(val);
    }

    const { value, unit } = this.state;
    const output = unit != '-' ? value + unit : value;
    this.ngModelCtrl.$setViewValue(output);
  }

}


export const DimensionComponent:IComponentOptions = {
  bindings: {
    menuItems: '<'
  },
  require: { ngModelCtrl: 'ngModel' },
  controller:  DimensionController,
  template: `
    <div class="dimension" ng-class="{ active: $ctrl.active }">
      <div class="input-group">
        <input class="form-control text-right"
          type="text" 
          data-ng-model="$ctrl.state.value" 
          data-ng-change="$ctrl.onInputChange()"
          data-ng-focus="$ctrl.active = true"
          data-ng-blur="$ctrl.active = false"
          data-ng-value="$ctrl.state.value"
        />
        <span class="input-group-addon" 
          data-on-toggle="$ctrl.active = $ctrl.isopen"
          data-is-open="$ctrl.isopen"
          uib-dropdown 
          uib-dropdown-toggle
        >
          <span class="" >
            {{$ctrl.state.unit}}
          </span>
          <ul class="dropdown-menu" 
            aria-haspopup="true" 
            aria-expanded="true"
            uib-dropdown-menu
            is-open="$ctrl.isopen"
          >
            <li data-ng-repeat="item in $ctrl.menuItems">
              <a data-ng-click="$ctrl.onSelectChange(item)">{{item}}</a>
            </li>
          </ul>
        </span>
      </div>
    </div>
  `
};
