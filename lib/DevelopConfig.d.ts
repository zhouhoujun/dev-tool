import { ITaskOption } from 'development-core';
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
     * @type {(ITaskOption | ITaskOption[])}
     * @memberOf DevelopConfig
     */
    tasks: ITaskOption | ITaskOption[];
    /**
     * custom loader factory.
     *
     *
     * @memberOf DevelopConfig
     */
    loaderFactory?(option: ITaskOption): ITaskLoader;
}
