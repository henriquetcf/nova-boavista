import "reflect-metadata";
import { Type } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { ProcessEntity } from './process.entity';

export class UserEntity extends BaseEntity<UserEntity> {
  id: string = "";
  name: string | null = null;
  email: string = "";
  // password: string = ""; // Dica: Geralmente não enviamos o password para o Front!
  image: string | null = null;
  role: string = "USER";

  @Type(() => Date)
  createdAt: Date = new Date();

  @Type(() => Date)
  updatedAt: Date = new Date();

  @Type(() => ProcessEntity)
  processes: ProcessEntity[] = [];
}