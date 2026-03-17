export class UserModel {
  /**
   * @param {object} params
   * @param {string} params.userID
   * @param {string} params.name
   * @param {string} params.user_anonymity
   */
  constructor({ userID, name, user_anonymity }) {
    this.userID = userID;
    this.name = name;
    this.user_anonymity = user_anonymity;
  }
}
