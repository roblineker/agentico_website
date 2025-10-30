import { NextRequest, NextResponse } from 'next/server';

/**
 * Check availability endpoint for ElevenLabs agent
 * 
 * Note: Koalendar doesn't provide a public API for checking availability programmatically.
 * This endpoint provides a helpful response that directs the agent to send the booking link instead.
 * 
 * If you want real-time availability checking, you would need to:
 * 1. Use Koalendar's webhook to sync bookings to your database
 * 2. Maintain your own availability calendar
 * 3. Or integrate with Google Calendar API directly
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateRange = searchParams.get('dateRange') || 'next_two_weeks';
    
    // Since we can't check Koalendar availability programmatically,
    // we return a helpful message for the AI agent
    
    return NextResponse.json({
      success: true,
      message: 'Availability check requires booking link',
      recommendation: 'send_booking_link',
      data: {
        dateRange,
        bookingUrl: 'https://koalendar.com/e/discovery-call-with-agentico',
        agentMessage: 'I can send you a link where you can see all our available times and pick one that works best for you. Would you like me to email that to you?'
      },
      note: 'Koalendar does not provide a public API for real-time availability. The best approach is to send the booking link via email.'
    });
    
  } catch (error) {
    console.error('Availability check error:', error);
    
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // POST method for flexibility
  return GET(request);
}

