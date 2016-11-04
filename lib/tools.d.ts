/// <reference types="gulp" />
import { Gulp } from 'gulp';
import { ITaskLoader } from './ITaskLoader';
import { Src, ITaskInfo, ITask, ITaskOption, IEnvOption, ITaskConfig } from 'development-core';
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
    static create(gulp: Gulp, dirname: string, setting: DevelopConfig | ITaskOption[]): Development;
    private constructor(dirname, option);
    run(gulp: Gulp, env: IEnvOption): Promise<any>;
    private bindingConfig(cfg);
    protected loadTasks(gulp: Gulp, tasks: ITaskOption | ITaskOption[], env: IEnvOption): Promise<Src[]>;
    protected setup(gulp: Gulp, config: ITaskConfig, tasks: ITask[], assertsTask: ITaskInfo, subGroupTask: ITaskInfo): Promise<Src[]>;
    /**
     * load sub tasks as group task.
     *
     * @protected
     * @param {Gulp} gulp
     * @param {ITaskConfig} config
     * @returns {Promise<Src>}
     *
     * @memberOf Development
     */
    protected loadSubTask(gulp: Gulp, config: ITaskConfig): Promise<ITaskInfo>;
    /**
     * load asserts tasks.
     *
     * @protected
     * @param {Gulp} gulp
     * @param {ITaskConfig} config
     * @returns {Promise<Src>}
     *
     * @memberOf Development
     */
    protected loadAssertTasks(gulp: Gulp, config: ITaskConfig): Promise<ITaskInfo>;
    protected createLoader(option: ITaskOption): ITaskLoader;
    protected printHelp(help: boolean | string): void;
}
