export class UserNotFoundException extends Error {
  constructor(address: Address) {
    super(`User with address ${address} not found`);
    this.name = 'UserNotFoundException';
  }
}

export class ReputationUnderflowException extends Error {
  constructor(currentReputation: number, attemptedChange: number, minimum: number) {
    super(`Reputation underflow: ${currentReputation} + ${attemptedChange} would be below minimum ${minimum}`);
    this.name = 'ReputationUnderflowException';
  }
}

export class ReputationOverflowException extends Error {
  constructor(currentReputation: number, attemptedChange: number, maximum: number) {
    super(`Reputation overflow: ${currentReputation} + ${attemptedChange} would exceed maximum ${maximum}`);
    this.name = 'ReputationOverflowException';
  }
}