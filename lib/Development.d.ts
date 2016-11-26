/// <reference types="gulp" />
import { Gulp } from 'gulp';
import { ITaskLoader } from './ITaskLoader';
import { ITaskConfig, Src, ITaskContext, ITaskInfo, ITask, IEnvOption, IDynamicTaskOption, RunWay } from 'development-core';
import { TaskOption, ITaskOption, IAssertOption } from './TaskOption';
import { IContext } from './IContext';
import { DevelopConfig } from './DevelopConfig';
export declare class Development {
    private dirname;
    protected config: DevelopConfig;
    /**
     * create development tool.
     *
     * @static
     * @param {Gulp} gulp
     * @param {string} dirname
     * @param {(DevelopConfig | Array<ITaskOption | IAssertOption | IDynamicTaskOption>)} setting
     * @param {any} [runWay=RunWay.sequence]
     * @returns {Development}
     *
     * @memberOf Development
     */
    static create(gulp: Gulp, dirname: string, setting: DevelopConfig | Array<ITaskOption | IAssertOption | IDynamicTaskOption>, runWay?: RunWay, factory?: (cfg: ITaskConfig, parent?: ITaskContext) => ITaskContext): Development;
    /**
     * Creates an instance of Development.
     *
     * @param {string} dirname
     * @param {DevelopConfig} config
     *
     * @memberOf Development
     */
    private constructor(dirname, config);
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
    startTask(gulp: Gulp, env: IEnvOption): Promise<any>;
    setupTasks(gulp: Gulp, env: IEnvOption): Promise<Src[]>;
    private globalctx;
    getContext(env: any): IContext;
    protected loadTasks(gulp: Gulp, tasks: TaskOption, parent: IContext): Promise<Src[]>;
    protected setup(gulp: Gulp, ctx: ITaskContext, tasks: ITask[], assertsTask: ITaskInfo, subGroupTask: ITaskInfo): Promise<Src[]>;
    /**
     * load sub tasks as group task.
     *
     * @protected
     * @param {Gulp} gulp
     * @param {IContext} ctx
     * @returns {Promise<ITaskInfo>}
     *
     * @memberOf Development
     */
    protected loadSubTask(gulp: Gulp, ctx: IContext): Promise<ITaskInfo>;
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
    protected loadAssertTasks(gulp: Gulp, ctx: IContext): Promise<ITaskInfo>;
    protected createLoader(option: TaskOption, parent: IContext): ITaskLoader;
    protected printHelp(help: boolean | string): void;
}
