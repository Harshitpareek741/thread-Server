export const typeMutation = `#graphql
  createTweet(payload: TweetPayload): Tweet!
  createLike(tweetId: String!): Boolean!
  deleteLike(tweetId: String!): Boolean!
  createComment(tweetId: String!, description: String!): Comment!
  deleteComment(commentId: String!): Boolean!
  createRetweet(tweetId: String!): Boolean!
  deleteRetweet(tweetId: String!): Boolean!
  createViews(tweetId: String!): Boolean!
`
