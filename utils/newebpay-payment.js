if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const crypto = require('crypto')

const URL = process.env.URL
const MerchantID = process.env.MERCHANT_ID
const HashKey = process.env.HASH_KEY
const HashIV = process.env.HASH_IV

const PayGateWay = 'https://ccore.newebpay.com/MPG/mpg_gateway'
const ReturnURL = URL + '/orders/newebpay/callback?from=ReturnURL'
const NotifyURL = URL + '/orders/newebpay/callback?from=NotifyURL'
const ClientBackURL = URL + '/orders'

// 將交易參數字串和 HashKey + HashIV 進行 AES 加密得出 TradeInfo
function enecryptTradeInfoAES (TradeInfo) {
  const encrypt = crypto.createCipheriv('aes256', HashKey, HashIV)
  const encrypted = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex')
  return encrypted + encrypt.final('hex')
}

// 將 TradeInfo 和 HashKey + HashIV 進行 SHA 加密得出 TradeSha
function hashTradeInfoSHA (TradeInfo) {
  const sha = crypto.createHash('sha256')
  const plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`
  return sha.update(plainText).digest('hex').toUpperCase()
}

// 將交易資料串接成字串
function genDataChain (data) {
  const results = []
  for (const item of Object.entries(data)) {
    results.push(`${item[0]}=${item[1]}`)
  }
  return results.join('&')
}

const newebpay = {
  getTradeInfo: (Amt, Desc, Email) => {
    // 這些是藍新在傳送參數時的必填欄位
    const data = {
      MerchantID, // 商店代號
      TimeStamp: Date.now(), // 時間戳記
      Version: '2.0', // 串接版本
      RespondType: 'JSON', // 回傳格式
      MerchantOrderNo: Math.floor(Date.now() / 1000), // 商店訂單編號
      Amt, // 訂單金額
      Email, // 付款人電子信箱
      NotifyURL, // 支付通知網址
      ReturnURL, // 支付完成返回商店網址
      ClientBackURL, // 返回商店網址
      ItemDesc: Desc, // 商品資訊
      LoginType: 0, // 藍新金流會員
      OrderComment: '金流測試 API 連線，信用卡卡號請輸入 4000-2211-1111-1111，有效年月及卡片背後末三碼，請任意填寫。' // 商店備註
    }

    const result = {
      MerchantID,
      PayGateWay,
      TradeInfo: enecryptTradeInfoAES(data), // 加密後參數
      TradeSha: hashTradeInfoSHA(enecryptTradeInfoAES(data)), // 壓碼參數
      Version: '2.0'
    }

    return result
  },

  // 回傳交易資料解密
  decryptTradeInfoAES: (TradeInfo) => {
    const decrypt = crypto.createDecipheriv('aes256', HashKey, HashIV)
    decrypt.setAutoPadding(false)
    const text = decrypt.update(TradeInfo, 'hex', 'utf8')
    const plainText = text + decrypt.final('utf8')
    const result = plainText.replace(/[\x00-\x20]+/g, '')
    return result
  }
}

module.exports = newebpay
