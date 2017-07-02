import { ITaskContext, IMap, IAsserts, Src, IDynamicTaskOption, Operation, RunWay, Builder } from 'development-core';
import { IContext } from './IContext';
import { TaskOption } from './TaskOption';
export declare class ContextBuilder implements Builder {
    /**
     * build context component.
     *
     * @protected
     * @memberof Development
     */
    build<T extends IAsserts>(node: ITaskContext, option?: T): ITaskContext | Promise<ITaskContext>;
    /**
     * is built or not.
     *
     * @param {ITaskContext} node
     * @returns {boolean}
     * @memberof ContextBuilder
     */
    isBuilt(node: ITaskContext): boolean;
    clean(node: ITaskContext): void;
    setBuilt(node: ITaskContext): void;
    protected buildContext(node: IContext): Promise<ITaskContext>;
    protected buildContexts(parent: IContext, taskOptions: TaskOption): Promise<ITaskContext>;
    protected createContexts(node: IContext, taskOptions: TaskOption): Promise<ITaskContext[]>;
    /**
    * build asserts tasks.
    *
    * @protected
    * @param {ITaskContext} ctx
    *
    * @memberOf Builder
    */
    protected buildAssertContext(ctx: IContext, asserts: IMap<Operation | Src | IAsserts | IDynamicTaskOption[]>, runWay?: RunWay): Promise<ITaskContext[]>;
    /**
     * build sub context.
     *
     * @protected
     * @param {IContext} ctx
     *
     * @memberOf Builder
     */
    protected buildSubContext(ctx: IContext): Promise<ITaskContext[]>;
}
