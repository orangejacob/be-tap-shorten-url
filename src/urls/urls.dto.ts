import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  url: string;
}

export class SaveUrlDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shortcode: string;
}
