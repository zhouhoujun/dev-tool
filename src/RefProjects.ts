import { TaskString, RunWay, Order } from 'development-core';
import { RefProject } from './RefProject';



/**
 * ref project.
 *
 * @export
 * @interface RefProject
 */
export interface RefProjects {
    /**
     * refs project, to compile together.
     *
     * @type {(TaskString | RefProjec)[]}
     * @memberof RefProject
     */
    refs?: (TaskString | RefProject)[];

    /**
     * refs project run way.
     *
     * @type {RunWay}
     * @memberof RefProject
     */
    refsRunWay?: RunWay;

    /**
     * refs project run order.
     *
     * @type {Order}
     * @memberof RefProject
     */
    refsOrder?: Order;
}
