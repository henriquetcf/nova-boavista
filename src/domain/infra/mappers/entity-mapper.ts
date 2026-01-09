import 'reflect-metadata';
import { plainToInstance, instanceToPlain, ClassConstructor, ClassTransformOptions } from 'class-transformer';

export class EntityMapper {
  private static readonly defaultOptions: ClassTransformOptions = {
    excludeExtraneousValues: false,
    enableImplicitConversion: true,
  };

  /**
   * DESERIALIZE: Converte objeto plano (JSON/Prisma) para Instância da Classe
   * Agora aceita um objeto desconhecido (unknown) em vez de any.
   */
  static deserialize<T>(EntityClass: ClassConstructor<T>, data: unknown): T {
    if (!data) {
      throw new Error(`Mapper Error: Data provided to deserialize ${EntityClass.name} is null or undefined.`);
    }
    return plainToInstance(EntityClass, data, this.defaultOptions);
  }

  /**
   * SERIALIZE: Converte a Entity de volta para um objeto literal (Plain Object)
   * Recebe a instância da classe (T) e retorna um objeto plano.
   */
  static serialize<T>(entity: T): Record<string, unknown> {
    return instanceToPlain(entity) as Record<string, unknown>;
  }

  /**
   * DESERIALIZE LIST: Converte arrays de objetos para instâncias de classes
   */
  static deserializeList<T>(EntityClass: ClassConstructor<T>, dataList: unknown[]): T[] {
    if (!Array.isArray(dataList)) return [];
    return plainToInstance(EntityClass, dataList, this.defaultOptions);
  }
}