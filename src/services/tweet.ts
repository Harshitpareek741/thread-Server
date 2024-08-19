import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import 'dotenv/config'
import prisma from "../clientdb";


const AWS_ACCESS_KEY_ID=process.env.S3_ACCESS;
const AWS_SECRET_ACCESS_KEY=process.env.SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;
interface TweetPayload {
    content : string,
    imageUrl : string
}




class Tweet {
    public static async getPresignedurl(imageName: string , imagetype: string,ids: string){
    const client = new S3Client({region : "ap-south-1" ,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID || "",
          secretAccessKey: AWS_SECRET_ACCESS_KEY || ""
        }
      });
      const command = new PutObjectCommand({
        Bucket : BUCKET_NAME || "",
        Key : `images/${ids}/${imageName}_${Date.now()}.${imagetype}`,
        ContentType : imagetype
      });
      const url = await getSignedUrl(client, command, { expiresIn: 3600 });

      return url
    }
    public static async createTweet(payload:TweetPayload , ids : string){
        if(ids.length<=0){ throw new Error("Authentication not done yet");}
        const newTweet = await prisma.tweet.create({
           data:{
            content : payload.content,
            imageUrl : payload.imageUrl,
            author: {connect : {id : ids}},
           }
        });
     return newTweet;
    }

}

export default Tweet;