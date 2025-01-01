import { PrismaService } from '@app/shared/prisma/prisma.service';
import {
  FriendList,
  FriendListRequest,
  User,
  userSchema,
} from '@app/shared/schema/user.schema';
import { filterPageAndPageSize } from '@app/shared/utils/common';
import {
  catchPrismaNotFound,
  catchPrismaUnique,
} from '@app/shared/utils/prisma';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getExistedFriend(userId: number, friendId: number) {
    return this.prismaService.friend_list.findFirst({
      where: {
        OR: [
          { creator_id: userId, receiver_id: friendId },
          { creator_id: friendId, receiver_id: userId },
        ],
      },
      select: { friend_list_id: true },
    });
  }

  async getUserProfile(user_id: number): Promise<User> {
    const userInfo = await this.prismaService.user.findFirst({
      where: { user_id },
    });
    if (!userInfo) throw new NotFoundException('Người dùng không tồn tại.');

    try {
      return userSchema.parse(userInfo);
    } catch (_error) {
      throw new ConflictException(
        'Có sự sai lệnh trong dữ liệu thông tin người dùng. Vui lòng liên hệ chăm sóc khách hàng để được hỗ trợ.',
      );
    }
  }

  async getFriendList({
    userId,
    page,
    pageSize,
  }: FriendListRequest): Promise<FriendList[]> {
    const { skip, take } = filterPageAndPageSize(page, pageSize);

    const rawList = await this.prismaService.friend_list.findMany({
      where: {
        OR: [{ creator_id: userId }, { receiver_id: userId }],
        is_accepted: true,
      },
      skip,
      take,
      select: {
        friend_list_id: true,
        created_at: true,
        user_friend_list_receiver_idTouser: {
          select: {
            user_id: true,
            user_name: true,
            first_name: true,
            last_name: true,
          },
        },
        user_friend_list_creator_idTouser: {
          select: {
            user_id: true,
            user_name: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return rawList.map((relationInfo) => {
      let friendInfo: Omit<User, 'email'>;
      if (relationInfo.user_friend_list_creator_idTouser.user_id !== userId) {
        friendInfo = relationInfo.user_friend_list_creator_idTouser;
      } else {
        friendInfo = relationInfo.user_friend_list_receiver_idTouser;
      }

      return { friendListId: relationInfo.friend_list_id, friendInfo };
    });
  }

  async getRequestedFriendList({
    userId,
    page,
    pageSize,
  }: FriendListRequest): Promise<FriendList[]> {
    const { skip, take } = filterPageAndPageSize(page, pageSize);

    const rawList = await this.prismaService.friend_list.findMany({
      where: { creator_id: userId, is_accepted: false },
      skip,
      take,
      select: {
        friend_list_id: true,
        user_friend_list_receiver_idTouser: {
          select: {
            user_id: true,
            user_name: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return rawList.map((relationInfo) => ({
      friendListId: relationInfo.friend_list_id,
      friendInfo: relationInfo.user_friend_list_receiver_idTouser,
    }));
  }

  async getReceivedFriendList({
    userId,
    page,
    pageSize,
  }: FriendListRequest): Promise<FriendList[]> {
    const { skip, take } = filterPageAndPageSize(page, pageSize);

    const rawList = await this.prismaService.friend_list.findMany({
      where: { receiver_id: userId, is_accepted: false },
      skip,
      take,
      select: {
        friend_list_id: true,
        user_friend_list_creator_idTouser: {
          select: {
            user_id: true,
            user_name: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return rawList.map((relationInfo) => ({
      friendListId: relationInfo.friend_list_id,
      friendInfo: relationInfo.user_friend_list_creator_idTouser,
    }));
  }

  async sendFriendRequest(user_id: number, friend_id: number) {
    if (user_id === friend_id) {
      throw new BadRequestException('Không thể kết bạn với chính mình');
    }

    try {
      return await this.prismaService.friend_list.create({
        data: { creator_id: user_id, receiver_id: friend_id },
      });
    } catch (error) {
      catchPrismaUnique(error, 'Đã là bạn bè hoặc yêu cầu kết bạn đã tồn tại');
    }
  }

  async acceptFriendRequest(user_id: number, friend_list_id: number) {
    try {
      return await this.prismaService.friend_list.update({
        where: { receiver_id: user_id, friend_list_id, is_accepted: false },
        data: { is_accepted: true },
      });
    } catch (error) {
      catchPrismaNotFound(error, 'Yêu cầu kết bạn không tồn tại');
    }
  }

  async removeFriend(user_id: number, friend_list_id: number) {
    try {
      return await this.prismaService.friend_list.delete({
        where: {
          friend_list_id,
          OR: [{ creator_id: user_id }, { receiver_id: user_id }],
        },
      });
    } catch (error) {
      catchPrismaNotFound(error, 'Bạn bè hoặc yêu cầu kết bạn không tồn tại');
    }
  }
}
