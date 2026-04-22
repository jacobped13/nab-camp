// -----------------------------------------------------------------
// Message Encoder
// -----------------------------------------------------------------

export interface MessageEncoder<T> {
  encode(data: T): Buffer;
  decode(data: Buffer): T;
}

export class JSONMessageEncoder<T> implements MessageEncoder<T> {
  public encode(data: T): Buffer {
    return Buffer.from(JSON.stringify(data), 'utf-8');
  }
  public decode(data: Buffer): T {
    return JSON.parse(data.toString('utf-8')) as T;
  }
}
