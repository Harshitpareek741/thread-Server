export const typeQuery = `#graphql
 getAllTweets : [Tweet]!
 getPresignurl(imagetype : String!,imageName: String!) : String 
 getLikes(tweetId : String!) :  Int 
 getCommnets(TweetId : String!) : [Tweet]!
 getRetweet(tweetId : String!): Int
 getViews(tweetId : String!) : Int
`