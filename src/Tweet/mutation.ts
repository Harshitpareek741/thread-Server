export const typeMutation = `#graphql
    createTweet(payload : TweetPayload) : Tweet!
    createlike(tweetId : String) : Boolean!
    createComment(payload : TweetPayload!) : Tweet!
    createRetweet(tweetId : String) : Tweet!
    createViews(tweetId : String) : Boolean!
`
