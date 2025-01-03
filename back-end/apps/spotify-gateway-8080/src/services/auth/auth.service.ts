import { AUTH_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { AUTH_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import {
  CreateUserRequest,
  LoginRequest,
} from '@app/shared/schema/user.schema';
import { AccessToken } from '@app/shared/types/auth.type';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private authMicroservice: ClientProxy,
  ) {}

  register(userInfo: CreateUserRequest) {
    return lastValueFrom(
      this.authMicroservice.send<AccessToken, CreateUserRequest>(
        AUTH_PATTERN.REGISTER,
        userInfo,
      ),
    );
  }

  login(loginInfo: LoginRequest) {
    return lastValueFrom(
      this.authMicroservice.send<AccessToken, LoginRequest>(
        AUTH_PATTERN.LOGIN,
        loginInfo,
      ),
    );
  }
}
