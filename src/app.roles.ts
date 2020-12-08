import { RolesBuilder } from "nest-access-control";

export enum AppRole {
    AUTHOR = 'AUTHOR',
    ADMIN = 'ADMIN'
}

export enum AppResourses {
    USER = 'USER',
    POST = 'POST'
}

export const roles: RolesBuilder = new RolesBuilder()

roles
    //AUTHOR ROLES
    .grant(AppRole.AUTHOR)
    .updateOwn([AppResourses.USER])
    .deleteOwn([AppResourses.USER])
    .createOwn([AppResourses.POST])
    .updateOwn([AppResourses.POST])
    .deleteOwn([AppResourses.POST])

    //ADMIN ROLES
    .grant(AppRole.ADMIN)
    .extend(AppRole.AUTHOR)
    .createAny([AppResourses.USER])
    .updateAny([AppResourses.USER, AppResourses.POST])
    .deleteAny([AppResourses.USER, AppResourses.POST])


