"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var development_core_1 = require('development-core');
var ModuleLoader_1 = require('./ModuleLoader');

var DirLoader = function (_ModuleLoader_1$Modul) {
    _inherits(DirLoader, _ModuleLoader_1$Modul);

    function DirLoader(option, env, factory) {
        _classCallCheck(this, DirLoader);

        return _possibleConstructorReturn(this, (DirLoader.__proto__ || Object.getPrototypeOf(DirLoader)).call(this, option, env));
    }

    _createClass(DirLoader, [{
        key: 'loadTasks',
        value: function loadTasks(context, def) {
            var loader = this.option.loader;
            if (loader.dir) {
                return context.findTasksInDir(development_core_1.taskSourceVal(loader.dir, context));
            } else {
                return _get(DirLoader.prototype.__proto__ || Object.getPrototypeOf(DirLoader.prototype), 'loadTasks', this).call(this, context, def);
            }
        }
    }, {
        key: 'getContextDefine',
        value: function getContextDefine() {
            var loader = this.option.loader;
            var self = this;
            if (!loader.configModule && !loader.module && loader.dir) {
                return development_core_1.findTaskDefineInDir(development_core_1.taskSourceVal(loader.dir, development_core_1.bindingConfig({ env: self.env, option: {}, createContext: self.factory })));
            } else {
                return _get(DirLoader.prototype.__proto__ || Object.getPrototypeOf(DirLoader.prototype), 'getContextDefine', this).call(this);
            }
        }
    }]);

    return DirLoader;
}(ModuleLoader_1.ModuleLoader);

exports.DirLoader = DirLoader;
//# sourceMappingURL=../sourcemaps/loaders/DirLoader.js.map
