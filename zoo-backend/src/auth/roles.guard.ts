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
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log('✅ Public route, allowing access');
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]); // This can be undefined if no @Roles decorator is present.

    // If no specific roles are required for this route, allow access.
    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('✅ No specific roles required, allowing access');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const roles: string[] = user['https://zooapi.com/roles'];

    console.log('👤 User object:', user);
    console.log('👤 User roles:', roles);
    console.log('🎯 Required roles:', requiredRoles);

    // Check if user has any of the required roles
    const hasAnyRole = requiredRoles.some((role) => roles?.includes(role));

    console.log('🔐 Has required role:', hasAnyRole);

    if (!hasAnyRole) {
      console.log('❌ Access denied: User does not have required roles');
      console.log('   User roles:', roles);
      console.log('   Required roles:', requiredRoles);
    }

    return hasAnyRole;
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const Public = () => SetMetadata('isPublic', true);
