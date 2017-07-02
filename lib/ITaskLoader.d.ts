import { ITask } from 'development-core';
/**
 * task loader.
 *
 * @export
 * @interface ITaskLoader
 */
export interface ITaskLoader {
    /**
     * loader name.
     *
     * @type {string}
     * @memberof ITaskLoader
     */
    name: string;
    /**
     * load task.
     * @returns {Promise<ITask[]>}
     *
     * @memberOf ITaskLoader
     */
    load(): Promise<ITask[]>;
}
