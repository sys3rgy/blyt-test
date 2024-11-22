import crypto from 'crypto';

export function GenerateSHA512Hash(dataString: any) {
    const secret = `${process.env.COMMERCE_PAY_SECRET_KEY}`;
    const message = `https://staging-payments.commerce.asia/api/services/app/PaymentGateway/RequestPayment${dataString}`.toLowerCase();
    const hash = crypto.createHmac('sha256', secret)
        .update(message)
        .digest('hex');
    return (hash);
}