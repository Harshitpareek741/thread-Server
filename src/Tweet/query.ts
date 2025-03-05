export const typeQuery = `#graphql
  getAllTweets: [Tweet]!
  getPresignurl(imagetype: String!, imageName: String!): String 
  getLikes(tweetId: String!): [Like] 
  getComments(tweetId: String!): [Comment]!
  getRetweet(tweetId: String!): [Retweet]
  getViews(tweetId: String!): Int
`
