const resultsService = require('../services/results.service');

exports.getLatestResult = async (req, res) => {
    try {
        const data = await resultsService.getLatestResult();
        if (!data) {
            return res.status(404).json({ success: false, error: "No analysis results found. Run the fraud engine first." });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
