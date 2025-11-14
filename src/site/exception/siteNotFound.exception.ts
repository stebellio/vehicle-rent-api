export class SiteNotFoundException extends Error {
  constructor() {
    super(`Site not found`);
  }
}
