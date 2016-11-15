import { ITaskOption, IAsserts } from 'development-core';
import { ITaskLoader } from './ITaskLoader';
// import { Operation } from './Operation';


export type TaskOption = ITaskOption | ITaskOption[] | IAsserts | IAsserts[] | Array<ITaskOption | IAsserts>;

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
     * 
     * @memberOf DevelopConfig
     */
    loaderFactory?(option: ITaskOption): ITaskLoader;
}
