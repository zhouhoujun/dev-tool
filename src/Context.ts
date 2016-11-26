import { TaskContext, ITaskConfig, ITaskContext, ITask, TaskResult } from 'development-core';
import { IContext } from './IContext';
import * as _ from 'lodash';
import { Gulp } from 'gulp';

/**
 * Context.
 * 
 * @export
 * @class Context
 * @extends {TaskContext}
 * @implements {IContext}
 */
export class Context extends TaskContext implements IContext {

    private children: IContext[] = [];
    constructor(cfg: ITaskConfig, parent?: ITaskContext) {
        super(cfg, parent);
    }

    /**
     * add sub IContext
     * 
     * @param {IContext} context
     * 
     * @memberOf IContext
     */
    add(context: IContext): void {
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
    remove(context?: IContext): IContext[] {
        let items = _.remove(this.children, context);
        _.each(items, i => {
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
    find(express: IContext | ((item: IContext) => boolean), mode?: string): IContext {
        let context: IContext;
        this.each(item => {
            if (context) {
                return false;
            }
            let isFinded = _.isFunction(express) ? express(item) : (<IContext>express) === item;
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
    filter(express: ((item: IContext) => void | boolean), mode?: string): IContext[] {
        let contexts: IContext[] = [];
        this.each(item => {
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
    each(express: ((item: IContext) => void | boolean), mode?: string) {
        mode = mode || '';
        let r;
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

    eachChildren(express: ((item: IContext) => void | boolean)) {
        _.each(this.children, item => {
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
    route(express: ((item: IContext) => void | boolean)) {
        if (!express(this)) {
            return false;
        };
        if (this.parent && this.parent['route']) {
            return (<IContext>this.parent).route(express);
        }
    }
    /**
     * translate all sub context to do express work.
     * 
     * @param {(((item: IContext) => void | boolean))} express
     * 
     * @memberOf IContext
     */
    trans(express: ((item: IContext) => void | boolean)) {
        if (express(this) === false) {
            return false;
        }
        _.each(this.children, item => {
            return item.trans(express);
        });
        return true;
    }
}
