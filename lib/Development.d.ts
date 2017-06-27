/// <reference types="gulp" />
import { Gulp } from 'gulp';
import { ITaskConfig, IAssertOption, IDynamicTaskOption, RunWay } from 'development-core';
import { TaskOption, ITaskOption } from './TaskOption';
import { IContext } from './IContext';
import { Context } from './Context';
/**
 * Development.
 *
 * @export
 * @class Development
 * @extends {Context}
 */
export declare class Development extends Context {
    /**
     * create development tool.
     *
     * @static
     * @param {Gulp} gulp
     * @param {string} root  root path.
     * @param {(ITaskConfig | Array<IAssertOption | ITaskOption | IDynamicTaskOption>)} setting
     * @param {any} [runWay=RunWay.sequence]
     * @returns {Development}
     *
     * @memberOf Development
     */
    static create(gulp: Gulp, root: string, setting: ITaskConfig | Array<IAssertOption | ITaskOption | IDynamicTaskOption>, name?: string, runWay?: RunWay): Development;
    /**
     * Creates an instance of Development.
     * @param {ITaskConfig} config
     * @param {string} root root path.
     * @param {IContext} [parent]
     * @memberof Development
     */
    constructor(config: ITaskConfig, root: string, parent?: IContext);
    /**
     * build context component.
     *
     * @protected
     * @memberof Development
     */
    protected builder(): void;
    protected printHelp(help: string): void;
    /**
     * build asserts tasks.
     *
     * @protected
     * @param {ITaskContext} ctx
     *
     * @memberOf Development
     */
    protected buildAssertContext(ctx: IContext): void;
    protected buildContext(taskOptions: TaskOption, parent: IContext): void;
    /**
     * build sub context.
     *
     * @protected
     * @param {IContext} ctx
     *
     * @memberOf Development
     */
    protected buildSubContext(ctx: IContext): void;
}
