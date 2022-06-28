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
      console.error(err)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) {
        req.flash('error_messages', '分類名稱不可為空。')
        return res.redirect('back')
      }

      const existedName = await Category.findOne({ where: { name } })
      if (existedName) {
        req.flash('error_messages', '不可新增相同的分類名稱。')
        return res.redirect('back')
      }

      await Category.create({
        name
      })

      req.flash('success_messages', `已經成功新增 ${name} 這個分類。`)
      return res.redirect('/admin/categories')
    } catch (err) {
      console.error(err)
    }
  },
  putCategory: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name } = req.body
      if (!name) {
        req.flash('error_messages', '分類名稱不可為空。')
        return res.redirect('back')
      }

      const category = await Category.findByPk(id)
      if (!category) {
        req.flash('error_messages', '無法修改不存在的分類。')
        return res.redirect('back')
      }

      await category.update({ name })
      req.flash('success_messages', `該分類 ${name} 已經被修改成功。`)
      return res.redirect('/admin/categories')
    } catch (err) {
      console.error(err)
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

      if (!category) {
        req.flash('error_messages', '無法刪除不存在的分類。')
        return res.redirect('back')
      }

      req.flash('success_messages', '已成功刪除一個分類。')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = categoryController
