const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.statics.signup = async function (phoneNumber, password) {
    const exists = await this.findOne({ phoneNumber });

    if (exists) {
        throw Error('Phone number already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ phoneNumber, password: hash });

    return user;
};

userSchema.statics.login = async function (phoneNumber, password) {
    if (!phoneNumber || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ phoneNumber });

    if (!user) {
        throw Error('Incorrect phone number');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Incorrect password');
    }

    return user;
};

module.exports = mongoose.model('User', userSchema);
