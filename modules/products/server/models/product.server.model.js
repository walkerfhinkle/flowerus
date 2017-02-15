'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill in product name',
    trim: true
  },
  upc : {
    type: Number,
    default: '',
    required: 'Please fill in upc code',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill in product description',
    trim: true
  },
  price: {
    type: Number,
    default: '',
    required: 'Please fill in product price',
    trim: true
  },
  inventory: {
    type: Number,
    default: '',
    required: 'Please fill in product inventory',
    trim: true
  },
  cost: {
    type: Number,
    default: '',
    required: 'Please fill in product cost',
    trim: true
  },
  department: {
    type: String,
    default: '',
    required: 'Please fill in department of product',
    trim: true
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

mongoose.model('Product', ProductSchema);
