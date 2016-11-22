import { IEnvOption, RunWay } from 'development-core';
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
     * tools setup main task.
     * 
     * @type {string}
     * @memberOf DevelopConfig
     */
    setupTask?: string;
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
     * compose context.
     * 
     * @type {boolean}
     * @memberOf DevelopConfig
     */
    compose?: boolean;

    /**
     * custom loader factory.
     * 
     * @param {TaskOption} option
     * @param {IEnvOption} [env]
     * @returns {ITaskLoader}
     * 
     * @memberOf DevelopConfig
     */
    loaderFactory?(option: TaskOption, env?: IEnvOption): ITaskLoader;
}
