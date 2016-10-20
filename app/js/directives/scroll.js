APP.directive('scrollDrt', ['$window', function($window){   
  return{                                                           
    restrict: 'E',
    template: '<div id="scroll"></div>',
    link: function postLink(scope, element, attrs){
      $window.addEventListener('scroll', function(){
        const diff = element[0].offsetTop - this.scrollY;
        if (diff < 1000) {
          if (!scope.page('isLoading')) {
            // scope.page('LoadBegin');
            // scope.loadPage();
          }
          /*
          if (!scope.isLoadingPage()) {
            scope.beginLoadPage();
            scope.loadPage();
          }
          */
        }
      });
    }
  };
}]);




APP.directive('onClickRow', ['$window', function($window){   
  return{                                                           
    restrict: 'A',
    link: function postLink(scope, element, attrs){
      const ele = element[0];
      ele.onclick = function() {
        console.log('click');
      };

      ele.ondblclick = function(e) {
        if ($(ele).attr('readonly')) {
          $(ele).attr('readonly', false).focusout(() => {
            $(ele).attr('readonly', true);
          });
        }
      };
    }
  };
}]);


APP.directive('tableFixedHeader', ['$window', function($window){   
  return{                                                           
    restrict: 'A',
    link: function postLink(scope, element, attrs){
      let isActive = false;
      $window.addEventListener('scroll', function(){
        const ele = element[0];
        const diff = ele.offsetTop - this.scrollY;
        // toriaezu -654

        if (diff <= -654 && !isActive) {
          isActive = true;
          const copy = ele.cloneNode(true);
          copy.style.position = "fixed";
          copy.style.top = "0";
          
          ele.parentNode.appendChild(copy);
        }

        if (diff > -654 && isActive) {
          isActive = false;
          console.log('back');
        }
      });
    }
  };
}]);

APP.directive('toggleNavClass', [function(){   
  return{                                                           
    restrict: 'A',
    link: function postLink(scope, element, attrs){
      const bodyEle = $('body');
      element[0].onclick = function() {
        bodyEle.toggleClass('nav-md').toggleClass('nav-sm');
      };
    }
  };
}]);

APP.directive('dataRowVal', [function(){   
  return{                                                           
    restrict: 'A',
    link: function postLink(scope, element, attrs){
      const e = element[0];
      console.log(e);
      e.ondblclick = function() {
        console.log(this);
      };
      e.onclick = function() {
        console.log(this);
      };
    }
  };
}]);


APP.directive('modalCheckerSmall', ['$parse', function($parse){   
  return{                                                           
    restrict: 'E',
    template: `<div class="modal fade bs-example-modal-sm in" tabindex="-1" role="dialog" aria-hidden="true" id="{{ sid }}">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">

        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span>
          </button>
          <h4 class="modal-title" id="myModalLabel2">{{ title }}</h4>
        </div>
        <div class="modal-body">
          <ul class="to_do">
            <li ng-repeat="data in datas">
              <p>
              <label>
                <input type="checkbox" class="flat" ng-checked="data.checked" name="{{ $index }}"/>
              {{ data.label }}
              </label>
              </p>
            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" ng-click="modalOnClick()">OK</button>
        </div>

      </div>
    </div>
  </div>`,
    link: function postLink(scope, element, attrs){
      scope.sid = attrs.sid;
      scope.title = attrs.title;
      scope.modalChecks = {};

      scope.$watch(attrs.datakey, () => {
        if (attrs.datas) {
          const _datas = _.map(JSON.parse(attrs.datas), (_data) => {
            return {
              label: _data,
              checked: true
            };
          });
          scope.datas = _datas;
          setTimeout(() => {
            $("input").iCheck({
              checkboxClass: "icheckbox_flat-green"
            });

            $('input').on('ifChanged', (e) => {
              const num = $(e.currentTarget).attr('name');
              scope.datas[num].checked = !scope.datas[num].checked;
            });
          }, 100);
        }
      });

      scope.modalOnClick = function() {
        scope[attrs.callback](scope.datas);
        $(`#${scope.sid}`).modal('hide');
      };
      
    }
  };
}]);


APP.directive('scrollE', [function(){   
  return{                                                           
    restrict: 'A',
    link: function postLink(scope, element, attrs){
      const ele = element[0];
      ele.addEventListener('scroll', () => {
        const scrollTotal = ele.scrollHeight - ele.clientHeight;
        const diff = scrollTotal - ele.scrollTop;
        if (diff < (scrollTotal / 10)) {
          /*
          if (!scope.isLoadingPage()) {
            scope.beginLoadPage();
            scope.loadPage();
          }
          */
          if (!scope.page('isLoading')) {
            scope.page('LoadBegin');
            scope.page('load');
            // scope.loadPage();
          }
        }
      });
    }
  };
}]);