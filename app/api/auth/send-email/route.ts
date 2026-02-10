import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, code, type } = await request.json();

    if (type === 'verification') {
      console.log('');
      console.log('==============================================');
      console.log('📧 SENDING VERIFICATION EMAIL');
      console.log('To:', email);
      console.log('Code:', code);
      console.log('==============================================');
      console.log('');

      const { data, error } = await resend.emails.send({
        from: 'AllInOne <onboarding@resend.dev>',
        to: email,
        subject: 'Verify Your Email - AllInOne',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #8b7355;">Welcome to AllInOne!</h1>
            <p style="font-size: 16px; color: #333;">Your verification code is:</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h2 style="color: #8b7355; font-size: 32px; letter-spacing: 8px; margin: 0;">${code}</h2>
            </div>
            <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
          </div>
        `,
      });

      if (error) {
        console.error('❌ Resend error:', error);
        console.log('💡 BACKUP CODE:', code);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      console.log('✅ Email sent successfully!');
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error: any) {
    console.error('❌ Server error:', error);
    console.log('💡 BACKUP CODE:', code);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
