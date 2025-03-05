export const type = `#graphql
  input TweetPayload {
    content: String!
    imageUrl: String
  }
  
  type Tweet {
    id: ID!
    content: String!
    authorId: String!
    author: User!
    imageUrl: String
    likes: [Like]        
    comments: [Comment]
    views: Int!
    retweets: [Retweet]
  }
  
  type Comment {
    id: ID!
    tweetId: String!
    userId: String!
    description: String!
    createdAt: String!
    user: User!
  }
  
  type Like {
    id: ID!
    tweetId: String!
    userId : String!
    user: User!
    createdAt: String!
  }
  
  type Retweet {
    id: ID!
    tweetId: String!
    user: User!
    createdAt: String!
  }
`;
