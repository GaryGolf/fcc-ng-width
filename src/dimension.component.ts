import { IController, INgModelController, IComponentOptions }  from 'angular';
import './dimension.css';

interface State {
  lengthValue: string;
  unitLiteral: string;
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

    const { lengthValue } = this.state;
    let value = lengthValue + unit;

    if (unit == 'auto') value = 'auto';
    else if(lengthValue == 'auto') value = '0' + unit;
    this.renderState(value);
  }


  private onInputChange() {
    const { lengthValue, unitLiteral } = this.state;

    if (this.isValid(lengthValue)) this.renderState(lengthValue);
    else if(this.isValid(lengthValue + unitLiteral)) this.renderState();
  }


  private isValid(val: string): boolean {

    if(!val) return false;
    const lenUnits = ['%', 'px', 'cm', 'mm', 'in', 'pc', 'pt', 'ch', 'em', 'ex', 'rem', 'vh', 
      'vw', 'vmin', 'vmax'];

    const value = val.replace(/\D*$/,'');
    const unitLiteral = val.replace(/[0-9.-]/g, '');

    if (unitLiteral == 'auto') return true;
    return !isNaN(Number(value)) && lenUnits.includes(unitLiteral);
  }

  private parseState(val:string):State {

    if(!val) return { lengthValue: '0', unitLiteral: 'px' };
    
    const lengthValue = val.replace(/\D*$/,'');
    const unitLiteral = val.replace(/[0-9.-]/g, '');
    const isValid = this.isValid(val);

    if (val == 'auto') return { lengthValue: 'auto', unitLiteral: '-' };
    if (isValid) return { lengthValue, unitLiteral };
    return { lengthValue: '0', unitLiteral: 'px' };
  }


  private renderState(val?:string) {

    if (!!val) {
      this.state = this.parseState(val);
    }

    const { lengthValue, unitLiteral } = this.state;
    const output = unitLiteral != '-' ? lengthValue + unitLiteral : lengthValue;
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
          data-ng-model="$ctrl.state.lengthValue" 
          data-ng-change="$ctrl.onInputChange()"
          data-ng-focus="$ctrl.active = true"
          data-ng-blur="$ctrl.active = false"
          data-ng-value="$ctrl.state.lengthValue"
        />
        <span class="input-group-addon" 
          data-on-toggle="$ctrl.active = $ctrl.isopen"
          data-is-open="$ctrl.isopen"
          uib-dropdown 
          uib-dropdown-toggle
        >
          <span class="" >
            {{$ctrl.state.unitLiteral}}
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
