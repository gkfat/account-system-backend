import config from 'config';
import nodemailer, { SendMailOptions } from 'nodemailer';
import logger from './logger';

// async function createTestCreds() {
//     const creds = await nodemailer.createTestAccount();
//     console.log({ creds });
// }

const smtp = config.get<{
    host: string,
    port: number
    user: string,
    pass: string,
}>('smtp');

const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    auth: {
        user: smtp.user,
        pass: smtp.pass
    }
});

async function sendEmail(payload: SendMailOptions): Promise<boolean> {
    let result: boolean = true;
    transporter.sendMail(payload, (err, info) => {
        if (err) {
            logger.error(err, 'Error sending email');
            result = false;
        }
    })
    return result;
}

export default sendEmail;