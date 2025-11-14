export class RentalUserNotFoundException extends Error {
  constructor(id: number) {
    super(`Rental user with id ${id} not found.`);
  }
}
