import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message, captchaToken } = await request.json();
    console.log('Received contact request. Captcha token present:', !!captchaToken);

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate captcha token
    if (!captchaToken) {
      return NextResponse.json(
        { error: 'Please complete the captcha verification' },
        { status: 400 }
      );
    }

    // Verify captcha with Cloudflare Turnstile
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.CLOUDFLARE_SECRET || '',
        response: captchaToken,
      }),
    });

    const turnstileData = await turnstileResponse.json();

    if (!turnstileData.success) {
      return NextResponse.json(
        { error: 'Captcha verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Generate mailto link for fallback
    const mailtoLink = `mailto:wiraphat.makwong@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key') {
      return NextResponse.json(
        {
          error: 'Email service is not configured on the server.',
          mailtoLink
        },
        { status: 200 } // Return 200 so the client can handle the mailtoLink redirect
      );
    }

    // Send email using Resend
    try {
      const data = await resend.emails.send({
        from: 'Contact Form <contact@zpleum.site>',
        to: 'wiraphat.makwong@gmail.com',
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        html: `
          <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #030712; color: #f8fafc; padding: 40px 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #030712; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden; text-align: left; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.6); position: relative;">
              
              <!-- Vibrant Top Bar -->
              <div style="height: 4px; background: linear-gradient(90deg, #3b82f6, #7c3aed, #ec4899);"></div>

              <!-- Technical Header -->
              <div style="padding: 40px 32px; background: radial-gradient(circle at top right, rgba(37,99,235,0.08), transparent 70%); border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px; background-color: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.2); border-radius: 99px; font-size: 10px; font-weight: 900; letter-spacing: 0.2em; color: #3b82f6; text-transform: uppercase; margin-bottom: 20px;">
                  <span style="display: inline-block; width: 6px; height: 6px; background-color: #3b82f6; border-radius: 50%; box-shadow: 0 0 8px #3b82f6; margin-right: 6px;"></span>
                  COMMUNICATION UPLINK
                </div>
                <h1 style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; line-height: 1.1;">
                  NEW <span style="color: transparent; -webkit-background-clip: text; background: linear-gradient(90deg, #3b82f6, #60a5fa); background-clip: text;">TRANSMISSION</span>
                </h1>
                <p style="margin: 12px 0 0 0; font-size: 14px; font-weight: 500; color: #475569; letter-spacing: 0.02em;">
                  TIMESTAMP: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              </div>

              <!-- Parameters Grid -->
              <div style="padding: 32px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding-bottom: 24px; width: 50%;">
                      <span style="font-size: 9px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; color: #475569; display: block; margin-bottom: 8px;">IDENTITY</span>
                      <div style="font-size: 16px; font-weight: 700; color: #f8fafc;">${name}</div>
                    </td>
                    <td style="padding-bottom: 24px;">
                      <span style="font-size: 9px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; color: #475569; display: block; margin-bottom: 8px;">DIGITAL LINK</span>
                      <a href="mailto:${email}" style="font-size: 16px; font-weight: 700; color: #3b82f6; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <span style="font-size: 9px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; color: #475569; display: block; margin-bottom: 8px;">SUBJECT PROTOCOL</span>
                      <div style="font-size: 16px; font-weight: 700; color: #f8fafc;">${subject}</div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Payload Container -->
              <div style="padding: 32px; background-color: rgba(255,255,255,0.01);">
                <span style="font-size: 9px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; color: #475569; display: block; margin-bottom: 16px;">DATA PAYLOAD</span>
                <div style="padding: 24px; background-color: #020617; border: 1px solid rgba(255,255,255,0.05); border-left: 3px solid #3b82f6; border-radius: 8px 24px 24px 8px; font-size: 15px; font-weight: 500; line-height: 1.8; color: #94a3b8; white-space: pre-wrap;">${message}</div>
              </div>

              <!-- Branding Footer -->
              <div style="padding: 24px 32px; background-color: rgba(37,99,235,0.02); text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                <p style="margin: 0; font-size: 10px; font-weight: 900; letter-spacing: 0.2em; color: #475569; text-transform: uppercase;">
                  NEURAL CONNECTION VERIFIED <span style="color: #3b82f6; margin-left: 8px;">ZPLEUM.SITE</span>
                </p>
              </div>
            </div>
            
            <div style="margin-top: 32px; font-size: 10px; color: #475569; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">
              &copy; 2026 WIRAPHAT MAKWONG. LICENSED UNDER MIT LICENSE.
            </div>
          </div>
        `,

      });

      console.log('Email sent successfully:', data);

      return NextResponse.json({
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon.',
        mailtoLink
      });

    } catch (emailError: unknown) {
      console.error('Resend error:', emailError);

      return NextResponse.json(
        {
          error: emailError instanceof Error ? emailError.message : 'Failed to send email. Please try again or contact me directly.',
          mailtoLink,
          details: emailError instanceof Error ? emailError.stack : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
