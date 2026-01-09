import "reflect-metadata";
import { Type } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { ServiceEntity } from './service.entity';   // Essa já temos
import { ProcessEntity } from './process.entity';
import { DocumentEntity } from './document.entity';

export class ServiceItemEntity extends BaseEntity<ServiceItemEntity> {
  id: string = "";
  name: string = "";

  @Type(() => String)
  baseValue: string = "0";

  @Type(() => String)
  finalValue: string = "0";

  @Type(() => String)
  profit: string = "0";

  processId: string = "";
  serviceId: string = "";
  isPaid: boolean = false;

  // RELAÇÕES (Aqui é onde o Mapper faz a mágica recursiva)
  
  @Type(() => DocumentEntity)
  documents: DocumentEntity[] = [];

  // @Type(() => ProcessEntity)
  // process?: ProcessEntity;

  @Type(() => ServiceEntity)
  service?: ServiceEntity;
}