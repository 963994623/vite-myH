export interface comI {

    _id?: string
    goods_id?: number
    cat_id?: number
    goods_name: string
    goods_price: number
    goods_number: number
    goods_weight?: number
    goods_introduce: string
    goods_big_logo: string
    goods_small_logo: string
    goods_state?: number
    is_del: "0" | "1"
    add_time?: number
    upd_time?: number
    delete_time?: null | number
    hot_mumber: number
    is_promote?: boolean
    cat_one_id?: number
    cat_two_id?: number
    cat_three_id?: number
    goods_cat: number[]
    pics: comPicsI[]
    attrs: comAttrsI[]
}

export interface comPicsI {
    pics_id?: number
    goods_id?: number
    pics_mid: string
    pics_sma: string
    pics_big: string
    pic_big_url?: string
    pic_mid_url?: string
    pic_sma_url?: string
    key?: number
}

export interface comAttrsI {
    goods_id?: number
    attr_id?: number
    attr_value?: string
    add_price?: number
    attr_name: string
    attr_sel?: string
    attr_write?: string
    attr_vals: string
    key?: number
}