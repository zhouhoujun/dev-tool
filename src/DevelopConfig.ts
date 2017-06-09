import { IEnvOption, RunWay, ITaskConfig, ITaskContext, IMap } from 'development-core';
import { IAssertOption, TaskOption } from './TaskOption';
import { ITaskLoader } from './ITaskLoader';
// import { Operation } from './Operation';


/**
 * Develop config
 *
 * @export
 * @interface DevelopConfig
 */
export interface DevelopConfig {
    /**
     * tools setup main task name.
     *
     * @type {string}
     * @memberOf DevelopConfig
     */
    setupTask?: string;

    /**
     * tools setup start task name.
     *
     * @type {string}
     * @memberOf DevelopConfig
     */
    startTask?: string;

    /**
     * tasks config.
     *
     * @type {TaskOption}
     * @memberOf DevelopConfig
     */
    tasks: TaskOption;

    /**
     * development tool option.
     *
     * @type {IAssertOption}
     * @memberOf DevelopConfig
     */
    option?: IAssertOption;

    /**
     * tasks runWay
     *
     * @type {RunWay}
     * @memberOf DevelopConfig
     */
    runWay?: RunWay;

    /**
     * custom loader factory.
     * 
     * @param {TaskOption} option
     * @param {IEnvOption} [env]
     * @param {ITaskContext} [parent]
     * @returns {ITaskLoader}
     * 
     * @memberOf DevelopConfig
     */
    loaderFactory?(option: TaskOption, env?: IEnvOption, parent?: ITaskContext): ITaskLoader;

    /**
     * custom context factory.
     *
     * @param {ITaskConfig} cfg
     * @param {ITaskContext} [parent]
     * @returns {ITaskContext}
     *
     * @memberOf DevelopConfig
     */
    contextFactory?(cfg: ITaskConfig, parent?: ITaskContext): ITaskContext;

    /**
     * development evnets.
     *
     * @type {IMap<Function>}
     * @memberOf DevelopConfig
     */
    evnets?: IMap<Function>;
}
