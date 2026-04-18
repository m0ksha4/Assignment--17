export function generateOTP(){
    const minNumber =1000000
    const maxNumber=9000000
    return Math.floor(Math.random()*minNumber+maxNumber)
}