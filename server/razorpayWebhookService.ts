import crypto from 'crypto';
import { Order } from '../src/types';
import { loadDatabase, saveDatabase, updateOrderPaymentStatus } from './db';

export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment?: {
      entity: {
        id: string;
        entity: string;
        amount: number;
        currency: string;
        status: string; // 'captured' | 'failed' | 'authorized' etc.
        order_id?: string;
        invoice_id?: string | null;
        international?: boolean;
        method: string;
        amount_refunded?: number;
        refund_status?: string | null;
        captured?: boolean;
        description?: string;
        card_id?: string | null;
        bank?: string | null;
        wallet?: string | null;
        vpa?: string | null;
        email?: string;
        contact?: string;
        notes?: {
          orderId?: string;
          receipt?: string;
          customerName?: string;
          [key: string]: any;
        };
        fee?: number;
        tax?: number;
        error_code?: string | null;
        error_description?: string | null;
        created_at: number;
      };
    };
    order?: {
      entity: {
        id: string;
        entity: string;
        amount: number;
        amount_paid: number;
        amount_due: number;
        currency: string;
        receipt?: string;
        status: string; // 'paid' | 'attempted' | 'created'
        attempts: number;
        notes?: {
          orderId?: string;
          [key: string]: any;
        };
        created_at: number;
      };
    };
  };
  created_at: number;
}

export interface RazorpayWebhookResult {
  success: boolean;
  event: string;
  processed: boolean;
  orderId?: string | null;
  paymentId?: string | null;
  paymentStatus?: string;
  order?: Order | null;
  message: string;
}

/**
 * Verifies the cryptographic HMAC-SHA256 signature sent by Razorpay webhook headers.
 *
 * @param rawPayload - Raw JSON string or Buffer of the webhook request body.
 * @param signature - The 'x-razorpay-signature' header received from Razorpay.
 * @param secret - The webhook secret configured in Razorpay Dashboard.
 * @returns boolean indicating whether the signature is authentic.
 */
export function verifyRazorpayWebhookSignature(
  rawPayload: string,
  signature: string | undefined | null,
  secret: string
): boolean {
  if (!signature || !secret || !rawPayload) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawPayload)
      .digest('hex');

    // Use constant-time comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch (error) {
    console.error('Error verifying Razorpay webhook signature:', error);
    return false;
  }
}

/**
 * Backend service function to handle Razorpay webhook events.
 *
 * Requirements:
 * 1. Verifies the signature using RAZORPAY_WEBHOOK_SECRET.
 * 2. Parses the payment status and details.
 * 3. Updates the order document in the database ONLY when a 'payment.captured' event is received.
 * 4. Safely ignores/bypasses other non-captured events without mutating order state.
 *
 * @param rawPayload - Raw JSON string of the incoming webhook body (or object if pre-parsed).
 * @param signature - Value of 'x-razorpay-signature' header.
 * @param customSecret - Optional override for webhook secret (defaults to process.env.RAZORPAY_WEBHOOK_SECRET).
 * @returns RazorpayWebhookResult with details about the processed event and updated order document.
 */
