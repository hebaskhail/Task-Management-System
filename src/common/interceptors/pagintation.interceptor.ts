import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { Request } from 'express';
  
  @Injectable()
  export class PaginationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest<Request>();
      const query = request.query;
  
      const page = Math.max(parseInt(query.page as string) || 1, 1);
      const limit = Math.min(Math.max(parseInt(query.limit as string) || 10, 1), 50);
      const offset = (page - 1) * limit;
  
      (request as any).pagination = { page, limit, offset };
  
      return next.handle();
    }
  }
  