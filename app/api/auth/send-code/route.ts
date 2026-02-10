import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const verificationCodes = new Map<string, { code: string; expires: number }>();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log('📧 Attempting to send code to:', email);
    
    if (!email) {
      console.log('❌ No email provided');
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(email, {
      code,
      expires: Date.now() + 10 * 60 * 1000
    });

    console.log('🔐 Generated code:', code);
    console.log('📮 Sending from:', process.env.GMAIL_USER);

    const info = await transporter.sendMail({
      from: `"AllInOne Store" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your AllInOne Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to AllInOne!</h2>
          <p style="font-size: 16px; color: #666;">Your verification code is:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #999;">This code will expire in 10 minutes.</p>
        </div>
      `
    });

    console.log('✅ Email sent successfully!', info.messageId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Send code error:', error.message);
    console.error('Full error:', error);
    return NextResponse.json({ error: 'Failed to send code' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    console.log('🔍 Verifying code for:', email);
    
    const stored = verificationCodes.get(email);
    
    if (!stored) {
      console.log('❌ No code found for email');
      return NextResponse.json({ error: 'No code found' }, { status: 400 });
    }
    if (Date.now() > stored.expires) {
      console.log('❌ Code expired');
      verificationCodes.delete(email);
      return NextResponse.json({ error: 'Code expired' }, { status: 400 });
    }
    if (stored.code !== code) {
      console.log('❌ Invalid code. Expected:', stored.code, 'Got:', code);
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    console.log('✅ Code verified successfully!');
    verificationCodes.delete(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Verify code error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}