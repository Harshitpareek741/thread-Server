import { query } from "express";
import { typeMutation } from "./mutation";
import {  resolvers } from "./resolver";
import { typeQuery } from "./query";
import { type } from "./type";


export const Tweet = {typeMutation,resolvers,typeQuery,type}