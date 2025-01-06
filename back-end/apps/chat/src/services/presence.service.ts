import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ActiveUser } from '../types/ActiveUser.type';

@Injectable()
export class PresenceService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  getActiveUser(userId: number) {
    return this.cache.get<ActiveUser>(`user ${userId}`);
  }
}
