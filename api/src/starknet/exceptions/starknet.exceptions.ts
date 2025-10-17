import { HttpException, HttpStatus } from '@nestjs/common';

export class StarknetConnectionException extends HttpException {
  constructor(message: string) {
    super(
      `StarkNet Connection Error: ${message}`,
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}

export class StarknetTransactionException extends HttpException {
  constructor(message: string) {
    super(`StarkNet Transaction Error: ${message}`, HttpStatus.BAD_REQUEST);
  }
}

export class StarknetContractException extends HttpException {
  constructor(message: string) {
    super(
      `StarkNet Contract Error: ${message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
