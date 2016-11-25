import { ITask, IEnvOption, ITaskContext } from 'development-core';
import { IContext } from './IContext';
/**
 * task loader.
 *
 * @export
 * @interface ITaskLoader
 */
export interface ITaskLoader {
    /**
     * load task.
     *
     * @param {ITaskContext} context
     * @returns {Promise<ITask[]>}
     *
     * @memberOf ITaskLoader
     */
    load(context: ITaskContext): Promise<ITask[]>;
    /**
     * load context.
     *
     * @param {IContext} context
     * @returns {Promise<ITask[]>}
     *
     * @memberOf ITaskLoader
     */
    loadContext(env: IEnvOption): Promise<IContext>;
}
