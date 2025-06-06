import type { APIContext } from 'astro';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  message: z.string().min(1, "Please enter a message.")
});

export const contact = {
  async POST({ request }: APIContext) {
    try {
      const formData = await request.formData();
      const data = Object.fromEntries(formData.entries());
      
      // Validate with zod
      const result = contactSchema.safeParse(data);
      if (!result.success) {
        return new Response(JSON.stringify({
          success: false,
          errors: result.error.flatten().fieldErrors
        }), {
          status: 400
        });
      }

      const validatedData = result.data;

      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.5 ? resolve({ ok: true }) : reject(new Error('API error'));
        }, 1000);
      });

      return new Response(JSON.stringify({
        success: true,
        data: validatedData
      }));
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: 'There was an error submitting the form. Please try again later.'
      }), {
        status: 500
      });
    }
  }
};
