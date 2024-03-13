var express = require('express');
const customerModel = require('../model/customerModel');
var router = express.Router();

const multer = require('multer');
const store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    }, 
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.jpg`);
    }
});
const upload = multer({storage: store});

/* GET home page. */
router.get('/', async function(req, res, next) {
    let customer = await customerModel.find();
    res.render('customer/index', { customers: customer });
});

// Create route get
router.get('/create', async function(req, res, next) {
    res.render('customer/create');
});

// Create route post
router.post('/createPost', upload.single('image'), async function(req, res, next) {
    let file = req.file;

    let cust = new customerModel({
        // _id: req.body.id;
        fullname: req.body.fullname, 
        email: req.body.email,
        password: req.body.password,
        image: file.filename
    });
    await cust.save();
    // const data = req.body;
    // await customerModel.create(data);
    res.redirect('/customer');
});

// Delete route get
router.get('/delete/:id', async function(req, res, next) {
    await customerModel.deleteOne({_id: req.params.id});
    res.redirect('/customer');
});

//update route get
router.get('/update/:id', async function(req, res, next) {
    var data = await customerModel.findById({_id: req.params.id});
    res.render("customer/update", {data});
});

//update route post
// router.post('/updatePost/:id', async function(req, res, next) {
//     const data = req.body;
//     const filename = req.file.filename
//     await customerModel.findByIdAndUpdate(req.params.id, req.body);
//     res.redirect('/customer');
// });

router.post('/updatePost/:id', upload.single('image'), async function(req, res, next) {
    let file = req.file;
    const body = req.body;
    if (!file) {    
        await customerModel.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/customer');
    }
    else {
        let cust = new customerModel({
            _id: body.id,
            fullname: body.fullname, 
            email: body.email,
            password: body.password,
            image: file.filename
        });
        await customerModel.findByIdAndUpdate(req.body.id, cust);
        res.redirect('/customer');
    }
    
});

module.exports = router;
