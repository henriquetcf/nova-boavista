import "reflect-metadata";
import { Type } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { BankEntity } from './bank.entity';
// Importe a TransactionMovimentEntity quando criar

export class BankAccountEntity extends BaseEntity<BankAccountEntity> {
  id: string = "";
  cnpj: string = "";
  agency: string = "";
  account: string = "";

  @Type(() => String)
  balance: string = "0";

  bankId: string = "";

  @Type(() => BankEntity)
  bank?: BankEntity;

  // Se precisar das transações vinculadas à conta:
  // @Type(() => TransactionMovimentEntity)
  // movementsAsDestination: TransactionMovimentEntity[] = [];
  
  // @Type(() => TransactionMovimentEntity)
  // movementsAsOrigin: TransactionMovimentEntity[] = [];
}