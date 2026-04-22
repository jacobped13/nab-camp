import { Nullable, Optional } from '../type/primitive.type';

/**
 * Utility type representing a entity that can be null or undefined.
 */
export type DataWrapper<T> = Optional<Nullable<T>>;

/**
 * Abstract class for mapping data from one type to another.
 * It provides methods to handle both single objects and arrays of objects.
 */
export abstract class DataMapper<T, R> {
  protected abstract mapInputObject(input: T): DataWrapper<R>;

  protected handleNullOrUndefined(): DataWrapper<R> {
    return null;
  }

  protected mapInputArray(input: DataWrapper<T>[]): DataWrapper<R>[] {
    if (input.length === 0) {
      return [];
    }

    const output = input.map((item: DataWrapper<T>): DataWrapper<R> => {
      if (item === null || item === undefined) {
        return this.handleNullOrUndefined();
      }

      return this.mapInputObject(item);
    }) as DataWrapper<R>[];

    return output;
  }

  public map(
    input: DataWrapper<T> | DataWrapper<T>[]
  ): DataWrapper<R> | DataWrapper<R>[] {
    if (input === null || input === undefined) {
      return this.handleNullOrUndefined();
    }

    if (Array.isArray(input)) {
      return this.mapInputArray(input);
    }

    return this.mapInputObject(input);
  }
}
