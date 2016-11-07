"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseLoader_1 = require('./BaseLoader');
/**
 * module loader.
 *
 * @export
 * @class ModuleLoader
 * @extends {BaseLoader}
 */

var ModuleLoader = function (_BaseLoader_1$BaseLoa) {
    _inherits(ModuleLoader, _BaseLoader_1$BaseLoa);

    function ModuleLoader(option) {
        _classCallCheck(this, ModuleLoader);

        return _possibleConstructorReturn(this, (ModuleLoader.__proto__ || Object.getPrototypeOf(ModuleLoader)).call(this, option));
    }

    return ModuleLoader;
}(BaseLoader_1.BaseLoader);

exports.ModuleLoader = ModuleLoader;
//# sourceMappingURL=../sourcemaps/loaders/ModuleLoader.js.map
