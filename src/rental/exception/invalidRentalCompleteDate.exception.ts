export class InvalidRentalCompleteDateException extends Error {
  constructor(completeDate: Date) {
    super(`Invalid rental complete date: ${completeDate.toISOString()}`);
  }
}
