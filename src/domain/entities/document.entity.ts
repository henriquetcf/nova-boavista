import { Type } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { ServiceItemEntity } from './service-item.entity';
// Importe o ProcessEntity (Cuidado com import circular, se der erro me avisa)

export class DocumentEntity extends BaseEntity<DocumentEntity> {
  id: string = "";
  name: string = "";
  isUploaded: boolean = false;
  fileUrl: string | null = null;
  processId: string = "";
  serviceItemId: string | null = null;

  @Type(() => Date)
  createdAt: Date = new Date();

  @Type(() => Date)
  updatedAt: Date = new Date();

  // RELAÇÕES
  @Type(() => ServiceItemEntity)
  serviceItem?: ServiceItemEntity;
  
  // Se precisar acessar o processo direto do documento:
  // @Type(() => ProcessEntity)
  // process?: ProcessEntity;
}