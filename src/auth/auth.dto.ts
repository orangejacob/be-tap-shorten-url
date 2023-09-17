import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(64)
  username: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(64)
  password: string;
}

export class SignInDto {
  @IsNotEmpty()
  @MaxLength(64)
  username: string;

  @IsNotEmpty()
  @MaxLength(64)
  password: string;
}
