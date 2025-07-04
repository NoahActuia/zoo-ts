import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]) || [];
    const { user } = context.switchToHttp().getRequest();
    const roles: string[] = user['https://zooapi.com/roles'];

    console.log('👤 User roles:', roles);
    console.log('🎯 Required roles:', requiredRoles);

    const hasAnyRole = () =>
      requiredRoles.some((role) => roles?.includes(role));

    return requiredRoles ? hasAnyRole() : true;
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
