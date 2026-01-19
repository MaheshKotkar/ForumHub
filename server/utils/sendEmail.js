import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    let transporter;

    // Create transporter based on environment
    if (process.env.SMTP_HOST) {
        // Production / Real SMTP
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    } else {
        // Development / Ethereal Test
        if (!global.testAccount) {
            global.testAccount = await nodemailer.createTestAccount();
        }

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: global.testAccount.user,
                pass: global.testAccount.pass,
            },
        });
        console.log("Using Ethereal Mail for testing");
    }

    const message = {
        from: `${process.env.FROM_NAME || 'ForumHub'} <${process.env.FROM_EMAIL || 'noreply@forumhub.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);

    // Preview URL only available when sending through Ethereal
    if (!process.env.SMTP_HOST) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
};

export default sendEmail;
