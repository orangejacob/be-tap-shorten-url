import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  url: string;
}
