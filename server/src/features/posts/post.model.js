export class PostModel {
    /**
   * @param {object} params
   * @param {string} params.postID
   * @param {string} params.postTitle
   * @param {string} params.postBody
   * @param {string} params.posterID
   * @param {string} [params.channelID]
   */
  constructor({postID, postTitle, postBody, posterID, channelID = undefined}) {
    this.postID = postID;
    this.postTitle = postTitle;
    this.postBody = postBody;
    this.posterID = posterID;

    if (this.channelID != undefined) {
        this.channelID = channelID
    }
  }
}