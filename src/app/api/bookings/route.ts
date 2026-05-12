import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

// Helper function to send Email to Customer (100% Free via Gmail)
async function sendCustomerEmail(bookingData: any) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass || !bookingData.customer_email) {
    console.log('Customer Email skipped: Missing credentials in .env.local or missing customer email');
    return;
  }

  const shortId = bookingData.id?.split('-')[0]?.toUpperCase();
  const date = bookingData.pickup_date;
  const time = bookingData.pickup_time || 'Anytime';
  const routeText = `${bookingData.pickup_location?.split(',')[0]} to ${bookingData.drop_location?.split(',')[0]}`;
  const carType = bookingData.car_model?.split(' (')[0] || bookingData.car_model;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #FF6B35; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Your ride with Prakash Travels is confirmed.</p>
      </div>
      <div style="padding: 20px; background-color: #f9fafb;">
        <h2 style="margin-top: 0; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Trip Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 40%;">Booking ID</td><td style="padding: 8px 0; color: #111827; font-weight: bold;">${shortId}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Customer Name</td><td style="padding: 8px 0; color: #111827;">${bookingData.customer_name || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Route</td><td style="padding: 8px 0; color: #111827;">${routeText}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Car Model</td><td style="padding: 8px 0; color: #111827;">${carType}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Date & Time</td><td style="padding: 8px 0; color: #111827;">${date} at ${time}</td></tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px;">
          <p style="margin: 0; color: #b45309; font-size: 13px;"><strong>Note:</strong> Extra km charges apply beyond the estimated route. Toll charges are to be paid by the passenger directly at toll plazas.</p>
        </div>
      </div>
      <div style="background-color: #1f2937; padding: 15px; text-align: center;">
        <p style="color: #9ca3af; margin: 0; font-size: 12px;">Thank you for choosing Prakash Travels!</p>
      </div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"Prakash Travels" <${user}>`,
      to: bookingData.customer_email,
      subject: `Booking Confirmed! ID: ${shortId}`,
      html: htmlContent,
    });
    console.log('Customer Email Sent!');
  } catch (err) {
    console.error('Failed to send Customer Email:', err);
  }
}

// Helper function to send SMS to Customer (Fast2SMS)
async function sendBookingSMS(bookingData: any) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) return;

  const shortId = bookingData.id?.split('-')[0]?.toUpperCase();
  const date = bookingData.pickup_date;
  const time = bookingData.pickup_time || 'Anytime';
  const customerNumber = bookingData.contact;

  const routeText = `${bookingData.pickup_location?.split(',')[0]} to ${bookingData.drop_location?.split(',')[0]}`;
  const carType = bookingData.car_model?.split(' (')[0] || bookingData.car_model;

  const customerMessage = `PRAKASH TRAVELS\nBooking Confirmed!\nID: ${shortId}\nRoute: ${routeText}\nCar: ${carType}\nDate: ${date} ${time}\nNote: Extra charges apply for additional kms.`;

  if (customerNumber) {
    try {
      await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: { "authorization": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ route: "q", message: customerMessage, language: "english", flash: 0, numbers: customerNumber })
      });
    } catch (err) {
      console.error('Failed to send Customer SMS:', err);
    }
  }
}

// Helper function to send Admin Alert via Telegram (100% Free)
async function sendTelegramAdminAlert(bookingData: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('Telegram Alert skipped: Missing credentials in .env.local');
    return;
  }

  const shortId = bookingData.id?.split('-')[0]?.toUpperCase();
  const date = bookingData.pickup_date;
  const time = bookingData.pickup_time || 'Anytime';
  const customerNumber = bookingData.contact;
  const customerName = bookingData.customer_name || 'N/A';
  const routeText = `${bookingData.pickup_location?.split(',')[0]} to ${bookingData.drop_location?.split(',')[0]}`;
  const carType = bookingData.car_model?.split(' (')[0] || bookingData.car_model;

  const text = `🚨 *NEW BOOKING ALERT* 🚨\n\n*ID:* \`${shortId}\`\n*Route:* ${routeText}\n*Car:* ${carType}\n*Date:* ${date} at ${time}\n*Customer:* ${customerName}\n*Phone:* [${customerNumber}](tel:${customerNumber})`;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
    console.log('Telegram Admin Alert Sent!');
  } catch (err) {
    console.error('Failed to send Telegram Alert:', err);
  }
}

// GET /api/bookings
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.trim() || '';
  const finished = searchParams.get('finished'); // 'true', 'false', or null (all)

  let query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  // Filter by finished status
  if (finished === 'true') {
    query = query.eq('finished', true);
  } else if (finished === 'false') {
    query = query.eq('finished', false);
  }

  // Search across multiple columns using ilike
  if (search) {
    query = query.or(
      `contact.ilike.%${search}%,pickup_location.ilike.%${search}%,drop_location.ilike.%${search}%,car_model.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// POST /api/bookings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('bookings')
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fire off the SMS, Email & Telegram notifications (waits to finish so Vercel doesn't kill it)
    if (data.contact) {
      await sendBookingSMS(data);
    }
    if (data.customer_email) {
      await sendCustomerEmail(data);
    }
    await sendTelegramAdminAlert(data);

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
