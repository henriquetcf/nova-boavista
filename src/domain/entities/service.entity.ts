import "reflect-metadata";
import { Type } from 'class-transformer';
import { BaseEntity } from './base.entity';

export class ServiceEntity extends BaseEntity<ServiceEntity> {
  id: string = "";
  name: string = "";

  @Type(() => String)
  baseValue: string = "0";

  @Type(() => String)
  finalValue: string = "0";

  @Type(() => String)
  profit: string = "0";

  requiredDocuments?: string;
  
  // O constructor aqui é herdado da BaseEntity automaticamente!
}