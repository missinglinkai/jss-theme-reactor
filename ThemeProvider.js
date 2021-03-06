'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultJssOptions = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createThemeProvider = createThemeProvider;

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _jss = require('jss');

var _jssPresetDefault = require('jss-preset-default');

var _jssPresetDefault2 = _interopRequireDefault(_jssPresetDefault);

var _styleManager = require('./styleManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createGenerateClassName = function createGenerateClassName() {
  var ruleCounter = 0;
  return function generateClassName(rule, sheet) {
    var str = '';

    ruleCounter += 1;
    str = rule.key ? rule.key + '-tr-' + ruleCounter : 'tr-' + ruleCounter;

    // Simplify after next release with new method signature
    if (sheet && sheet.options.name) {
      return sheet.options.name + '-' + str;
    }
    return str;
  };
};

var defaultJssOptions = exports.defaultJssOptions = Object.assign({}, (0, _jssPresetDefault2.default)(), {
  createGenerateClassName: createGenerateClassName
});

function createThemeProvider() {
  var createDefaultTheme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
    return {};
  };
  var createJss = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return (0, _jss.create)(defaultJssOptions);
  };

  var ThemeProvider = function (_Component) {
    _inherits(ThemeProvider, _Component);

    function ThemeProvider() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, ThemeProvider);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ThemeProvider.__proto__ || Object.getPrototypeOf(ThemeProvider)).call.apply(_ref, [this].concat(args))), _this), _this.theme = undefined, _this.styleManager = undefined, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ThemeProvider, [{
      key: 'getChildContext',
      value: function getChildContext() {
        var theme = this.theme,
            styleManager = this.styleManager;

        return {
          theme: theme,
          styleManager: styleManager
        };
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _ThemeProvider$create = ThemeProvider.createDefaultContext(this.props),
            theme = _ThemeProvider$create.theme,
            styleManager = _ThemeProvider$create.styleManager;

        this.theme = theme;
        this.styleManager = styleManager;
      }
    }, {
      key: 'componentWillUpdate',
      value: function componentWillUpdate(nextProps) {
        if (this.theme && nextProps.theme && nextProps.theme !== this.theme) {
          this.theme = nextProps.theme;

          if (this.styleManager) {
            this.styleManager.updateTheme(nextProps.theme);
          }
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return this.props.children;
      }
    }], [{
      key: 'createDefaultContext',
      value: function createDefaultContext() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var theme = props.theme || createDefaultTheme();
        var styleManager = props.styleManager || (0, _styleManager.createStyleManager)({
          theme: theme,
          jss: createJss()
        });
        return { theme: theme, styleManager: styleManager };
      }
    }]);

    return ThemeProvider;
  }(_react.Component);

  ThemeProvider.propTypes = {
    children: _propTypes2.default.node.isRequired,
    styleManager: _propTypes2.default.object,
    theme: _propTypes2.default.object
  };
  ThemeProvider.childContextTypes = {
    styleManager: _propTypes2.default.object.isRequired,
    theme: _propTypes2.default.object.isRequired
  };


  return ThemeProvider;
}

exports.default = createThemeProvider();