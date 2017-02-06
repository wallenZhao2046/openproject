// -- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
// ++

import {ContextMenuService} from '../context-menu.service';

function hasDropdownMenu(contextMenu:ContextMenuService, FocusHelper) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var menuName = attrs['target'],
        locals = {},
        afterFocusOn = attrs.afterFocusOn,
        positionRelativeTo = attrs['positionRelativeTo'],
        triggerOnEvent = (attrs['triggerOnEvent'] || 'click') + '.dropdown.openproject';

      function open(event) {
        var ignoreFocusOpener = true;
        // prepare locals, these define properties to be passed on to the context menu scope
        var localKeys = (attrs.locals || '').split(',').map(function (local) {
          return local.trim();
        });
        angular.forEach(localKeys, function (key) {
          locals[key] = scope[key];
        });

        return contextMenu.activate(menuName, event, locals, {
          my: 'right top',
          at: 'right bottom',
          of: positionRelativeTo ? element.find(positionRelativeTo) : element
        });
      }

      function close(ignoreFocusOpener) {
        contextMenu.close(ignoreFocusOpener).then(() => {
          if (!ignoreFocusOpener) {
            FocusHelper.focusElement(afterFocusOn ? element.find(afterFocusOn) : element);
          }
        });
      }

      element.on(triggerOnEvent, function (event) {
        event.preventDefault();
        event.stopPropagation();
        scope.$evalAsync(() => {
          open(event).then((menuElement) => {
            menuElement.find('.menu-item').first().focus();
          });
        });

      });
    }
  };
}

angular
  .module('openproject.uiComponents')
  .directive('hasDropdownMenu', hasDropdownMenu);