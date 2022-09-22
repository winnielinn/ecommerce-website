const categoryService = require('../services/category-service')

const categoryController = {
  getCategoriesPage: async (req, res, next) => {
    categoryService.getCategoriesPage(req, (err, data) => err ? next(err) : res.render('admin/categories', data))
  },
  postCategory: async (req, res, next) => {
    categoryService.postCategory(req, (err, data) => {
      if (err) return next(err)

      req.flash('success_messages', `已經成功新增 ${data.name} 這個分類。`)
      return res.redirect('/admin/categories')
    })
  },
  putCategory: async (req, res, next) => {
    categoryService.putCategory(req, (err, data) => {
      if (err) return next(err)

      req.flash('success_messages', `該分類 ${data.name} 已經被修改成功。`)
      return res.redirect('/admin/categories')
    })
  },
  deleteCategory: async (req, res, next) => {
    categoryService.deleteCategory(req, (err, _data) => {
      if (err) return next(err)

      req.flash('success_messages', '已成功刪除一個分類。')
      return res.redirect('/admin/categories')
    })
  }
}

module.exports = categoryController
