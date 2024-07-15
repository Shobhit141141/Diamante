const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  public_address: { type: String, required: true, unique: true },
  location: {
    type: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true }
    },
    required: true
  },
  secret_key: { type: String, required: true },
  my_listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  my_transactions: [],
  my_investments: [
    {
      type: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
      share_per: { type: Number, default: 0 }
    }
  ],
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
