export const BASE_URL = 'https://api.flutterstack.io';

export const ENDPOINTS = [
  {
    id: 'list-customers',
    method: 'GET',
    path: '/v1/customers',
    baseUrl: BASE_URL,
    description: 'Returns a list of your customers. Customers are ordered by creation date, with the most recent first.',
    params: [
      { name: 'limit', type: 'integer', required: false, description: 'Number of objects to return (default 10, max 100).' },
      { name: 'starting_after', type: 'string', required: false, description: 'Cursor for pagination — object ID to start after.' },
      { name: 'email', type: 'string', required: false, description: 'Filter customers by exact email address.' },
    ],
  },
  {
    id: 'create-customer',
    method: 'POST',
    path: '/v1/customers',
    baseUrl: BASE_URL,
    description: 'Creates a new customer object. Use this to store customer metadata and link it to payment methods.',
    sampleBody: { email: 'user@example.com', name: 'Jane Doe', metadata: { user_id: 'usr_123' } },
    params: [
      { name: 'email', type: 'string', required: false, description: "The customer's email address." },
      { name: 'name', type: 'string', required: false, description: "The customer's full name or business name." },
      { name: 'metadata', type: 'object', required: false, description: 'Set of key-value pairs for custom data.' },
    ],
  },
  {
    id: 'list-charges',
    method: 'GET',
    path: '/v1/charges',
    baseUrl: BASE_URL,
    description: 'Returns a list of charges you have previously created. Charges are sorted by creation date.',
    params: [
      { name: 'limit', type: 'integer', required: false, description: 'Number of objects to return.' },
      { name: 'customer', type: 'string', required: false, description: 'Only return charges for the given customer ID.' },
    ],
  },
  {
    id: 'create-charge',
    method: 'POST',
    path: '/v1/charges',
    baseUrl: BASE_URL,
    description: "To charge a credit card or other payment source, create a Charge object. If your API key is in test mode, the supplied payment source won't actually be charged.",
    sampleBody: { amount: 2000, currency: 'usd', source: 'tok_visa', description: 'Charge for jane@example.com' },
    params: [
      { name: 'amount', type: 'integer', required: true, description: 'Amount in cents (e.g. 2000 = $20.00).' },
      { name: 'currency', type: 'string', required: true, description: 'Three-letter ISO currency code (e.g. usd).' },
      { name: 'source', type: 'string', required: false, description: 'Payment source to be charged (token or card ID).' },
      { name: 'description', type: 'string', required: false, description: 'An arbitrary string to describe the charge.' },
    ],
  },
  {
    id: 'list-subscriptions',
    method: 'GET',
    path: '/v1/subscriptions',
    baseUrl: BASE_URL,
    description: 'Returns a list of subscriptions associated with your account.',
    params: [
      { name: 'customer', type: 'string', required: false, description: 'Filter subscriptions by customer ID.' },
      { name: 'status', type: 'string', required: false, description: 'Filter by status: active, past_due, canceled, trialing.' },
      { name: 'limit', type: 'integer', required: false, description: 'Number of objects to return.' },
    ],
  },
  {
    id: 'create-subscription',
    method: 'POST',
    path: '/v1/subscriptions',
    baseUrl: BASE_URL,
    description: 'Creates a new subscription on an existing customer.',
    sampleBody: { customer: 'cus_xxxxx', items: [{ price: 'price_xxxxx' }], trial_period_days: 14 },
    params: [
      { name: 'customer', type: 'string', required: true, description: 'The ID of the customer to subscribe.' },
      { name: 'items', type: 'array', required: true, description: 'List of subscription items, each with a price ID.' },
      { name: 'trial_period_days', type: 'integer', required: false, description: 'Integer trial period in days.' },
    ],
  },
  {
    id: 'list-payment-intents',
    method: 'GET',
    path: '/v1/payment_intents',
    baseUrl: BASE_URL,
    description: 'Returns a list of PaymentIntents, sorted by creation date in descending order.',
    params: [
      { name: 'limit', type: 'integer', required: false, description: 'Number of objects to return.' },
      { name: 'customer', type: 'string', required: false, description: 'Only return PaymentIntents for this customer.' },
    ],
  },
  {
    id: 'create-payment-intent',
    method: 'POST',
    path: '/v1/payment_intents',
    baseUrl: BASE_URL,
    description: 'Creates a PaymentIntent object. After creation, attach a payment method and confirm to continue the payment cycle.',
    sampleBody: { amount: 1099, currency: 'usd', automatic_payment_methods: { enabled: true } },
    params: [
      { name: 'amount', type: 'integer', required: true, description: 'Amount in cents.' },
      { name: 'currency', type: 'string', required: true, description: 'Three-letter ISO currency code.' },
      { name: 'customer', type: 'string', required: false, description: 'ID of the Customer this PaymentIntent belongs to.' },
      { name: 'description', type: 'string', required: false, description: 'Description for this PaymentIntent.' },
    ],
  },
  {
    id: 'list-refunds',
    method: 'GET',
    path: '/v1/refunds',
    baseUrl: BASE_URL,
    description: 'Returns a list of all refunds you have previously created.',
    params: [
      { name: 'charge', type: 'string', required: false, description: 'Only return refunds for the specified charge.' },
      { name: 'limit', type: 'integer', required: false, description: 'Number of objects to return.' },
    ],
  },
  {
    id: 'create-refund',
    method: 'POST',
    path: '/v1/refunds',
    baseUrl: BASE_URL,
    description: 'Create a refund when you want to refund a charge that has previously been created but not yet refunded.',
    sampleBody: { charge: 'ch_xxxxx', amount: 500, reason: 'requested_by_customer' },
    params: [
      { name: 'charge', type: 'string', required: true, description: 'The identifier of the charge to be refunded.' },
      { name: 'amount', type: 'integer', required: false, description: 'A positive integer in cents representing how much to refund.' },
      { name: 'reason', type: 'string', required: false, description: 'String indicating the reason: duplicate, fraudulent, or requested_by_customer.' },
    ],
  },
];

export function isValidKey(key) {
  return key.length > 20 && (key.startsWith('sk_') || key.startsWith('pk_') || key.startsWith('rk_'));
}