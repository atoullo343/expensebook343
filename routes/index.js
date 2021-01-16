const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')

const Expense = require('../models/Expense')

// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

// @desc dashboard
// @route GET / dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            expenses
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
    
})

module.exports = router