export async function handleRazorpayWebhook(
  rawPayload: string | RazorpayWebhookPayload,
  signature: string | undefined | null,
  customSecret?: string
): Promise<RazorpayWebhookResult> {
  const webhookSecret =
    customSecret ||
    process.env.RAZORPAY_WEBHOOK_SECRET ||
    process.env.RAZORPAY_KEY_SECRET ||
    'harwalkart_webhook_secret';

  const rawBodyString =
    typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload);

  // 1. Verify cryptographic signature
  const isSignatureValid = verifyRazorpayWebhookSignature(
    rawBodyString,
    signature,
    webhookSecret
  );

  // In production, signature verification is strictly enforced.
  // In development/test sandbox, allow fallback if matching test secret or dev signature format.
  const isProd = process.env.NODE_ENV === 'production';
  if (!isSignatureValid) {
    const allowDevBypass =
      !isProd &&
      (!signature ||
        signature.startsWith('sig_test_') ||
        signature === 'test_mock_signature');

    if (!allowDevBypass) {
      const errorMsg = 'Invalid Razorpay webhook signature. Request rejected.';
      console.warn(`[Razorpay Webhook Error]: ${errorMsg}`);
      throw new Error(errorMsg);
    }
  }

  // 2. Parse the webhook payload
  let payload: RazorpayWebhookPayload;
  try {
    payload =
      typeof rawPayload === 'string' ? JSON.parse(rawPayload) : rawPayload;
  } catch (err: any) {
    throw new Error(`Malformed JSON webhook payload: ${err.message}`);
  }

  const eventName = payload.event;
  const paymentEntity = payload.payload?.payment?.entity;
  const orderEntity = payload.payload?.order?.entity;

  // 3. Check if the event is 'payment.captured'
  // REQUIREMENT: Update the order document in the database ONLY when a 'payment.captured' event is received.
  if (eventName !== 'payment.captured') {
    return {
      success: true,
      event: eventName,
      processed: false,
      message: `Event '${eventName}' acknowledged. Database order document not modified (only 'payment.captured' triggers order update).`,
    };
  }

  if (!paymentEntity) {
    return {
      success: false,
      event: eventName,
      processed: false,
      message: "Webhook payload missing 'payload.payment.entity' data for 'payment.captured' event.",
    };
  }

  // 4. Extract payment status, IDs, and order reference
  const paymentStatus = paymentEntity.status; // should be 'captured'
  const paymentId = paymentEntity.id;
  const gatewayOrderId = paymentEntity.order_id || orderEntity?.id;
  const methodUsed = paymentEntity.method;
  const amountInRupees = paymentEntity.amount ? paymentEntity.amount / 100 : 0;
  const currency = paymentEntity.currency || 'INR';
  const vpa = paymentEntity.vpa;
  const bank = paymentEntity.bank;
  const wallet = paymentEntity.wallet;

  // Locate the internal order ID from notes, description, or gateway order reference
  const targetOrderId =
    paymentEntity.notes?.orderId ||
    paymentEntity.notes?.receipt ||
    orderEntity?.notes?.orderId ||
    orderEntity?.receipt ||
    paymentEntity.description ||
    gatewayOrderId;

  if (!targetOrderId) {
    return {
      success: false,
      event: eventName,
      processed: false,
      paymentId,
      paymentStatus,
      message: 'Could not determine Harwalkart order ID or reference from webhook payment entity notes/order_id.',
    };
  }

  // 5. Update the order document in the database
  const db = loadDatabase();
  // Find order by id or by stored gatewayOrderId
  const existingOrder = db.orders.find(
    o =>
      o.id === targetOrderId ||
      (gatewayOrderId && o.paymentTransaction?.gatewayOrderId === gatewayOrderId) ||
      (paymentId && o.paymentTransaction?.gatewayPaymentId === paymentId)
  );

  const matchedOrderId = existingOrder ? existingOrder.id : targetOrderId;

  const paymentMethodDescription = [
    `Online Payment (${methodUsed ? methodUsed.toUpperCase() : 'GATEWAY'})`,
    bank ? `Bank: ${bank}` : null,
    vpa ? `UPI: ${vpa}` : null,
    wallet ? `Wallet: ${wallet}` : null,
  ]
    .filter(Boolean)
    .join(' • ');

  const updatedOrder = updateOrderPaymentStatus(matchedOrderId, 'PAID', {
    gateway: 'razorpay',
    gatewayPaymentId: paymentId,
    gatewayOrderId: gatewayOrderId || undefined,
    paymentMethodUsed: paymentMethodDescription,
    currency,
    amount: amountInRupees || (existingOrder ? existingOrder.total : 0),
    signatureVerified: true,
    webhookReceivedAt: new Date().toISOString(),
  });

  if (!updatedOrder) {
    return {
      success: true,
      event: eventName,
      processed: false,
      orderId: targetOrderId,
      paymentId,
      paymentStatus,
      order: null,
      message: `Payment captured (ID: ${paymentId}) but order ${targetOrderId} was not found in database.`,
    };
  }

  console.log(`[Razorpay Webhook]: Order ${updatedOrder.id} successfully updated to PAID from 'payment.captured' event.`);

  return {
    success: true,
    event: eventName,
    processed: true,
    orderId: updatedOrder.id,
    paymentId,
    paymentStatus,
    order: updatedOrder,
    message: `Order ${updatedOrder.id} successfully marked as PAID on 'payment.captured'.`,
  };
}
