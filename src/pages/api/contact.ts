import type { APIRoute } from 'astro';
import { z } from 'zod';
import { sendContactNotification } from '../../utils/mailer';

const contactSchema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  message: z.string().min(1, "Please enter a message.")
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const formData = Object.fromEntries(data.entries());
    
    // Validate with zod
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        errors: result.error.flatten().fieldErrors
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const validatedData = result.data;

    // Send email notification
    await sendContactNotification(validatedData);

    return new Response(JSON.stringify({
      success: true,
      message: 'Form submitted successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Error processing form:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'There was an error submitting the form. Please try again later.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
