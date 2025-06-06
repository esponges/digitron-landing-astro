import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: import.meta.env.SMTP_HOST,
  port: Number(import.meta.env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: import.meta.env.SMTP_USER,
    pass: import.meta.env.SMTP_PASS,
  },
});

interface EmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function sendContactNotification(data: EmailData) {
  const { name, email, phone, message } = data;
  const adminEmails = import.meta.env.ADMIN_EMAILS?.split(',') || [];

  if (!adminEmails.length) {
    console.warn('No admin emails configured for notifications');
    return;
  }

  const mailOptions = {
    from: import.meta.env.SMTP_FROM || '"Digitron Website" <noreply@digitron.com>',
    to: adminEmails.join(','),
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    text: `
      New Contact Form Submission
      
      Name: ${name}
      Email: ${email}
      ${phone ? `Phone: ${phone}\n` : ''}
      Message:
      ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent successfully');
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    throw error;
  }
}
