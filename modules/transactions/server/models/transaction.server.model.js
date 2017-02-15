'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Transaction Schema
 */
var TransactionSchema = new Schema({
  customer: {
    type: String,
    default: '',
    required: 'Please fill Transaction customer',
    trim: true
  },
  product: {
    type: Array,
    default: []
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  orderTime: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Transaction', TransactionSchema);