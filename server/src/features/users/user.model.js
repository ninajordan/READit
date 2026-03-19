export class UserModel {
  /**
   * @param {object} params
   * @param {string} params.userID
   * @param {string} params.username
   * @param {string} params.passwordHash
   * @param {string} params.name
   * @param {string} params.user_anonymity
   */
  constructor({ userID, username, passwordHash, name, user_anonymity }) {
    this.userID = userID;
    this.username = username;
    this.passwordHash = passwordHash;
    this.name = name;
    this.user_anonymity = user_anonymity;
  }
}
