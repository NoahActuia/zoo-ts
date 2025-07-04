import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const ROLES_NAMESPACE = 'https://zooapi.com/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]) || [];
    const { user } = context.switchToHttp().getRequest();

    this.logger.debug('User object:', user);
    this.logger.debug('Required roles:', requiredRoles);

    const roles: string[] = user[ROLES_NAMESPACE];

    this.logger.debug('User roles:', roles);

    const hasAnyRole = () =>
      requiredRoles.some((role) => roles?.includes(role));

    const hasAccess = requiredRoles.length === 0 || hasAnyRole();
    this.logger.debug('Access granted:', hasAccess);

    return hasAccess;
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
