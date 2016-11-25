"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var development_core_1 = require('development-core');
var _ = require('lodash');
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

    function Context(cfg, parent) {
        _classCallCheck(this, Context);

        var _this = _possibleConstructorReturn(this, (Context.__proto__ || Object.getPrototypeOf(Context)).call(this, cfg, parent));

        _this.children = [];
        return _this;
    }
    /**
     * add sub IContext
     *
     * @param {IContext} context
     *
     * @memberOf IContext
     */


    _createClass(Context, [{
        key: 'add',
        value: function add(context) {
            context.parent = this;
            this.children.push(context);
        }
        /**
         * remove sub IContext.
         *
         * @param {IContext} [context]
         *
         * @memberOf IContext
         */

    }, {
        key: 'remove',
        value: function remove(context) {
            var items = _.remove(this.children, context);
            _.each(items, function (i) {
                if (i) {
                    i.parent = null;
                }
            });
            return items;
        }
        /**
         * find sub context via express.
         *
         * @param {(IContext | ((item: IContext) => boolean))} express
         * @param {string} [mode] {enum:['route','children', traverse']} default traverse.
         * @returns {IContext}
         *
         * @memberOf IContext
         */

    }, {
        key: 'find',
        value: function find(express, mode) {
            var context = void 0;
            this.each(function (item) {
                if (context) {
                    return false;
                }
                var isFinded = _.isFunction(express) ? express(item) : express === item;
                if (isFinded) {
                    context = item;
                    return false;
                }
                return true;
            }, mode);
            return context;
        }
        /**
         * filter items.
         *
         * @param {(((item: IContext) => void | boolean))} express
         * @param {string} [mode] {enum:['route','children', traverse']} default traverse.
         * @returns {IContext[]}
         *
         * @memberOf IContext
         */

    }, {
        key: 'filter',
        value: function filter(express, mode) {
            var contexts = [];
            this.each(function (item) {
                if (express(item)) {
                    contexts.push(item);
                }
            }, mode);
            return contexts;
        }
        /**
         * find parent context via express.
         *
         * @param {(IContext | ((item: IContext) => boolean))} express
         * @param {string} [mode] {enum:['route','children', traverse']} default traverse.
         *
         * @memberOf IContext
         */

    }, {
        key: 'each',
        value: function each(express, mode) {
            mode = mode || '';
            var r = void 0;
            switch (mode) {
                case 'route':
                    r = this.route(express);
                    break;
                case 'children':
                    r = this.eachChildren(express);
                    break;
                case 'traverse':
                    r = this.trans(express);
                    break;
                default:
                    r = this.trans(express);
                    break;
            }
            return r;
        }
    }, {
        key: 'eachChildren',
        value: function eachChildren(express) {
            _.each(this.children, function (item) {
                return express(item);
            });
        }
        /**
         * do express work in routing.
         *
         * @param {(((item: IContext) => void | boolean))} express
         *
         * @memberOf IContext
         */

    }, {
        key: 'route',
        value: function route(express) {
            if (!express(this)) {
                return false;
            }
            ;
            if (this.parent && this.parent['route']) {
                return this.parent.route(express);
            }
        }
        /**
         * translate all sub context to do express work.
         *
         * @param {(((item: IContext) => void | boolean))} express
         *
         * @memberOf IContext
         */

    }, {
        key: 'trans',
        value: function trans(express) {
            if (express(this) === false) {
                return false;
            }
            _.each(this.children, function (item) {
                return item.trans(express);
            });
            return true;
        }
    }]);

    return Context;
}(development_core_1.TaskContext);

exports.Context = Context;
//# sourceMappingURL=sourcemaps/Context.js.map
