import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { user_email, title, message, type, link } = await req.json();

    // Admins can send to any user; regular users can only notify themselves
    if (user.role !== 'admin' && user_email !== user.email) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const notification = await base44.asServiceRole.entities.Notification.create({
      user_email,
      title,
      message,
      type: type || 'system',
      is_read: false,
      ...(link ? { link } : {}),
    });

    return Response.json({ notification });
  } catch (error) {
    console.error('sendNotification error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});