import "reflect-metadata";
import { Type } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { BankAccountEntity } from './bank-account.entity';
import { ProcessEntity } from './process.entity';
import { ClientEntity } from './client.entity';

export class TransactionMovementEntity extends BaseEntity<TransactionMovementEntity> {
  id: string = "";
  
  // Enums do Prisma (TransactionType e PaymentMethod)
  type: string = ""; 
  method: string = "";

  @Type(() => String)
  value: string = "0";

  description: string | null = null;

  @Type(() => Date)
  date: Date = new Date();

  originAccountId: string | null = null;
  destinationAccountId: string | null = null;
  processId: string | null = null;
  clientId: string | null = null;

  @Type(() => Date)
  createdAt: Date = new Date();

  // RELAÇÕES
  @Type(() => ClientEntity)
  client?: ClientEntity;

  @Type(() => BankAccountEntity)
  destinationAccount?: BankAccountEntity;

  @Type(() => BankAccountEntity)
  originAccount?: BankAccountEntity;

  @Type(() => ProcessEntity)
  process?: ProcessEntity;
}