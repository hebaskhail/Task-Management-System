import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  LoggerService,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  status: string;
  data: T;
  message: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private readonly logger: LoggerService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url, body, query, params } = req;

    this.logger.log(
      `Request: ${method} ${url} | Params: ${JSON.stringify(
        params,
      )} | Query: ${JSON.stringify(query)} | Body: ${JSON.stringify(body)}`,
      'HTTP Request',
    );
    return next.handle().pipe(
      map((data) => ({
        statusCode: res.statusCode,
        status: 'Success',
        data: data.message ? data.data : data || null,
        message: data?.message || 'Success',
      })),
    );
  }
}
