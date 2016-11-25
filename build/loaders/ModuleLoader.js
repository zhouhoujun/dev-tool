"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var development_core_1 = require('development-core');
var BaseLoader_1 = require('./BaseLoader');
var contextDefine_1 = require('../utils/contextDefine');
var chalk = require('chalk');

var ModuleLoader = function (_BaseLoader_1$BaseLoa) {
    _inherits(ModuleLoader, _BaseLoader_1$BaseLoa);

    function ModuleLoader(option, env, factory) {
        _classCallCheck(this, ModuleLoader);

        return _possibleConstructorReturn(this, (ModuleLoader.__proto__ || Object.getPrototypeOf(ModuleLoader)).call(this, option, env, factory));
    }

    _createClass(ModuleLoader, [{
        key: 'getContextDefine',
        value: function getContextDefine() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var loader = _this2.option.loader;
                if (loader) {
                    if (loader.contextDefine) {
                        resolve(loader.contextDefine);
                    } else if (loader.taskDefine) {
                        resolve(development_core_1.taskDefine2Context(loader.taskDefine));
                    } else {
                        var mdl = _this2.getConfigModule();
                        development_core_1.findTaskDefineInModule(mdl).then(function (def) {
                            if (def) {
                                resolve(def);
                            } else {
                                resolve(contextDefine_1.default(_this2.getTaskModule()));
                            }
                        }).catch(function (err) {
                            console.error(chalk.red(err));
                            resolve(contextDefine_1.default(_this2.getTaskModule()));
                        });
                    }
                } else {
                    reject('loader not found.');
                }
            });
        }
    }]);

    return ModuleLoader;
}(BaseLoader_1.BaseLoader);

exports.ModuleLoader = ModuleLoader;
//# sourceMappingURL=../sourcemaps/loaders/ModuleLoader.js.map
