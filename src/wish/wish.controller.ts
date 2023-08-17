import {
  Controller,
  Put,
  HttpCode,
  HttpStatus,
  InternalServerErrorException, Get, ImATeapotException, Query, ParseUUIDPipe, Res,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import WishService from './services/wish.service';
import WishNotComputedException from './exceptions/wish-not-computed.exception';
import WishNotCreatedException from './exceptions/wish-not-created.exception';
import PutWishDto from './DTOs/PUT/put-wish.dto';
import GetWishDto from './DTOs/GET/get-wish.dto';

@Controller()
export default class WishController {
  constructor(private readonly wishService: WishService) {}

  @Put()
  @HttpCode(HttpStatus.CREATED)
  async create(): Promise<PutWishDto> {
    try {
      return plainToInstance(PutWishDto, await this.wishService.create());
    } catch (e: unknown) {
      if (e instanceof WishNotCreatedException) {
        throw new ImATeapotException(e);
      }

      throw new InternalServerErrorException(e);
    }
  }

  @Get()
  async check(@Query('uuid', ParseUUIDPipe) uuid: string, @Res() res: Response) {
    try {
      return res.send(plainToInstance(GetWishDto, await this.wishService.check(uuid)));
    } catch (e: unknown) {
      if (e instanceof WishNotComputedException) {
        return res.status(HttpStatus.NO_CONTENT)
          .send();
      }

      throw new InternalServerErrorException(e);
    }
  }
}
