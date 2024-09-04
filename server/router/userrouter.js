const express=require('express')
const multer=require('multer')
const path = require('path');
const storage=multer.diskStorage({
    destination:function(req,file,cd){
        cd(null,'uploads/')
    },
    filename:function(req,file,cd){
        cd(null,file.originalname)
    }
})
const upload=multer({storage:storage})
const router=express.Router()

const {register, login, addProduct, productview
    ,viewbuy,createOrder,verifyPayment,myorders,addCart,viewCart
    ,deletecart,createcartOrder,verifyPayment1,viewbuy1,deleteproduct
,FindbyId,updateProduct,Mostcustomer,MostPurchasedProducts,allorders}=require('../control/userCtrl')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/product').post(upload.single('image'), addProduct);
router.route('/productview').get(productview)
router.route('/fetchbuyaddr/:pid').get(viewbuy)
router.route('/fetchbuyaddr1/:pid').get(viewbuy1)
router.route('/verifyPayment').post(verifyPayment);
router.route('/createOrder').post(createOrder);
router.route('/myorders/:uid').get(myorders);
router.route('/addtocart/:pid/:uid').post(addCart)
router.route('/cart/:userId').get(viewCart)
router.route('/deletecart/:productId').delete(deletecart)
router.route('/createcartOrder').post(createcartOrder);
    
router.route('/verifyPayment1').post(verifyPayment1);
router.route('/deleteproduct/:productId').delete(deleteproduct)
router.route("/findbyid/:id").get(FindbyId)
router.route("/updateproduct/:id").post(updateProduct)
router.route('/mostcustomer').get(Mostcustomer)
router.route('/mostproducts').get(MostPurchasedProducts)
router.route('/allorders').get(allorders);
module.exports=router