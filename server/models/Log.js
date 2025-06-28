import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  logId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  workedOn: {
    type: String,
    required: true
  },
  blockers: {
    type: String
  },
  notes: {
    type: String
  },
  links: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: { createdAt: 'mongoCreatedAt', updatedAt: 'updatedAt' }

});

const Log = mongoose.model("Log", logSchema);

export default Log;
