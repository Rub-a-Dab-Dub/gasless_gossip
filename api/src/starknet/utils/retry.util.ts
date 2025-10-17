export class RetryUtil {
  static async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number,
    delayMs: number,
    operationName: string,
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        const msg = error?.message || '';

        if (
          msg.includes('revert_error') ||
          msg.includes('Contract error') ||
          msg.includes('Username does not exist') ||
          msg.includes('ENTRYPOINT_NOT_FOUND') ||
          msg.includes('missing field')
        ) {
          console.warn(
            `[RetryUtil] ${operationName} reverted on attempt ${attempt}/${maxRetries}:`,
            msg,
          );
          throw error; // let StarknetService handle it
        }

        lastError = error;
        console.warn(
          `[RetryUtil] ${operationName} failed (attempt ${attempt}/${maxRetries}):`,
          msg,
        );

        if (attempt < maxRetries) {
          await this.delay(delayMs * attempt);
        }
      }
    }

    // If all retries failed
    throw new Error(
      `${operationName} failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`,
    );
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
