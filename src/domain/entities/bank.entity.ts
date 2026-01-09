import "reflect-metadata";
import { Type } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { BankAccountEntity } from './bank-account.entity';

export class BankEntity extends BaseEntity<BankEntity> {
  id: string = "";
  name: string = "";
  code: string = "";
  cnpj: string = "";

  @Type(() => BankAccountEntity)
  bankAccounts: BankAccountEntity[] = [];
}