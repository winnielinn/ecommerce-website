const { Category } = require('../models')

const categoryController = {
  getCategoriesPage: async (req, res, next) => {
    try {
      const { id } = req.params
      const [categories, editCategory] = await Promise.all([
        await Category.findAll({ raw: true }),
        id ? await Category.findByPk(id, { raw: true }) : null
      ])

      res.render('admin/categories', { categories, editCategory })
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('分類名稱不可為空。')

      const existedName = await Category.findOne({ where: { name } })
      if (existedName) throw new Error('不可以新增相同的分類名稱。')

      await Category.create({
        name
      })

      req.flash('success_messages', `已經成功新增 ${name} 這個分類。`)
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  putCategory: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name } = req.body
      if (!name) throw new Error('分類名稱不可為空。')

      const category = await Category.findByPk(id)
      if (!category) throw new Error('無法修改不存在的分類。')

      await category.update({ name })
      req.flash('success_messages', `該分類 ${name} 已經被修改成功。`)
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const { id } = req.params
      const category = await Category.destroy({
        where: {
          id
        }
      })

      if (!category) throw new Error('無法刪除改不存在的分類。')

      req.flash('success_messages', '已成功刪除一個分類。')
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
