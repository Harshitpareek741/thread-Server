export const type = `#graphql
  input TweetPayload {
  content : String !
  imageUrl : String
  }
  type Tweet {
    id: ID!
    content: String!
    authorId: String!
    author: User!
    imageUrl : String
    likes : Int!
    comments : Tweet
    views : Int!
    retweet : Int!
  }
  
`
