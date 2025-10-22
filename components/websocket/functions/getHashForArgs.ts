import { sortObject } from '../../../../../packages/shared/utils';
import * as CryptoJS from 'crypto-js';

export const getHashForArgs = (args: Record<string, any>) => {
    return CryptoJS.SHA256(JSON.stringify(sortObject(args))).toString();
};