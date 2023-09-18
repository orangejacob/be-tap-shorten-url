import {
  Get,
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { UrlsService } from './urls.service';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { CreateUrlDto } from './urls.dto';

@Controller('urls')
export class UrlsController {
  constructor(private urlService: UrlsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUrls(@Request() req) {
    return this.urlService.getUrls(req?.user?.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createUrl(@Request() req, @Body() createUrlDto: CreateUrlDto) {
    return this.urlService.createUrl(req?.user?.username, createUrlDto.url);
  }

  @Get('/:shortcode')
  redirect(@Param('shortcode') shortcode) {
    return this.urlService.getUrlByShortcode(shortcode);
  }

  @Delete('/:shortcode')
  deleteUrl(@Request() req, @Param('shortcode') shortcode) {
    return this.urlService.deleteUrl(req?.user?.username, shortcode);
  }
}
