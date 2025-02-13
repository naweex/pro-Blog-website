import { SetMetadata } from "@nestjs/common"
import { Roles } from "../enums/role.enum"

export const ROLE_KEY = 'ROLES'
export const CanAccess = (...roles : Roles[]) => SetMetadata(ROLE_KEY , roles)

//Nest provides the ability to attach custom data to route handlers through @SetMetadata.
//Its a way to declaratively define and store data about your controller(endpoint).
//@SetMetadata stores the key value pairs.
