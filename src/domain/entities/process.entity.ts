import { Type } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { ServiceItemEntity } from './service-item.entity';
import { DocumentEntity } from './document.entity';
import { Status } from '@prisma/client';
// Importe as outras entidades (Client, User, etc) conforme criar os arquivos

export class ProcessEntity extends BaseEntity<ProcessEntity> {
  id: string = "";
  plate: string = "";
  renavam: string | null = null;
  status: string = Status.PENDENTE; // Pode usar o Enum do Prisma aqui se preferir

  @Type(() => String)
  totalValue: string = "0";

  clientName: string = "";
  clientId: string = "";
  userId: string = "";

  @Type(() => Date)
  createdAt: Date = new Date();

  @Type(() => Date)
  updatedAt: Date = new Date();

  @Type(() => String)
  totalProfit: string = "0";

  @Type(() => String)
  paidValue: string = "0";

  // RELAÇÕES
  // @Type(() => DocumentEntity)
  documents: DocumentEntity[] = [];

  // @Type(() => ServiceItemEntity)
  services: ServiceItemEntity[] = [];

  // Outras relações que você pode ativar depois:
  // client: ClientEntity;
  // user: UserEntity;
  // movements: ProcessMovementEntity[];
  // transactions: TransactionMovimentEntity[];
}