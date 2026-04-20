import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (user && user.role === UserRole.ADMIN) {
      return true;
    }
    
    throw new ForbiddenException('Acesso negado: Nível de permissão insuficiente');
  }
}
