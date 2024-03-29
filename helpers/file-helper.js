const fs = require('fs')
const imgur = require('imgur')

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

// 設定 client_id
imgur.setClientId(IMGUR_CLIENT_ID)

// 暫存至 temp 和 upload 資料夾
const localFileHandler = async (file) => {
  try {
    if (!file) return null

    const fileName = `upload/${file.originalname}`
    const data = await fs.promises.readFile(file.path)
    await fs.promises.writeFile(fileName, data)
    return `/${fileName}`
  } catch (err) {
    return err
  }
}

// 使用 imgur
const imgurFileHandler = async (file) => {
  try {
    // 上傳圖片
    if (!file) return null
    const img = await imgur.uploadFile(file.path)
    return img?.link || null
  } catch (err) {
    return err
  }
}

module.exports = {
  localFileHandler,
  imgurFileHandler
}
