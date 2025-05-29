export async function post({ request }) {
  try {
    const body = await request.json();

    // Mock backend logic: Log the form data to the console
    console.log('Form submission received:', body);

    // Simulate success response
    return new Response(JSON.stringify({ message: 'Form submitted successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error handling form submission:', error);

    // Simulate error response
    return new Response(JSON.stringify({ message: 'Error submitting form.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
