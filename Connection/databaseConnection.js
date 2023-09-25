const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Mongoose Connected');
    } catch (err) {
        console.log(`Some Error Occured ${err}`);
    }
}

module.exports = { connectDB };