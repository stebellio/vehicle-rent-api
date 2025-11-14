export class RentalUserNotFoundException extends Error {
  constructor() {
    super(`Rental user not found.`);
  }
}
