import { Operation, Task, EnvOption, TaskConfig } from 'development-core';



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
     * @param {TaskConfig} cfg
     * @returns {Promise<ITask[]>}
     * 
     * @memberOf ITaskLoader
     */
    load(cfg: TaskConfig): Promise<Task[]>;

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
