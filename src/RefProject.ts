import { TaskString, TaskOperation, Order, TaskSource, Src } from 'development-core';


/**
 * Ref project
 *
 * @export
 * @interface RefProject
 */
export interface RefProject { // extends ISubTaskOption {
    /**
     * project name.
     *
     * @type {TaskString}
     * @memberof RefProjec
     */
    name?: TaskString;

    /**
     * operation
     *
     * enmu flags.
     * @type {TaskOperation}
     * @memberof RefProject
     */
    oper?: TaskOperation;
    /**
     * order index.
     *
     * @type {Order}
     * @memberof RefProject
     */
    order?: Order;

    /**
     * project path
     *
     * @type {TaskString}
     * @memberof RefProjec
     */
    path: TaskString;

    /**
     * cmd for this project.
     *
     * @type {TaskString}
     * @memberof RefProjec
     */
    cmd?: TaskString;
    /**
     * the cmd args.
     *
     * @type {TaskSource}
     * @memberof RefProjec
     */
    args?: TaskSource;

    /**
     * extra args.
     *
     * @type {Src}
     * @memberof RefProject
     */
    extraArgs?: Src;

    /**
     * exclude args.
     *
     * @type {Src}
     * @memberof RefProject
     */
    excludeArgs?: Src;
}
