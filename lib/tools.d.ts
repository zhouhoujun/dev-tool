/// <reference types="gulp" />
import { Gulp } from 'gulp';
import { ITaskLoader } from './ITaskLoader';
import { TaskOption, Src, ITaskContext, IAsserts, ITaskInfo, ITask, ITaskOption, IEnvOption } from 'development-core';
import { DevelopConfig } from './DevelopConfig';
export * from './DevelopConfig';
export * from './ITaskLoader';
export * from './LoaderFactory';
export * from './loaders/BaseLoader';
export declare class Development {
    private dirname;
    protected option: DevelopConfig;
    /**
     * global data.
     *
     *
     * @private
     * @type {*}
     * @memberOf Development
     */
    private globals;
    /**
     * create development tool.
     *
     * @static
     * @param {Gulp} gulp
     * @param {string} dirname
     * @param {(DevelopConfig | ITaskOption[])} setting
     * @returns {Development}
     *
     * @memberOf Development
     */
    static create(gulp: Gulp, dirname: string, setting: DevelopConfig | ITaskOption[] | IAsserts[]): Development;
    private constructor(dirname, option);
    run(gulp: Gulp, env: IEnvOption): Promise<any>;
    private bindingContext(ctx);
    protected loadTasks(gulp: Gulp, tasks: TaskOption, env: IEnvOption): Promise<Src[]>;
    protected setup(gulp: Gulp, ctx: ITaskContext, tasks: ITask[], assertsTask: ITaskInfo, subGroupTask: ITaskInfo): Promise<Src[]>;
    /**
     * load sub tasks as group task.
     *
     * @protected
     * @param {Gulp} gulp
     * @param {ITaskContext} ctx
     * @returns {Promise<Src>}
     *
     * @memberOf Development
     */
    protected loadSubTask(gulp: Gulp, ctx: ITaskContext): Promise<ITaskInfo>;
    /**
     * load asserts tasks.
     *
     * @protected
     * @param {Gulp} gulp
     * @param {ITaskContext} ctx
     * @returns {Promise<Src>}
     *
     * @memberOf Development
     */
    protected loadAssertTasks(gulp: Gulp, ctx: ITaskContext): Promise<ITaskInfo>;
    protected createLoader(option: ITaskOption): ITaskLoader;
    protected printHelp(help: boolean | string): void;
}
