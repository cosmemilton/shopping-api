import axios from 'axios';
import type { TokenizeCardRequest, TokenizeCardResponse, TokenPaymentResponse, TokenPaymentBodyRequest } from '../types'

const BASE_URL = process.env.ESITEF_URL?.toString();
const MERCHANT_ID = process.env.ESITEF_MERCHANT_ID?.toString();
const MERCHANT_KEY = process.env.ESITEF_MERCHANT_KEY?.toString();

class ESitefService {
  static async getMerchantToken() {
    const response = await axios.post(`${BASE_URL}/v1/token/merchants`, {}, {
        headers: {
            'Content-Type': 'application/json',
            'merchant_id': MERCHANT_ID,
            'merchant_key': MERCHANT_KEY,
        }
    });
    return response.data;
  }

  static async tokenizeCard(cardData: TokenizeCardRequest): Promise< TokenizeCardResponse > {
    try {
      
      const data = {
        card: {
            expiry_date: cardData.card.expiry_date,
            number: cardData.card.number,
        },
        authorizer_id: cardData.authorizer_id.toString(),
        customer_id: cardData.customer_id,
        merchant_usn: cardData.merchant_usn
      };  

      const response = await axios.post(`${BASE_URL}/v1/cards`, data, {
        headers: {
          'Content-Type': 'application/json',
          'merchant_id': MERCHANT_ID,
          'merchant_key': MERCHANT_KEY
        }
      });

      return response.data;
    } catch (error) {

      throw error;
    }
  }

  static async authorizeSaleWithCard(saleData: any) {
    try {
      const response = await axios.post(`${BASE_URL}/v2/payments/`, saleData, {
        headers: {
          'Content-Type': 'application/json',
          'merchant_id': MERCHANT_ID,
          'merchant_key': MERCHANT_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error authorizing sale with card:', error);
      throw error;
    }
  }

  static async authorizeSaleWithToken(saleData: TokenPaymentBodyRequest):Promise< TokenPaymentResponse > {
    try {
      const response = await axios.post(`${BASE_URL}/v2/payments/`, saleData, {
        headers: {
          'Content-Type': 'application/json',
          'merchant_id': MERCHANT_ID,
          'merchant_key': MERCHANT_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error authorizing sale with token:', error);
      throw error;
    }
  }

  static async listMerchantTokens(queryParams: any) {
    try {
      const response = await axios.get(`${BASE_URL}/v1/cards/list`, {
        headers: {
          'merchant_id': MERCHANT_ID,
          'merchant_key': MERCHANT_KEY,
          'token': queryParams.token
        },
        params: {
          authorizer_id: queryParams.authorizer_id,
          status: queryParams.status,
          page: queryParams.page,
          limit: queryParams.limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error listing merchant tokens:', error);
      throw error;
    }
  }
}

export default ESitefService;