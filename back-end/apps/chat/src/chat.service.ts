import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}
}
