import { TaskOption, IEnvOption } from 'development-core';
import { ITaskLoader } from './ITaskLoader';
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
