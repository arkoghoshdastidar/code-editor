const mongoose = require('mongoose');
const { Schema } = mongoose;

const codeValueSchema = new Schema({
    code: String
});

const codeModel = mongoose.model('code', codeValueSchema);

module.exports = codeModel;