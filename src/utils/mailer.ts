import config from 'config';
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
// import AWS from 'aws-sdk';
import logger from './logger';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// Use node mailer
const smtp = config.get<{
    host: string,
    port: number
    user: string,
    pass: string,
}>('smtp');

const options: SMTPTransport.Options = {
    host: smtp.host,
    port: smtp.port,
    secure: false,
    auth: {
        user: smtp.user,
        pass: smtp.pass
    },
    tls: {
        rejectUnauthorized: false
    }
}

const transporter: Transporter = nodemailer.createTransport(options);

async function sendEmail(payload: SendMailOptions): Promise<boolean> {
    let result: boolean = true;
    transporter.sendMail(payload, (err, info) => {
        if (err) {
            logger.error(err, 'Error sending email');
            logger.error(err);
            result = false;
        }
    })
    return result;
}


// Use AWS SES
// const aws = config.get<{
//     region: string
// }>('aws');

// const ses = new AWS.SES({ region: aws.region });

// async function sendEmail(payload: AWS.SES.SendEmailRequest): Promise<boolean> {
//     let result: boolean = true;
//     ses.sendEmail(payload, (err: AWS.AWSError, res: AWS.SES.SendEmailResponse) => {
//         if (err) {
//             logger.error('Error sending email');
//             logger.error(err);
//             result = false;
//         }
//     })
//     return result;
// }

export default sendEmail;