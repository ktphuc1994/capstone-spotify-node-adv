import { USER_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { USER_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import { UserProfile } from '@app/shared/schema/user.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_SERVICE_NAME) private userMicroservice: ClientProxy,
  ) {}

  getUserProfile(userId: number): Observable<UserProfile> {
    return this.userMicroservice.send<UserProfile>(
      USER_PATTERN.PROFILE,
      userId,
    );
  }
}
