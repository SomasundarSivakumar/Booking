import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper function to send SMS (Example uses Fast2SMS, popular in India)
async function sendBookingSMS(bookingData: any) {
  // Get API key from environment variables
  const apiKey = process.env.FAST2SMS_API_KEY; 
  
  if (!apiKey) {
    console.log('SMS skipped: FAST2SMS_API_KEY not set in .env.local');
    return;
  }

  const shortId = bookingData.id?.split('-')[0]?.toUpperCase();
  const date = bookingData.pickup_date;
  const time = bookingData.pickup_time || 'Anytime';
  const mobileNumber = bookingData.contact; // Customer's number
  
  const routeText = `${bookingData.pickup_location?.split(',')[0]} to ${bookingData.drop_location?.split(',')[0]}`;
  const carType = bookingData.car_model?.split(' (')[0] || bookingData.car_model;
  
  // Construct the SMS message
  const message = `PRAKASH TRAVELS\nBooking Confirmed!\nID: ${shortId}\nRoute: ${routeText}\nCar: ${carType}\nDate: ${date} ${time}\nNote: Extra charges apply for additional kms.`;
  
  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        route: "q",
        message: message,
        language: "english",
        flash: 0,
        numbers: mobileNumber,
      })
    });
    const textResult = await response.text();
    try {
      const jsonResult = JSON.parse(textResult);
      console.log('SMS Provider Response:', jsonResult);
    } catch (parseErr) {
      console.log('SMS Provider Raw Text Response:', textResult);
    }
  } catch (err) {
    console.error('Failed to send SMS API Request:', err);
  }
}

// GET /api/bookings
export async function GET(request: NextRequest) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

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

    // Fire off the SMS notification (waits to finish so Vercel doesn't kill it)
    if (data.contact) {
      await sendBookingSMS(data);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
