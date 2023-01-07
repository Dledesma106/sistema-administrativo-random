import {sign, UserIdJwtPayload, verify} from 'jsonwebtoken'
import { IUser } from '../models/interfaces'
const secret = process.env.SECRET || ''

export const getToken = (user:IUser) => {
    return sign({
      exp: Math.floor(Date.now() / 1000) + 60 *60 * 24 * 30, //30 days
      userId:user._id.toString()
    }, secret)
}

export const getPayload = (jwt:string) =>{
  return verify(jwt, secret)
}