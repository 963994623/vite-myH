
export interface rowDataI {
    bank_type: string
    currency: string
    goods_big_logo: string
    goods_id: number
    goods_name: string
    num: number
    openid: string
    order_back_message: string
    order_back_timer: string
    out_trade_no: string
    payer_total: number
    state: number
    success_time: string
    total: number
    trade_state: string
    trade_type: string
    transaction_id: string
    __v: number
    _id: string
    fa_out_trade_no?: string
    listTotal?: number
}
export interface paramsI {
    fa_out_trade_no?: string
    total?: number
    out_trade_no?: string
    state?: number
}
export interface dialogI {
    orderNo: string
    openId: string
    orderName: string
    orderId: number
    price: number
    state: number
    order_back_timer?: string
    order_back_message?: string

}