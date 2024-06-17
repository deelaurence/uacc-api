const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)

const MessageSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "please provide Message date"],
    },
    id: {
      type: String,
      required: [true, "Message id cannot be empty"]
    },
    reference: {
      type: String,
      required: [true, "please provide reference"],
    },
    title: {
      type: String,
      required: [true, "please provide title"],
    },
    minister: {
      type: String,
      required: [true, "please provide minister"],
    },
    headingOne: {
      type: String,
      required: [true, "please provide details"],
    },
    paragraphOne: {
      type: String,
      required: [true, "please provide details"],
    },
    headingTwo: {
      type: String,

    },
    paragraphTwo: {
      type: String,

    },
    headingThree: {
      type: String,
    },
    paragraphThree: {
      type: String,
    },
    quoteOne: {
      type: String,
    },
    quoteTwo: {
      type: String,
    },
    quoteThree: {
      type: String,
    },
    pointOne: {
      type: String,
    },
    pointTwo: {
      type: String,
    },
    pointThree: {
      type: String,
    },
    pointFour: {
      type: String,
    },
    pointFive: {
      type: String,
    },
    pointSix: {
      type: String,
    },
    pointSeven: {
      type: String,
    },
    pointEight: {
      type: String,
    },
    pointNine: {
      type: String,
    },
    pointTen: {
      type: String,
    },
    readMinutes: {
      type: String,
    },
    image: {
      type: [String],
    },
    link: {
      type: String,
    },

    day: {
      type: String,
    },
    author: {
      type: String,
      required: [true, "Author cannot be empty"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "please provide owner"],
    },
    filterId: {
      type: Number,
      required: true,
    },
    filterName: {
      type: String,
      required: true,
    },
    publish: {
      type: Boolean,
      default: false,
  }

  },
  { timestamps: true },

);
// MessageSchema.plugin(AutoIncrement,{inc_field:'id'})
module.exports = mongoose.model("Messages", MessageSchema);
