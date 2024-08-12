export class Utils {
  public TOKEN_EXPIRED = 5 * 60 * 1000;

  static generateVerificationToken() {
    const digits = Math.floor(100_000 + Math.random() * 900_000);
    return digits;
  }
}
