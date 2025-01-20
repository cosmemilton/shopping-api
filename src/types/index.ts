export enum AuthorizerType {
    VISA = 1,
    MASTERCARD = 2,
    AMERICAN_EXPRESS = 3,
    MULTICHECK = 4,
    HIPER = 5,
    AURA = 6,
    BANCO_IBI = 9,
    CABAL = 12,
    POLICARD = 13,
    BIGCARD = 15,
    SUPERCARD = 16,
    EXCARD = 17,
    EDMCARD = 18,
    COOPER_CARD = 19,
    CREDMAIS = 20,
    DACASA = 21,
    CREDISHOP = 22,
    OBOE = 23,
    SMARTSHOP = 24,
    ACCREDITO = 25,
    COOPLIFE = 26,
    VALECARD = 28,
    SOROCRED = 29,
    MAXICRED = 30,
    CREDSYSTEM = 31,
    TREDENEXX = 32,
    DINERS = 33,
    BANESE = 34,
    SICREDI = 35,
    MULTIALIMENTACAO = 36,
    MULTICASH = 37,
    ICARDSPL = 38,
    FORTBRASIL = 40,
    ELO = 41,
    GOODCARD = 42,
    JCB = 43,
    DISCOVER = 44,
    CHINA_UNION_PAY = 45,
    CREDZ = 46,
    AGIPLAN = 47,
    VEROCHEQUE = 48,
    SAVEGNAGO = 49,
    MASTERCARD_ALIMENTACAO = 50,
    MASTERCARD_REFEICAO = 51,
    TRICARD = 52,
    ABASTECE_AI = 53,
    PERSONAL_CARD = 59,
    MUFFATO = 60,
    BRASILCARD = 61,
    TICKET_REFEICAO = 70,
    TICKET_ALIMENTACAO = 71,
    TICKET_FLEX = 74,
    TICKET_SUPERFLEX = 75,
    MARISA_PRIVATE_LABEL = 86,
    BRADESCARD_PRIVATE_LABEL = 115,
    COMPCARD = 116,
    PAN = 122,
    CARTAO_PRESENTE_MARISA = 127,
    ORBITALL = 160,
    E_COMMERCE_PERNAMBUCANAS = 161,
    CLUB_PLUS = 162,
    CARTAO_VUON_PRIVATE_LABEL = 163,
    AVISTA_CREDITO = 192,
    CAMPEAO_PRIVATE_LABEL = 193,
    VISA_PRIVATE_LABEL = 201,
    MASTERCARD_PRIVATE_LABEL = 202,
    VR_ALIMENTACAO = 207,
    VR_REFEICAO = 209,
    VR_AUTO = 210,
    VR_CULTURA = 211,
    HUG_GIFT = 218,
    ALELO_CULTURA = 223,
    ALELO_REFEICAO = 224,
    ALELO_ALIMENTACAO = 225,
    COOPERCARD_CULTURA = 245,
    COOPERCARD_ALIMENTACAO = 246,
    COOP_FACIL_PRIVATE_LABEL = 250,
    CASSOL_PRIVATE_LABEL = 266,
    EXTRABOM = 267,
    VERDECARD_PRIVATE_LABEL = 271,
    SODEXO_VALE_CULTURA = 279,
    SODEXO_VALE_ALIMENTACAO = 280,
    SODEXO_VALE_REFEICAO = 281,
    SODEXO_GIFT = 282,
    SODEXO_PREMIUM = 283,
    SODEXO_COMBUSTIVEL = 284,
    BANESCARD = 285,
    MASTERCARD_DEBITO = 286,
    KOERICH = 287,
    ELO_DEBITO = 288,
    VALECARD_VOUCHER = 289,
    BCASH = 401,
    MERCADO_PAGO = 402,
    BANCO_DO_BRASIL_BOLETO = 404,
    GOOGLE_PAY = 405,
    VISA_CHECKOUT = 406,
    ALELO_AUTO = 409,
    SAMSUNG_PAY = 410,
    BANRI_COMPRAS_A_VISTA = 411,
    BANRI_COMPRAS_PARCELADO = 412,
    BANRI_COMPRAS_PRE_DATADO = 413,
    CASA_SHOW = 414,
    SENFF = 430,
    VEE = 431,
    PIX = 440,
    VEGAS_CARD_CREDITO = 441,
    VEGAS_CARD_DEBITO = 442,
    VEGAS_CARD_REFEICAO = 444,
    BRADESCARD_VOUCHER = 445
}

export interface Card {
    expiry_date: string;
    number: string;
    alias?: string;    
}

export interface TokenizeCardRequest {
    card: Card;
    authorizer_id: AuthorizerType;
    merchant_usn?: string;
    customer_id: string;
}

export interface TokenizeCardResponse {
    code: string;
    message: string;
    card: {
      token: string;
      suffix: string;
      bin: string;
    };
    store: {
      status: string;
      nsua: string;
      nita: string;
      merchant_usn: string;
      customer_id: string;
      authorizer_id: string;
    };
  }

export interface TokenPaymentBodyRequest {
    merchant_usn: string;
    order_id: string;
    installments: string;
    installment_type: string;
    authorizer_id: string;
    amount: string;
    card: {
        token: string;
    };
}

export type CardPaymentBodyRequest = {
    merchant_usn: string;
    order_id: string;
    installments: string;
    installment_type: string;
    authorizer_id: string;
    amount: string;
    card: {
      expiry_date: string;
      security_code: string;
      number: string;
    };
  };

export interface TokenPaymentResponse {
    code: string;
    message: string;
    payment: {
        authorizer_code: string;
        authorizer_message: string;
        status: string;
        nit: string;
        order_id: string;
        customer_receipt: string;
        merchant_receipt: string;
        authorizer_id: string;
        acquirer_id: string;
        acquirer_name: string;
        authorizer_date: string;
        authorization_number: string;
        merchant_usn: string;
        esitef_usn: string;
        sitef_usn: string;
        host_usn: string;
        amount: string;
        payment_type: string;
        issuer: string;
        authorizer_merchant_id: string;
        terminal_id: string;
        payment_date: string;
        recurrency_tid: string;
    };
}

export type CardPaymentResponse = {
    code: string;
    message: string;
    payment: {
      authorizer_code: string;
      authorizer_message: string;
      status: string;
      nit: string;
      order_id: string;
      customer_receipt: string;
      merchant_receipt: string;
      authorizer_id: string;
      acquirer_id: string;
      acquirer_name: string;
      authorizer_date: string;
      authorization_number: string;
      merchant_usn: string;
      esitef_usn: string;
      sitef_usn: string;
      host_usn: string;
      amount: string;
      payment_type: string;
      issuer: string;
      authorizer_merchant_id: string;
      terminal_id: string;
      payment_date: string;
    };
  };