const mongoose = require('mongoose')

let numberCheque = (Math.random()*1000000).toString().slice(0, 6);


const ExpenseSchema = new mongoose.Schema({
    cheque: {
        type: String,
        default: numberCheque
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'] 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Expense', ExpenseSchema)