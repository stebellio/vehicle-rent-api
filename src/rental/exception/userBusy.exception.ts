export class UserBusyException extends Error {
  constructor(id: number) {
    super(`User with id ${id} is already renting a vehicle`);
  }
}
