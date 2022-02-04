import {NavigationConstant} from './navigation.constant';

export class PermissionConstant {

    public static readonly INTERNAL_LIST = new PermissionConstant('/' + NavigationConstant.ROUTING_INTERNAL + '/' + NavigationConstant.ROUTING_INTERNAL_LIST, 'DOKU KYB,REVENUE,DOKU Care');

    private constructor(public readonly path: string, public readonly role: string) {}
}
