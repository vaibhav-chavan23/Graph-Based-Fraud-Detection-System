module.exports = [
    // Cycle: A -> B -> C -> A
    { txnId: "TXN001", sender: "A", receiver: "B", amount: 1200, timestamp: 1000 },
    { txnId: "TXN002", sender: "B", receiver: "C", amount: 1200, timestamp: 1005 },
    { txnId: "TXN003", sender: "C", receiver: "A", amount: 1200, timestamp: 1010 },

    // Velocity: H sends many in short window
    { txnId: "TXN004", sender: "H", receiver: "I", amount: 200, timestamp: 1100 },
    { txnId: "TXN005", sender: "H", receiver: "J", amount: 250, timestamp: 1110 },
    { txnId: "TXN006", sender: "H", receiver: "K", amount: 300, timestamp: 1120 },
    { txnId: "TXN007", sender: "H", receiver: "L", amount: 350, timestamp: 1130 },
    { txnId: "TXN008", sender: "H", receiver: "M", amount: 400, timestamp: 1140 },
    { txnId: "TXN009", sender: "H", receiver: "N", amount: 450, timestamp: 1150 },
    { txnId: "TXN010", sender: "H", receiver: "O", amount: 500, timestamp: 1160 },

    // Smurfing: D sends to 4+ recipients, all < 1000
    { txnId: "TXN011", sender: "D", receiver: "E", amount: 900, timestamp: 1200 },
    { txnId: "TXN012", sender: "D", receiver: "F", amount: 800, timestamp: 1210 },
    { txnId: "TXN013", sender: "D", receiver: "G", amount: 950, timestamp: 1220 },
    { txnId: "TXN014", sender: "D", receiver: "H", amount: 700, timestamp: 1230 },
    { txnId: "TXN015", sender: "D", receiver: "I", amount: 990, timestamp: 1240 },

    // Mule: 5 senders to Q, Q sends large amount to R
    { txnId: "TXN016", sender: "A", receiver: "Q", amount: 2000, timestamp: 1300 },
    { txnId: "TXN017", sender: "B", receiver: "Q", amount: 2500, timestamp: 1310 },
    { txnId: "TXN018", sender: "C", receiver: "Q", amount: 3000, timestamp: 1320 },
    { txnId: "TXN019", sender: "D", receiver: "Q", amount: 2200, timestamp: 1330 },
    { txnId: "TXN020", sender: "E", receiver: "Q", amount: 2800, timestamp: 1340 },
    { txnId: "TXN021", sender: "Q", receiver: "R", amount: 12000, timestamp: 1350 },

    // Propagation: strongly flagged account (Q) sends to R, R sends to S, S sends to T
    { txnId: "TXN022", sender: "R", receiver: "S", amount: 5000, timestamp: 1400 },
    { txnId: "TXN023", sender: "S", receiver: "T", amount: 4000, timestamp: 1410 },

    // Normal noise
    { txnId: "TXN024", sender: "F", receiver: "J", amount: 1500, timestamp: 1500 },
    { txnId: "TXN025", sender: "J", receiver: "K", amount: 200, timestamp: 1510 },
    { txnId: "TXN026", sender: "K", receiver: "F", amount: 300, timestamp: 1520 },
    { txnId: "TXN027", sender: "L", receiver: "M", amount: 8000, timestamp: 1530 },
    { txnId: "TXN028", sender: "M", receiver: "N", amount: 100, timestamp: 1540 },
    { txnId: "TXN029", sender: "O", receiver: "P", amount: 5000, timestamp: 1550 },
    { txnId: "TXN030", sender: "P", receiver: "E", amount: 6000, timestamp: 1560 },
    
    // More normal noise
    { txnId: "TXN031", sender: "T", receiver: "A", amount: 500, timestamp: 1600 },
    { txnId: "TXN032", sender: "T", receiver: "B", amount: 550, timestamp: 1610 },
    { txnId: "TXN033", sender: "S", receiver: "A", amount: 400, timestamp: 1620 },
    { txnId: "TXN034", sender: "E", receiver: "H", amount: 800, timestamp: 1630 },
    { txnId: "TXN035", sender: "I", receiver: "L", amount: 1200, timestamp: 1640 },
    { txnId: "TXN036", sender: "N", receiver: "O", amount: 2200, timestamp: 1650 },
    { txnId: "TXN037", sender: "G", receiver: "C", amount: 300, timestamp: 1660 },
    { txnId: "TXN038", sender: "J", receiver: "D", amount: 400, timestamp: 1670 },
    { txnId: "TXN039", sender: "P", receiver: "I", amount: 900, timestamp: 1680 },
    { txnId: "TXN040", sender: "B", receiver: "D", amount: 1500, timestamp: 1690 },
    
    // Another short cycle
    { txnId: "TXN041", sender: "K", receiver: "L", amount: 800, timestamp: 1700 },
    { txnId: "TXN042", sender: "L", receiver: "K", amount: 800, timestamp: 1710 },

    // More propagation noise
    { txnId: "TXN043", sender: "T", receiver: "O", amount: 1000, timestamp: 1720 },
    { txnId: "TXN044", sender: "O", receiver: "A", amount: 900, timestamp: 1730 },
    { txnId: "TXN045", sender: "M", receiver: "T", amount: 500, timestamp: 1740 },
    { txnId: "TXN046", sender: "P", receiver: "M", amount: 600, timestamp: 1750 },
    { txnId: "TXN047", sender: "I", receiver: "P", amount: 700, timestamp: 1760 },
    { txnId: "TXN048", sender: "C", receiver: "S", amount: 800, timestamp: 1770 },
    { txnId: "TXN049", sender: "D", receiver: "C", amount: 900, timestamp: 1780 },
    { txnId: "TXN050", sender: "F", receiver: "D", amount: 1000, timestamp: 1790 }
].map(t => ({ ...t, isDefault: true }));
