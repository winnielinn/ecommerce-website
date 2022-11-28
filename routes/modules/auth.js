const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/products',
  failureRedirect: '/users/login'
}))

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/products',
  failureRedirect: '/users/login'
}))

module.exports = router
