export class InvalidRentalCompleteDateException extends Error {
  constructor() {
    super(`Invalid rental complete date`);
  }
}
