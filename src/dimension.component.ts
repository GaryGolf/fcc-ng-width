import * as angular from 'angular';


const dimension:angular.IComponentOptions = {
  bindings: {
    ngModel: '='
  },
  controller: [ '$scope', function ($scope) {
    this.options = ['-', 'px', 'em', 'auto'];
    this.state = { value: 0, prefix: 'auto' };

    this.$onInit = () => {
      const v = this.parseState('12.rem')
      console.log('init', v)

    }

    this.onInputChange = () => {
      const { value, prefix } = this.state;
      if(!!value) {
        if(prefix == "-" || prefix == 'auto') this.state.prefix = 'px';
      }
      this.ngModel = this.state.value + this.state.prefix;
    }

    this.onSelectChange = () => {
      const { value, prefix } = this.state;
      switch(prefix) {
        case '-' :
          this.state.value = 0;
          this.ngModel = 0;
          return;
        case 'auto' :
          this.state.value = '';
          break;
        default :
          if (value == '') this.state.value = 0;
      }
      this.ngModel = this.state.value + this.state.prefix;
    }

    this.parseState = value => {

      if (value == 'auto') return { value: '', prefix: 'auto' };
      else if ( value == 0 ) return { value: 0, prefix: '-' };

      const p = value.split(/\d|[.]/i).pop().trim();
      const v = parseFloat(value);
      if(!p || !v) return { value: 0, prefix: '-' }
    }
  }],
  controllerAs: 'vm',
  template: `
    <div>
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

export default dimension;