import { TaskOption } from 'development-core';
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
     * @type {(TaskOption | TaskOption[])}
     * @memberOf DevelopConfig
     */
    tasks: TaskOption | TaskOption[];
    /**
     * custom loader factory.
     * 
     * 
     * @memberOf DevelopConfig
     */
    loaderFactory?(option: TaskOption): ITaskLoader;
}
