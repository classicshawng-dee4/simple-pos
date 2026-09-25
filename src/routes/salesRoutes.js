const express = require("express");
const router = express.Router();
console.log("SALES ROUTES FILE LOADED");

const {
    createSale,
    getSales
} = require("../controllers/saleController");
router.get("/ping", (req, res) => {
    res.json({
        success: true,
        message: "Sales route works"
    });
});

router.post("/", createSale);
router.get("/", getSales);

module.exports = router;