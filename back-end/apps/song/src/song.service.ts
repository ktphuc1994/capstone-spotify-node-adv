import { PrismaService } from '@app/shared/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SongService {
  constructor(private readonly prismaService: PrismaService) {}

  getSongByGenre(genreList?: number[]) {
    return this.prismaService.genre.findMany({
      where: { genre_id: { in: genreList } },
    });
  }
}
