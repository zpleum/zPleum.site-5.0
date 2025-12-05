import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message, captchaToken } = await request.json();

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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.CLOUDFLARE_SECRET,
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

    // Send email using Resend
    try {
      const data = await resend.emails.send({
        from: 'Contact Form <contact@zpleum.site>',
        to: 'wiraphat.makwong@gmail.com',
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        html: `
          <div style="
            font-family: 'Inter', Arial, sans-serif;
            background: linear-gradient(135deg, #ecf2ff 0%, #f6e9ff 50%, #ffe9f3 100%);
            padding: 32px;
            border-radius: 16px;
            max-width: 650px;
            margin: auto;
            box-shadow: 0 8px 30px rgba(0,0,0,0.05);
          ">
            
            <div style="
              background: rgba(255, 255, 255, 0.75);
              backdrop-filter: blur(12px);
              padding: 28px;
              border-radius: 14px;
              border: 1px solid rgba(255,255,255,0.5);
            ">
              
              <h2 style="
                margin: 0 0 20px 0;
                font-size: 26px;
                font-weight: 700;
                background: linear-gradient(90deg, #2563eb, #7c3aed, #ec4899);
                -webkit-background-clip: text;
                color: transparent;
              ">
                New Contact Form Message ✨
              </h2>

              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; color:#374151;">Name</div>
                <div style="
                  margin-top: 6px;
                  background:white;
                  padding:12px;
                  border-radius:8px;
                  border:1px solid #e5e7eb;
                ">${name}</div>
              </div>

              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; color:#374151;">Email</div>
                <div style="
                  margin-top:6px;
                  background:white;
                  padding:12px;
                  border-radius:8px;
                  border:1px solid #e5e7eb;
                ">
                  <a href="mailto:${email}" style="color:#2563eb; text-decoration:none;">${email}</a>
                </div>
              </div>

              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; color:#374151;">Subject</div>
                <div style="
                  margin-top:6px;
                  background:white;
                  padding:12px;
                  border-radius:8px;
                  border:1px solid #e5e7eb;
                ">${subject}</div>
              </div>

              <div style="margin-bottom: 24px;">
                <div style="font-weight: 600; color:#374151;">Message</div>
                <div style="
                  margin-top:6px;
                  background:white;
                  padding:16px;
                  line-height:1.6;
                  border-radius:8px;
                  border:1px solid #e5e7eb;
                ">${message.replace(/\n/g, "<br>")}</div>
              </div>

              <div style="
                margin-top: 24px;
                font-size: 13px;
                color: #6b7280;
                text-align: center;
              ">
                Sent from your website contact form.
              </div>

            </div>
          </div>
        `,
      });

      console.log('Email sent successfully:', data);

      return NextResponse.json({
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon.',
      });

    } catch (emailError: unknown) {
      console.error('Resend error:', emailError);

      return NextResponse.json(
        {
          error: emailError instanceof Error ? emailError.message : 'Failed to send email. Please try again or contact me directly.',
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
