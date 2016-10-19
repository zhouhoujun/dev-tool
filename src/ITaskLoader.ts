import { Operation, Task, EnvOption, TaskConfig } from './TaskConfig';



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
     * @param {Operation} oper
     * @returns {Promise<ITask[]>}
     * 
     * @memberOf ITaskLoader
     */
    load(oper: Operation): Promise<Task[]>;

    /**
     * load config.
     * 
     * @param {Operation} oper
     * @param {EnvOption} env
     * @returns {Promise<TaskConfig>}
     * 
     * @memberOf ITaskLoader
     */
    loadConfg(oper: Operation, env: EnvOption): Promise<TaskConfig>;

}
