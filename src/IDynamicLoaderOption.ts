import { ILoaderOption } from './ILoaderOption';
import { IDynamicTaskOption } from 'development-core';

/**
 * the option for loader dynamic build task.
 *
 * @export
 * @interface IDynamicLoaderOption
 * @extends {ILoaderOption}
 */
export interface IDynamicLoaderOption extends ILoaderOption {
    /**
     * dynamic task
     *
     * @type {(IDynamicTaskOption | IDynamicTaskOption[])}
     * @memberOf IDynamicLoaderOption
     */
    dynamicTasks?: IDynamicTaskOption | IDynamicTaskOption[];
}

