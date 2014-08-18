angular.module('ngDropdowns', []).directive('dropdownSelect', [
  '$document', function($document) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        dropdownSelect: '=',
        dropdownModel: '=',
        dropdownOnchange: '&'
      },
      controller: [
        '$scope', '$element', '$attrs', function($scope, $element, $attrs) {
          var body;
          this.select = function(selected) {
            if (selected !== $scope.dropdownModel) {
              $scope.dropdownModel = selected;
            }
            $scope.dropdownOnchange({
              selected: selected
            });
          };
          body = $document.find("body");
          body.bind("click", function() {
            $element.removeClass('active');
          });
          $element.bind('click', function(event) {
            event.stopPropagation();
            $('.wrap-dd-select').each(function(){
              if ($(this)[0] !== $element[0]) {
                $(this).removeClass('active');
              }
            });
            $element.toggleClass('active');
          });
        }
      ],
      template: "<div class='wrap-dd-select'><span class='selected'>{{dropdownModel}}</span><ul class='dropdown'><li ng-repeat='item in dropdownSelect' class='dropdown-item' dropdown-select-item='item'></li></ul></div>"
    };
  }
]).directive('dropdownSelectItem', [
  function() {
    return {
      require: '^dropdownSelect',
      replace: true,
      scope: {
        dropdownItemLabel: '=',
        dropdownSelectItem: '='
      },
      link: function(scope, element, attrs, dropdownSelectCtrl) {
        scope.selectItem = function(ev) {
          ev.preventDefault();
          dropdownSelectCtrl.select(scope.dropdownSelectItem);
        };
      },
      template: "<li><a href='#' class='dropdown-item' ng-click='selectItem($event)'>{{dropdownSelectItem}}</a></li>"
    };
  }
]).directive('dropdownMenu', [
  '$parse', '$compile', '$document', function($parse, $compile, $document) {
    var template;
    template = "<ul class='dropdown'><li ng-repeat='item in dropdownMenu' class='dropdown-item' dropdown-menu-item='item'></li></ul>";
    return {
      restrict: 'A',
      replace: false,
      scope: {
        dropdownMenu: '=',
        dropdownModel: '=',
        dropdownOnchange: '&'
      },
      controller: [
        '$scope', '$element', '$attrs', function($scope, $element, $attrs) {
          var $template, $wrap, body, tpl;
          $template = angular.element(template);
          $template.data('$dropdownMenuController', this);
          tpl = $compile($template)($scope);
          $wrap = angular.element("<div class='wrap-dd-menu'></div>");
          $element.replaceWith($wrap);
          $wrap.append($element);
          $wrap.append(tpl);
          this.select = function(selected) {
            if (selected !== $scope.dropdownModel) {
              $scope.dropdownModel = selected;
            }
            $scope.dropdownOnchange({
              selected: selected
            });
          };
          body = $document.find("body");
          body.bind("click", function() {
            tpl.removeClass('active');
          });
          $element.bind("click", function(event) {
            event.stopPropagation();
            tpl.toggleClass('active');
          });
        }
      ]
    };
  }
]).directive('dropdownMenuItem', [
  function() {
    return {
      require: '^dropdownMenu',
      replace: true,
      scope: {
        dropdownMenuItem: '=',
        dropdownItemLabel: '='
      },
      link: function(scope, element, attrs, dropdownMenuCtrl) {
        scope.selectItem = function(ev) {
          ev.preventDefault();
          dropdownMenuCtrl.select(scope.dropdownMenuItem);
        };
      },
      template: "<li><a href='#' class='dropdown-item' ng-click='selectItem($event)'>{{dropdownMenuItem}}</a></li>"
    };
  }
]);
