import {
  Get,
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Patch,
  Param,
} from '@nestjs/common';

import { UrlsService } from './urls.service';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { CreateUrlDto, SaveUrlDto } from './urls.dto';

@Controller('urls')
export class UrlsController {
  constructor(private urlService: UrlsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUrls(@Request() req) {
    return this.urlService.getUrls(req?.user?.username);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('save')
  saveUrl(@Request() req, @Body() saveUrlDto: SaveUrlDto) {
    return this.urlService.saveUrl(req?.user?.username, saveUrlDto.shortcode);
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
}
