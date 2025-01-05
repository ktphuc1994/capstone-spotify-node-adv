import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AUTH_SERVICE_NAME } from '../constants/microservice.const';
import { AUTH_PATTERN } from '../constants/microservice-pattern.const';
import { UserInReq } from '../types/shared.type';
import { extractTokenFromHeader } from '../utils/auth';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly authService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken = extractTokenFromHeader(request.headers.authorization);

    if (!authToken) {
      throw new UnauthorizedException();
    }

    try {
      const userInfo = await lastValueFrom<UserInReq>(
        this.authService.send(AUTH_PATTERN.AUTHEN, {
          jwt: authToken,
        }),
      );

      request['user'] = userInfo;
    } catch (_error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
