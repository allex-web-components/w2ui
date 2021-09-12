(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function createGrid (execlib, applib) {
  'use strict';
  
  var lib = execlib.lib,
    WebElement = applib.getElementType('WebElement');

  function isColumnObject (obj) {
    return obj &&
      lib.isString(obj.field) &&
      lib.isString(obj.text) &&
      lib.isString(obj.size);
  }

  function checkOptionsColumns (options) {
    var gridconf;
    if (!options) {
      throw new lib.Error('NO_OPTIONS', 'options must exist');
    }
    if (!options.w2uigrid) {
      throw new lib.Error('NO_OPTIONS_W2UIGRID', 'options must have "w2uigrid" config object');
    }
    gridconf = options.w2uigrid;
    if (!lib.isArray(gridconf.columns)) {
      throw new lib.Error('NO_GRIDCONFIG_COLUMNS', 'options.w2uigrid must have "columns" as an Array of column Objects');
    }
    if (!gridconf.columns.every(isColumnObject)) {
      throw new lib.Error('INVALID_COLUMN_OBJECT', 'column Object must have fields "field", "text" and "size"');
    }
  }

  function W2UIGridElement (id, options) {
    WebElement.call(this, id, options);
    this.data = null;
    checkOptionsColumns(options);
    this.set('data', options.data);
  }
  lib.inherit(W2UIGridElement, WebElement);
  W2UIGridElement.prototype.doThejQueryCreation = function () {
    WebElement.prototype.doThejQueryCreation.call(this);
    if (this.$element && this.$element.length) {
      this.$element.w2grid(lib.extend({
        name: this.id,
      },this.getConfigVal('w2uigrid')));
    }
      /*
        show: {      // config grid toolbar, header and footer
          toolbar: true,
          header: true,
          footer: true,
          toolbarAdd: false,
          toolbarDelete: false,
          toolbarEdit: false
        },
        columns: this.getConfigVal('columns')
      });
    }
      */
  };
  W2UIGridElement.prototype.set_data = function (data) {
    this.data = data;
    if (lib.isArray(data)) {
      w2ui[this.id].add(data.map(w2uiDataer));
      w2ui[this.id].refresh();
    }
  };

  function w2uiDataer(record, index) {
    if (!('recid' in record)) {
      record.recid = index;
    }
    //set the w2ui styling, if any
    return record;
  }

  applib.registerElementType('W2UIGrid', W2UIGridElement);
}
module.exports = createGrid;

},{}],2:[function(require,module,exports){
function createElements (execlib) {
  'use strict';

  var lR = execlib.execSuite.libRegistry,
    applib = lR.get('allex_applib');

  require('./gridcreator')(execlib, applib);

}
module.exports = createElements;

},{"./gridcreator":1}],3:[function(require,module,exports){
(function (execlib) {
  'use strict';

  require('./elements')(execlib);
})(ALLEX);

},{"./elements":2}]},{},[3]);
