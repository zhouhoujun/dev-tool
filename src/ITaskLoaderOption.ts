import { TaskLoader } from './types';
import { ILoaderOption } from './ILoaderOption';
import { IDynamicTaskOption } from 'development-core';


/**
 * task loader option.
 *
 * @export
 * @interface TaskLoaderOption
 */
export interface ITaskLoaderOption {
    /**
     * task loader
     *
     * @type {(string | TaskLoader | ILoaderOption | IDynamicTaskOption | IDynamicTaskOption[])}
     * @memberOf ITaskLoaderOption
     */
    loader?: string | TaskLoader | ILoaderOption | IDynamicTaskOption | IDynamicTaskOption[];

}
