import { ITaskOption } from './TaskOption';
import { Src } from 'development-core';
/**
 * task seq.
 *
 * @export
 * @interface TaskSeq
 */
export interface TaskSeq {
    opt: ITaskOption;
    seq: Src[];
}
