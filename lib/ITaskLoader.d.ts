import { ITask } from 'development-core';
/**
 * task loader.
 *
 * @export
 * @interface ITaskLoader
 */
export interface ITaskLoader {
    /**
     * load task.
     * @returns {Promise<ITask[]>}
     *
     * @memberOf ITaskLoader
     */
    load(): Promise<ITask[]>;
}
