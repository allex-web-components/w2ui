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
      this.refresh();
    }
  };
  W2UIGridElement.prototype.refresh = function () {
    w2ui[this.id].refresh();
  };
  W2UIGridElement.prototype.queueRefresh = function () {
    lib.runNext(this.refresh.bind(this), 100);
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
