import crypto from 'node:crypto'
import { SECRETKEY } from '../../config'
export const encryption=(data : string)=>{
    const iv=crypto.randomBytes(16)
    const cipherData=crypto.createCipheriv("aes-256-cbc",Buffer.from(SECRETKEY),iv)
    let encryptedData=cipherData.update(data,"utf-8","hex")
    encryptedData+=cipherData.final("hex")
    return `${iv.toString("hex")}:${encryptedData}`
}
export const decryption=(encryptedData:string)=>{
    const[iv,encryptedValue]=encryptedData.split(":")
    const ivBufferLike=Buffer.from(iv as string,"hex")
    const decipher=crypto.createDecipheriv("aes-256-cbc",Buffer.from(SECRETKEY),ivBufferLike)
    let decrypted=decipher.update(encryptedValue as string,"hex","utf-8")
    decrypted+=decipher.final("utf-8")
    return decrypted

}