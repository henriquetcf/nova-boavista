import { instanceToPlain } from 'class-transformer';

export abstract class BaseEntity<T> {
  /**
   * O Partial<T> garante que você só passe propriedades que 
   * realmente existem na classe que está herdando.
   */
  constructor(props?: Partial<T>) {
    if (props) {
      Object.assign(this, props);
    }
  }

  toJSON() {
    return instanceToPlain(this);
  }
}