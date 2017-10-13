import { RunWay, Order } from 'development-core';
import { TaskOption } from './types';
/**
 * sub task option.
 *
 * @export
 * @interface ISubTaskOption
 */
export interface ISubTaskOption {
    /**
     * sub tasks.
     *
     * @type {TaskOption}
     * @memberOf ISubTaskOption
     */
    tasks?: TaskOption;
    /**
     * set sub task order in this task sequence.
     *
     * @type {Order}
     * @memberOf ISubTaskOption
     */
    subTaskOrder?: Order;
    /**
     * sub task run way.
     *
     * @type {RunWay}@memberof ISubTaskOption
     */
    subTaskRunWay?: RunWay;
}
