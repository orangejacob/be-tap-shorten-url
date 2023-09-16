import { IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class SignInDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
