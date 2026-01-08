import { Type } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { ServiceItemEntity } from './service-item.entity';
import { DocumentEntity } from './document.entity';
import { Status } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import { ClientEntity } from './client.entity';
import { UserEntity } from './user.entity';
import { ProcessMovementEntity } from './process-movement.entity';
import { TransactionMovementEntity } from './transaction-movement.entity';
// Importe as outras entidades (Client, User, etc) conforme criar os arquivos

export class ProcessEntity extends BaseEntity<ProcessEntity> {
  id: string = "";
  plate: string = "";
  renavam: string = "";
  status: Status = Status.PENDENTE; // Pode usar o Enum do Prisma aqui se preferir

  @Type(() => String)
  totalValue: Decimal = new Decimal(0);

  clientName: string = "";
  clientId: string = "";
  userId: string = "";

  @Type(() => Date)
  createdAt: Date = new Date();

  @Type(() => Date)
  updatedAt: Date = new Date();

  @Type(() => String)
  totalProfit: Decimal = new Decimal(0);

  @Type(() => String)
  paidValue: Decimal = new Decimal(0);

  // RELAÇÕES
  // @Type(() => DocumentEntity)
  documents: DocumentEntity[] = [];

  // @Type(() => ServiceItemEntity)
  services: ServiceItemEntity[] = [];

  // Outras relações que você pode ativar depois:
  client: ClientEntity = new ClientEntity();
  user: UserEntity = new UserEntity();
  movements: ProcessMovementEntity[] = [];
  transactions: TransactionMovementEntity[] = [];
}