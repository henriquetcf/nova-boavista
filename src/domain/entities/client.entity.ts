import { Type } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { ProcessEntity } from './process.entity';
import { TransactionMovementEntity } from './transaction-movement.entity';

export class ClientEntity extends BaseEntity<ClientEntity> {
  id: string = "";
  name: string = "";
  cpf: string | null = null;
  cnpj: string | null = null;
  rg: string | null = null;
  phone: string | null = null;
  address: string | null = null;

  @Type(() => Date)
  createdAt: Date = new Date();

  @Type(() => Date)
  updatedAt: Date = new Date();

  @Type(() => ProcessEntity)
  processes: ProcessEntity[] = [];

  @Type(() => TransactionMovementEntity)
  transactions: TransactionMovementEntity[] = [];
}