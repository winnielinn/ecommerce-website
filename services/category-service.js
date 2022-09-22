const { Category } = require('../models')

const categoryService = {
  getCategoriesPage: async (req, callback) => {
    try {
      const { id } = req.params
      const [categories, editCategory] = await Promise.all([
        await Category.findAll({ raw: true }),
        id ? await Category.findByPk(id, { raw: true }) : null
      ])

      return callback(null, { categories, editCategory })
    } catch (err) {
      callback(err)
    }
  },
  postCategory: async (req, callback) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('分類名稱不可為空。')

      const existedName = await Category.findOne({ where: { name } })
      if (existedName) throw new Error('不可以新增相同的分類名稱。')

      await Category.create({
        name
      })

      return callback(null, { name })
    } catch (err) {
      callback(err)
    }
  },
  putCategory: async (req, callback) => {
    try {
      const { id } = req.params
      const { name } = req.body
      if (!name) throw new Error('分類名稱不可為空。')

      const category = await Category.findByPk(id)
      if (!category) throw new Error('無法修改不存在的分類。')

      await category.update({ name })

      return callback(null, { name })
    } catch (err) {
      callback(err)
    }
  },
  deleteCategory: async (req, callback) => {
    try {
      const { id } = req.params
      const category = await Category.destroy({
        where: {
          id
        }
      })

      if (!category) throw new Error('無法刪除改不存在的分類。')

      return callback(null)
    } catch (err) {
      callback(err)
    }
  }
}

module.exports = categoryService
