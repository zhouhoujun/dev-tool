"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var development_core_1 = require('development-core');
/**
 * Context.
 *
 * @export
 * @class Context
 * @extends {TaskContext}
 * @implements {IContext}
 */

var Context = function (_development_core_1$T) {
    _inherits(Context, _development_core_1$T);

    // private children: IContext[] = [];
    function Context(cfg, parent) {
        _classCallCheck(this, Context);

        return _possibleConstructorReturn(this, (Context.__proto__ || Object.getPrototypeOf(Context)).call(this, cfg, parent));
    }

    return Context;
}(development_core_1.TaskContext);

exports.Context = Context;
//# sourceMappingURL=sourcemaps/Context.js.map
