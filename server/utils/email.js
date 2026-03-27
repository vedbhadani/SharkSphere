import { Resend } from 'resend';
import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const APP_NAME = 'Shark Sphere';
const BRAND_COLOR = '#7B5FFF';
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

const emailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0D0D0D; color: #FFFFFF; margin: 0; padding: 0; }
    .container { max-width: 600px; mx-auto; padding: 40px; background-color: #151515; border: 1px solid #262626; border-radius: 12px; margin-top: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { color: ${BRAND_COLOR}; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
    .footer { text-align: center; margin-top: 30px; color: #8A8A8A; font-size: 12px; }
    .button { display: inline-block; padding: 12px 24px; background-color: ${BRAND_COLOR}; color: #FFFFFF !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    h1 { color: #FFFFFF; font-size: 22px; margin-bottom: 20px; }
    p { color: #CCCCCC; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${APP_NAME}</div>
    </div>
    ${content}
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} NST E-Cell. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const sendApprovalEmail = async (userEmail, ideaTitle) => {
  if (!resend) {
    console.log(`[Email Mock] Approval email would have been sent to ${userEmail}`);
    return;
  }
  try {
    const html = emailTemplate(`
      <h1>Congratulations! 🚀</h1>
      <p>Great news! Your startup idea <strong>"${ideaTitle}"</strong> has been approved by the Shark Sphere moderation team.</p>
      <p>Your idea is now live on the platform and visible to the community. You can start gaining votes and finding potential co-founders right away.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">View Your Idea</a>
      <p>Keep building and stay innovative!</p>
    `);

    const { error } = await resend.emails.send({
      from: `"${APP_NAME} Admin" <${FROM_EMAIL}>`,
      to: userEmail,
      subject: `Approved: Your Idea "${ideaTitle}" is now live!`,
      html,
    });

    if (error) {
      console.error('❌ Error sending approval email via Resend:', error);
    } else {
      console.log(`✅ Approval email sent to ${userEmail}`);
    }
  } catch (error) {
    console.error('❌ Error sending approval email:', error);
  }
};

export const sendRejectionEmail = async (userEmail, ideaTitle, reason) => {
  if (!resend) {
    console.log(`[Email Mock] Rejection email would have been sent to ${userEmail}`);
    return;
  }
  try {
    const html = emailTemplate(`
      <h1>Idea Review Update</h1>
      <p>Thank you for submitting your idea <strong>"${ideaTitle}"</strong> to Shark Sphere.</p>
      <p>After careful review, our moderation team has decided not to approve your idea at this time for the following reason:</p>
      <div style="background-color: #262626; padding: 15px; border-radius: 6px; border-left: 4px solid #FF4B4B; margin: 20px 0;">
        <p style="margin: 0; color: #FFFFFF;">${reason}</p>
      </div>
      <p>Don't be discouraged! Most great startups go through multiple refinements. We encourage you to address the feedback and resubmit your idea once it's refined.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Open Dashboard</a>
    `);

    const { error } = await resend.emails.send({
      from: `"${APP_NAME} Admin" <${FROM_EMAIL}>`,
      to: userEmail,
      subject: `Update regarding your idea: "${ideaTitle}"`,
      html,
    });

    if (error) {
      console.error('❌ Error sending rejection email via Resend:', error);
    } else {
      console.log(`✅ Rejection email sent to ${userEmail}`);
    }
  } catch (error) {
    console.error('❌ Error sending rejection email:', error);
  }
};

export const sendVerificationEmail = async (email, token) => {
  if (!resend) {
    console.log(`[Email Mock] Verification email would have been sent to ${email} with token ${token}`);
    return;
  }
  try {
    const backendUrl = process.env.BACKEND_URL || 'https://sharksphere.onrender.com';
    const verificationUrl = `${backendUrl}/api/auth/verify-email/${token}`;

    const html = emailTemplate(`
      <h1>Welcome to Shark Sphere!</h1>
      <p>Please click the link below to verify your email and start your entrepreneurial journey:</p>
      <a href="${verificationUrl}" class="button">Verify Email Address</a>
      <p>Or copy this link: ${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    `);

    const { error } = await resend.emails.send({
      from: `"${APP_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email - Entrepreneurship Club',
      html,
    });

    if (error) {
      console.error('❌ Error sending verification email via Resend:', error);
    } else {
      console.log('✅ Verification email sent successfully');
    }
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
  }
};