import { TaskContext, ITaskConfig, ITaskContext } from 'development-core';
import { IContext } from './IContext';
/**
 * Context.
 *
 * @export
 * @class Context
 * @extends {TaskContext}
 * @implements {IContext}
 */
export declare class Context extends TaskContext implements IContext {
    private children;
    constructor(cfg: ITaskConfig, parent?: ITaskContext);
    /**
     * add sub IContext
     *
     * @param {IContext} context
     *
     * @memberOf IContext
     */
    add(context: IContext): void;
    /**
     * remove sub IContext.
     *
     * @param {IContext} [context]
     *
     * @memberOf IContext
     */
    remove(context?: IContext): IContext[];
    /**
     * find sub context via express.
     *
     * @param {(IContext | ((item: IContext) => boolean))} express
     * @param {string} [mode] {enum:['route','children', traverse']} default traverse.
     * @returns {IContext}
     *
     * @memberOf IContext
     */
    find(express: IContext | ((item: IContext) => boolean), mode?: string): IContext;
    /**
     * filter items.
     *
     * @param {(((item: IContext) => void | boolean))} express
     * @param {string} [mode] {enum:['route','children', traverse']} default traverse.
     * @returns {IContext[]}
     *
     * @memberOf IContext
     */
    filter(express: ((item: IContext) => void | boolean), mode?: string): IContext[];
    /**
     * find parent context via express.
     *
     * @param {(IContext | ((item: IContext) => boolean))} express
     * @param {string} [mode] {enum:['route','children', traverse']} default traverse.
     *
     * @memberOf IContext
     */
    each(express: ((item: IContext) => void | boolean), mode?: string): any;
    eachChildren(express: ((item: IContext) => void | boolean)): void;
    /**
     * do express work in routing.
     *
     * @param {(((item: IContext) => void | boolean))} express
     *
     * @memberOf IContext
     */
    route(express: ((item: IContext) => void | boolean)): any;
    /**
     * translate all sub context to do express work.
     *
     * @param {(((item: IContext) => void | boolean))} express
     *
     * @memberOf IContext
     */
    trans(express: ((item: IContext) => void | boolean)): boolean;
}
