'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createStyleManager = createStyleManager;

var _jssVendorPrefixer2 = require('jss-vendor-prefixer');

var _jssVendorPrefixer3 = _interopRequireDefault(_jssVendorPrefixer2);

var _murmurhash3_gc = require('murmurhash-js/murmurhash3_gc');

var _murmurhash3_gc2 = _interopRequireDefault(_murmurhash3_gc);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _jssVendorPrefixer = (0, _jssVendorPrefixer3.default)(),
    onProcessStyle = _jssVendorPrefixer.onProcessStyle;

/**
 * Creates a new styleManager
 */


function createStyleManager() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      jss = _ref.jss,
      _ref$theme = _ref.theme,
      theme = _ref$theme === undefined ? {} : _ref$theme;

  if (!jss) {
    throw new Error('No JSS instance provided');
  }

  var sheetMap = [];
  var sheetOrder = void 0;

  /**
   * styleManager
   */
  var styleManager = {
    get sheetMap() {
      return sheetMap;
    },
    get sheetOrder() {
      return sheetOrder;
    },
    setSheetOrder: setSheetOrder,
    jss: jss,
    theme: theme,
    render: render,
    reset: reset,
    rerender: rerender,
    getClasses: getClasses,
    updateTheme: updateTheme,
    prepareInline: prepareInline,
    sheetsToString: sheetsToString
  };

  updateTheme(theme, false);

  function render(styleSheet) {
    var index = getMappingIndex(styleSheet.name);

    if (index === -1) {
      return renderNew(styleSheet);
    }

    var mapping = sheetMap[index];

    if (mapping.styleSheet !== styleSheet) {
      jss.removeStyleSheet(sheetMap[index].jssStyleSheet);
      sheetMap.splice(index, 1);

      return renderNew(styleSheet);
    }

    return mapping.classes;
  }

  /**
   * Get classes for a given styleSheet object
   */
  function getClasses(styleSheet) {
    var mapping = (0, _utils.find)(sheetMap, { styleSheet: styleSheet });
    return mapping ? mapping.classes : null;
  }

  /**
   * @private
   */
  function renderNew(styleSheet) {
    var name = styleSheet.name,
        createRules = styleSheet.createRules,
        options = styleSheet.options;

    var sheetMeta = name + '-' + styleManager.theme.id;

    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && (typeof document === 'undefined' ? 'undefined' : _typeof(document)) === 'object') {
      var element = document.querySelector('style[data-jss][data-meta="' + sheetMeta + '"]');
      if (element) {
        options.element = element;
      }
    }

    var rules = createRules(styleManager.theme);
    var jssOptions = _extends({
      name: name,
      meta: sheetMeta
    }, options);

    if (sheetOrder && !jssOptions.hasOwnProperty('index')) {
      var index = sheetOrder.indexOf(name);
      if (index === -1) {
        jssOptions.index = sheetOrder.length;
      } else {
        jssOptions.index = index;
      }
    }

    var jssStyleSheet = jss.createStyleSheet(rules, jssOptions);

    var _jssStyleSheet$attach = jssStyleSheet.attach(),
        classes = _jssStyleSheet$attach.classes;

    sheetMap.push({ name: name, classes: classes, styleSheet: styleSheet, jssStyleSheet: jssStyleSheet });

    return classes;
  }

  /**
   * @private
   */
  function getMappingIndex(name) {
    var index = (0, _utils.findIndex)(sheetMap, function (obj) {
      if (!obj.hasOwnProperty('name') || obj.name !== name) {
        return false;
      }

      return true;
    });

    return index;
  }

  /**
   * Set DOM rendering order by sheet names.
   */
  function setSheetOrder(sheetNames) {
    sheetOrder = sheetNames;
  }

  /**
   * Replace the current theme with a new theme
   */
  function updateTheme(newTheme) {
    var shouldUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    styleManager.theme = newTheme;
    if (!styleManager.theme.id) {
      styleManager.theme.id = (0, _murmurhash3_gc2.default)(JSON.stringify(styleManager.theme));
    }
    if (shouldUpdate) {
      rerender();
    }
  }

  /**
   * Reset JSS registry, remove sheets and empty the styleManager.
   */
  function reset() {
    sheetMap.forEach(function (_ref2) {
      var jssStyleSheet = _ref2.jssStyleSheet;
      jssStyleSheet.detach();
    });
    sheetMap = [];
  }

  /**
   * Reset and update all existing stylesheets
   *
   * @memberOf module:styleManager~styleManager
   */
  function rerender() {
    var sheets = [].concat(_toConsumableArray(sheetMap));
    reset();
    sheets.forEach(function (n) {
      render(n.styleSheet);
    });
  }

  /**
   * Prepare inline styles using Theme Reactor
   */
  function prepareInline(declaration) {
    if (typeof declaration === 'function') {
      declaration = declaration(theme);
    }

    var rule = {
      type: 'regular',
      style: declaration
    };

    onProcessStyle(rule.style, rule);

    return rule.style;
  }

  /**
   * Render sheets to an HTML string
   */
  function sheetsToString() {
    return sheetMap.sort(function (a, b) {
      if (a.jssStyleSheet.options.index < b.jssStyleSheet.options.index) {
        return -1;
      }
      if (a.jssStyleSheet.options.index > b.jssStyleSheet.options.index) {
        return 1;
      }
      return 0;
    }).map(function (sheet) {
      return sheet.jssStyleSheet.toString();
    }).join('\n');
  }

  return styleManager;
}