import { assert, object, string, size, refine, enums, number, define } from 'superstruct'
import isUuid from 'is-uuid';

const OrderPaymentValidate = object({
    paymentMethod: enums(['CREDIT_CARD', 'DEBIT_CARD', 'PIX']),
    total: number(),
    orderId: define('Uuid', (value: any) => isUuid.v4(value)),
})

function validateOrderPayment(data: any) {
    return assert(data, OrderPaymentValidate);
}

export { validateOrderPayment };
  