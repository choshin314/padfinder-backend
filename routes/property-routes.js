const express = require('express');
const router = express.Router();

const verifyAuth = require('../middleware/authorization');
const listInBulk = require('../controllers/misc-controllers');
const {
    sendListingInquiry,
    getNearby,
    createListing,
    updateListing,
    deleteListing,
    getPropertyList,
    addFavorite,
    removeFavorite
} = require('../controllers/property-controllers');


//-------------------UNPROTECTED ROUTES (Auth not required)---------------------//

router.post('/inquiry', sendListingInquiry);

router.get('/nearby', getNearby);

//--------------------PROTECTED ROUTES (Auth required for routes below)-----------//
router.use(verifyAuth);

router.post('/new', createListing);

router.patch('/update/:propertyId', updateListing);

router.delete('/delete/:id', deleteListing);

router.get('/list/:listName/:userId', getPropertyList);

router.patch('/favorites/:userId/add/:propertyId', addFavorite);

router.patch('/favorites/:userId/remove/:propertyId', removeFavorite);

router.post('/bulklistings', listInBulk);

module.exports = router;

