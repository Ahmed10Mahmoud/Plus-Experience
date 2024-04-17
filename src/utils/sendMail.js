import nodemailer from 'nodemailer'

export const sendEmail = async({to,subject,html})=>{
    const transporter = nodemailer.createTransport({
        //sender
        host:'localhost',
        port:456,
        secure:true,
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAILPASS
        }
    })
    console.log("hellp")
    console.log(process.env.EMAIL + process.env.EMAILPASS)
    console.log(process.env.EMAIL + process.env.EMAILPASS)

    console.log(process.env.EMAIL + process.env.EMAILPASS)

    console.log(process.env.EMAIL + process.env.EMAILPASS)


    //reciver
    const emaiInfo = await transporter.sendMail({
        from:`"Plus-Exprience"<${process.env.EMAIL}>`,
        to,
        subject,
        html
    })

    return emaiInfo.accepted.length<1?false:true
    

} 