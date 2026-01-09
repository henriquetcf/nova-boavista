import "reflect-metadata";
import { Type } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { ProcessEntity } from './process.entity';

export class ProcessMovementEntity extends BaseEntity<ProcessMovementEntity> {
  id: string = "";
  processId: string = "";
  
  // Enum Status
  status: string = "";
  
  description: string | null = null;

  @Type(() => Date)
  createdAt: Date = new Date();

  // RELAÇÃO
  @Type(() => ProcessEntity)
  process?: ProcessEntity;
}