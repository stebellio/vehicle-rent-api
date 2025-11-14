export class UserBusyException extends Error {
  constructor() {
    super(`User is already renting a vehicle`);
  }
}
