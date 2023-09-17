import { createHash, randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './urls.entity';
import { UsersService } from 'src/users/users.service';
import * as base62 from 'base62';
import { Response } from 'express';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    private userService: UsersService,
  ) {}

  getUrls(username: string): Promise<Url[]> {
    return this.urlRepository.find({
      relations: ['user'],
      where: {
        user: {
          username: username,
        },
      },
    });
  }

  async saveUrl(username: string, shortcode: string): Promise<Url | null> {
    const url = await this.urlRepository.findOne({
      where: {
        shortcode: shortcode,
        user: {
          username: username,
        },
      },
    });

    if (!url) {
      throw new Error('Url does not exists.');
    }

    url.saved = true;
    this.urlRepository.save(url);
    return url;
  }

  async createUrl(username: string, original_url: string): Promise<Url | null> {
    const user = await this.userService.getUser(username);

    if (!user) {
      throw Error('You must be logged in');
    }

    const shortcode = await this.generateShortcode(username); // You'll have to implement a function to generate a unique shortcode

    return this.urlRepository.save({
      user,
      shortcode,
      original: original_url,
    });
  }

  async generateShortcode(username: string): Promise<string> {
    const uuid = randomUUID();
    const hash = createHash('md5')
      .update(username + uuid)
      .digest('hex');

    const id = parseInt(hash.substring(0, 8), 16);
    const shortened = base62.encode(id);
    const shortCodeExist = await this.urlRepository.findOne({
      where: { shortcode: shortened },
    });

    // Calculate again
    if (shortCodeExist) {
      return this.generateShortcode(username);
    }
    return shortened;
  }

  async deleteUrl(username: string, shortcode: string) {
    const url = await this.urlRepository.findOne({
      where: { shortcode, user: { username } },
    });

    if (!url) {
      throw new Error("Url doesn't exist");
    }

    return this.urlRepository.remove(url);
  }

  async getUrlByShortcode(shortcode: string): Promise<string> {
    const url = await this.urlRepository.findOne({ where: { shortcode } });

    if (!url) {
      throw new NotFoundException('Url is invalid');
    }
    url.views += 1;
    this.urlRepository.save(url);
    return url.original;
  }
}
