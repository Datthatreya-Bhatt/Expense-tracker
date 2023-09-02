const express = require('express');

const auth = require('../middleware/auth');
const premium = require('../controller/premium');

const router = express.Router();

//to get premium html page
router.get('/premium',premium.getPremiumPage);


//to get leaderboard data
router.get('/user/premium/leaderboard/:page/pagelimit',auth.auth,premium.getLeaderBoard);
//to get leaderboard html page
router.get('/premium/leaderboardpage',premium.getLeaderboardPage);


//to download expense file
router.get('/download',auth.auth,premium.downloadExpense);


//to get downloaded file data
router.get('/download/list/:page/pagelimit',auth.auth,premium.downloadList);
//to get downloaded file html page
router.get('/premium/downloadlistpage',premium.getDownloadedListPage);

module.exports = router;