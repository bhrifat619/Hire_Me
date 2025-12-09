const { v4: uuidv4 } = require("uuid")

const processPayment = async ({ amount, currency = "BDT", userID }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
        id: uuidv4(),
        user: userID,
        amount,
        currency,
        status: "succeeded",
        paidAt: new Date()
    }
};

module.exports = { processPayment };
