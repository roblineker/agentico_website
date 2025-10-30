import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Book workshop endpoint for ElevenLabs agent
 * 
 * Note: Koalendar doesn't provide a public API for creating bookings programmatically.
 * This endpoint provides guidance to the AI agent to use the send-link endpoint instead.
 * 
 * If you want programmatic booking, you would need to:
 * 1. Use Calendly or Cal.com which have booking APIs
 * 2. Build your own booking system with Google Calendar API
 * 3. Or manually integrate with Koalendar's webhook system
 */

const bookWorkshopSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  dateTime: z.string().optional(), // ISO format
  duration: z.number().optional(), // minutes: 60, 90, 120
});

type BookWorkshopData = z.infer<typeof bookWorkshopSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validatedData: BookWorkshopData = bookWorkshopSchema.parse(body);
    
    // Since Koalendar doesn't have a booking API, we provide a helpful response
    // that directs the agent to send the booking link instead
    
    return NextResponse.json({
      success: false,
      requiresAlternativeAction: true,
      action: 'send_booking_link',
      message: 'Direct booking not available - send link instead',
      data: {
        ...validatedData,
        bookingUrl: 'https://koalendar.com/e/discovery-call-with-agentico',
      },
      agentMessage: `I've got your details saved. The easiest way to book is for me to send you a link where you can choose from all our available times. You'll get an email in the next minute with the booking link. Does that work for you?`,
      recommendation: 'Use the /api/elevenlabs/booking/send-link endpoint to email the booking URL to the customer.',
      note: 'Koalendar does not provide a public API for programmatic booking. Consider using Calendly, Cal.com, or building a custom booking system if this functionality is critical.'
    });
    
  } catch (error) {
    console.error('Book workshop error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.issues,
          message: 'Required fields: fullName, email, phone'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

