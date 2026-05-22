import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feature, action, page, metadata } = await req.json();

    if (!feature || !action) {
      return Response.json({ error: 'feature and action are required' }, { status: 400 });
    }

    await base44.entities.FeatureEvent.create({
      user_email: user.email,
      feature,
      action,
      page: page || '',
      metadata: metadata ? JSON.stringify(metadata) : '',
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('trackEvent error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});