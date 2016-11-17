/// <reference types="gulp" />
import { Gulp } from 'gulp';
import { ITaskLoader } from './ITaskLoader';
import { TaskOption, Src, ITaskContext, IAsserts, ITaskInfo, ITask, ITaskOption, IEnvOption, IDynamicTaskOption } from 'development-core';
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
     * @param {(DevelopConfig | Array<ITaskOption | IAsserts | IDynamicTaskOption>)} setting
     * @returns {Development}
     *
     * @memberOf Development
     */
    static create(gulp: Gulp, dirname: string, setting: DevelopConfig | Array<ITaskOption | IAsserts | IDynamicTaskOption>): Development;
    /**
     * Creates an instance of Development.
     *
     * @param {string} dirname
     * @param {DevelopConfig} option
     *
     * @memberOf Development
     */
    private constructor(dirname, option);
    /**
     * run task.
     *
     * @param {Gulp} gulp
     * @param {IEnvOption} env
     * @returns {Promise<any>}
     *
     * @memberOf Development
     */
    run(gulp: Gulp, env: IEnvOption): Promise<any>;
    /**
     * filter task sequence.
     *
     * @private
     * @param {Src[]} seq
     * @returns {Src[]}
     *
     * @memberOf Development
     */
    private filterTaskSequence(seq);
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
    protected createLoader(option: ITaskOption, env: IEnvOption): ITaskLoader;
    protected printHelp(help: boolean | string): void;
}
