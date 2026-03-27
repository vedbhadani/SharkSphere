import { Resend } from 'resend';
import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const resend = new Resend(process.env.RESEND_API_KEY);

const APP_NAME = 'Shark Sphere';
const BRAND_COLOR = '#7B5FFF';
const DASHBOARD_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

/**
 * Branded HTML Template for announcement
 */
const announcementTemplate = ({ ideaTitle, founderName, ideaLink }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0D0D0D; color: #FFFFFF; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; padding: 40px; background-color: #121212; border: 1px solid #1E1E1E; border-radius: 16px; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { color: ${BRAND_COLOR}; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; }
    .badge { display: inline-block; padding: 6px 12px; background-color: rgba(123, 95, 255, 0.1); border: 1px solid ${BRAND_COLOR}; border-radius: 20px; color: ${BRAND_COLOR}; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
    h1 { color: #FFFFFF; font-size: 24px; font-weight: 700; margin-bottom: 16px; line-height: 1.3; }
    p { color: #A0A0A0; line-height: 1.6; font-size: 16px; margin-bottom: 24px; }
    .founder-info { color: #FFFFFF; font-weight: 600; }
    .button-container { text-align: center; margin: 40px 0; }
    .button { display: inline-block; padding: 16px 32px; background-color: ${BRAND_COLOR}; color: #FFFFFF !important; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(123, 95, 255, 0.39); transition: all 0.2s; }
    .footer { text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #1E1E1E; color: #555555; font-size: 13px; }
    .footer strong { color: #888888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${APP_NAME}</div>
    </div>
    <div style="text-align: center;">
      <span class="badge">LIVE NOW</span>
      <h1>🚀 New Startup Idea Live on Shark Sphere</h1>
      <p>A fresh innovation has just cleared our elite valuation barrier!</p>
      <div style="background-color: #1A1A1A; padding: 24px; border-radius: 12px; margin-bottom: 24px; text-align: left; border-left: 4px solid ${BRAND_COLOR};">
        <h2 style="margin: 0; color: #FFFFFF; font-size: 20px;">${ideaTitle}</h2>
        <p style="margin: 8px 0 0 0; font-size: 14px;">Founded by <span class="founder-info">${founderName}</span></p>
      </div>
      <p>Join the community to vote, discuss, and explore the future of this project.</p>
      <div class="button-container">
        <a href="${ideaLink}" class="button">View Idea</a>
      </div>
    </div>
    <div class="footer">
      <p>Stay hungry. Stay innovative.</p>
      <p><strong>NST E-Cell</strong><br>Entrepreneurship & Innovation Hub</p>
      <p>&copy; ${new Date().getFullYear()} Shark Sphere Platform</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Send branded global announcement email using Resend
 */
export const sendGlobalNewIdeaEmail = async ({ to, ideaTitle, founderName, ideaLink }) => {
  try {
    const html = announcementTemplate({ ideaTitle, founderName, ideaLink });

    const { data, error } = await resend.emails.send({
      from: `"${APP_NAME}" <${FROM_EMAIL}>`,
      to,
      subject: `🚀 New Startup Idea Live on Shark Sphere: ${ideaTitle}`,
      html,
    });

    if (error) {
      console.error(`❌ Failed to send announcement to ${to} via Resend:`, error);
      return { success: false, email: to, error };
    }

    return { success: true, email: to, messageId: data.id };
  } catch (error) {
    console.error(`❌ Failed to send announcement to ${to}:`, error.message);
    return { success: false, email: to, error: error.message };
  }
};
