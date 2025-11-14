export class SiteNotFoundException extends Error {
  constructor(id: number) {
    super(`Site with id ${id} not found`);
  }
}
