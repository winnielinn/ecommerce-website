const fs = require('fs')

const localFileHandler = async file => {
  try {
    if (!file) return null

    const fileName = `upload/${file.originalname}`
    const data = await fs.promises.readFile(file.path)
    await fs.promises.writeFile(fileName, data)
    return `/${fileName}`
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  localFileHandler
}
