"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var development_core_1 = require('development-core');
var BaseLoader_1 = require('./BaseLoader');

var DirLoader = function (_BaseLoader_1$BaseLoa) {
    _inherits(DirLoader, _BaseLoader_1$BaseLoa);

    function DirLoader(option) {
        _classCallCheck(this, DirLoader);

        return _possibleConstructorReturn(this, (DirLoader.__proto__ || Object.getPrototypeOf(DirLoader)).call(this, option));
    }

    _createClass(DirLoader, [{
        key: 'load',
        value: function load(cfg) {
            var loader = this.option.loader;
            if (loader.dir) {
                return cfg.findTasksInDir(development_core_1.taskSourceVal(loader.dir));
            } else {
                return _get(DirLoader.prototype.__proto__ || Object.getPrototypeOf(DirLoader.prototype), 'load', this).call(this, cfg);
            }
        }
    }, {
        key: 'getTaskDefine',
        value: function getTaskDefine() {
            var loader = this.option.loader;
            if (!loader.configModule && !loader.module && loader.dir) {
                return development_core_1.findTaskDefineInDir(development_core_1.taskSourceVal(loader.dir));
            } else {
                return _get(DirLoader.prototype.__proto__ || Object.getPrototypeOf(DirLoader.prototype), 'getTaskDefine', this).call(this);
            }
        }
    }]);

    return DirLoader;
}(BaseLoader_1.BaseLoader);

exports.DirLoader = DirLoader;
//# sourceMappingURL=../sourcemaps/loaders/DirLoader.js.map
