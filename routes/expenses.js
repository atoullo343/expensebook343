const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Expense = require('../models/Expense')

// @desc Show add page
// @route GET /expenses/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('expenses/add')
})

// @desc Process add form
// @route POSt /expenses
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Expense.create(req.body)
        res.redirect('dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// @desc Show all expenses
// @route GET /expenses/add
router.get('/', ensureAuth, async (req, res) => {
    try {
        const expenses = await Expense.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('expenses/index', {
            expenses
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// @desc Show edit page
// @route GET /expenses/edit:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id
        }).lean()

        if (!expense) {
            res.render('error/404')
        }

        if (expense.user != req.user.id) {
            res.redirect('/expenses')
        } else {
            res.render('expenses/edit', {
                expense
            })
        }
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }

})

// @desc Update expense
// @route PUT /expenses/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id).lean()

        if (!expense) {
            return res.render('erroe/404')
        }

        if (expense.user != req.user.id) {
            res.redirect('/expenses')
        } else {
            expense = await Expense.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

// @desc Delete expense
// @route DELETE /expenses/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id).lean()

        if (!expense) {
            return res.render('error/404')
        }

        if (expense.user != req.user.id) {
            res.redirect('/stories')
        } else {
            await Expense.remove({ _id: req.params.id })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc Show single expense
// @route GET /expenses/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id)
            .populate('user')
            .lean()
            let numberCheque = expense._id.toString().slice(16,24)
        if (!expense) {
            return res.render('error/404')
        }
        res.render('expenses/show', {
            expense,
            numberCheque
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

// @desc User stories
// @route GET /expenses/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const expenses = await Expense.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('expenses/index', {
            expenses
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
module.exports = router