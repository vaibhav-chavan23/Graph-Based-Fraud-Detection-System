const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', transactionController.getAllTransactions);
router.put('/:txnId', transactionController.updateTransaction);
router.post('/upload', upload.single('file'), transactionController.uploadCsv);

module.exports = router;
