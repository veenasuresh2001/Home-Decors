const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    confirm:String
},{timestamps:true})

const userModel=new mongoose.model("user_tbl",userSchema)

const productSchema=new mongoose.Schema({
    productname:{type:String},
    producttype:{type:String},
    productprice:{type:String},
    productstock:{type:Number},
    description:{type:String},
    image:{type:String}
    },{timestamps:true})

const productModel=new mongoose.model("product_tbl",productSchema)



const orderSchema = new mongoose.Schema({
    razorpay_order_id: { type: String, required: true },
    userId:{type:String},
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    receipt: { type: String, required: true },
    
    productid:{type:String},
    username:{type:String},
    quantity:{type:String},
    prodname:{type:String},
    image:{type:String},
    status: { type: String, default: 'created' } // 'created', 'paid', 'failed'
  }, { timestamps: true });
  
  const orderModel = mongoose.model('Order', orderSchema);

  const paymentSchema = new mongoose.Schema({
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    status: { type: String, default: 'pending' } // 'pending', 'completed', 'failed'
  }, { timestamps: true });
  
  const paymentModel = mongoose.model('Payment', paymentSchema);

  const cartSchema=new mongoose.Schema({
    userId:{type:String},
    productId: {type:String},  
    prodname: {type:String},
    prodamount:{type:String},
    prodquantity: {type:Number},  
    proddesc:{type:String},
    image:{type:String},
},{timestamps:true})

const cartModel=mongoose.model('cart',cartSchema)
module.exports={userModel,productModel,orderModel,paymentModel,cartModel}

