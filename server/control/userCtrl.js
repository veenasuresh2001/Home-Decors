const main=require('../model/database')
main().catch(err=>console.log(err))
const {userModel,productModel,orderModel,paymentModel,cartModel}=require('../model/userModel')
const bcrypt=require('bcrypt')
const salt=10;
const Razorpay=require('razorpay')
const dotenv = require('dotenv');
const crypto=require('crypto');
const { pid } = require('process');
dotenv.config();
const razorpayInstance = new Razorpay({
    key_id: "rzp_test_ZZ7QC9vKOxo773", 
    key_secret: "mPIOUHrF7rOucCi7koQGz38p"

  });

  const createOrder = async (req, res) => {
    const { userId, amount, currency, receipt, notes, productid, newStock,username,quantity,prodname,image } = req.body;
    
    try {
      // Ensure product stock update is completed before creating the order
     
      const options = {
        amount: amount * 100, // Convert amount to paise
        currency: currency,
        receipt: receipt,
        notes: notes,
      };
      
      const order = await razorpayInstance.orders.create(options);
      
      // Save the order to the database
      const newOrder = new orderModel({
        razorpay_order_id: order.id,
        userId: userId,
        amount: order.amount / 100, // Convert paise back to INR
        currency: order.currency,
        receipt: order.receipt,
        productid,
        username,
        quantity,
        prodname,
        image,
        status: 'payment pending' // Changed status to 'payment pending'
      });
      
      await newOrder.save();
      
      res.json(order);
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ error: "Server error, unable to create order" });
    }
  };
  
  const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature ,productid,newStock} = req.body;
    console.log("````````",newStock)
    console.log("````````",productid)
    try {
      await productModel.findByIdAndUpdate(productid, { productstock: newStock });
      await cartModel.updateMany({productId:productid}, { prodquantity: newStock });
      // Use your actual Razorpay secret key
      const secret = "mPIOUHrF7rOucCi7koQGz38p";
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generated_signature = hmac.digest('hex');
      
      if (generated_signature === razorpay_signature) {
        // Save payment details and update the order status
        await paymentModel.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status: 'completed'
        });
        
        await orderModel.updateOne(
          { razorpay_order_id },
          { status: 'paid' }
        );
        
        return res.json({ status: "success", message: "Payment verified successfully" });
      } else {
        return res.status(400).json({ status: "failure", message: "Payment verification failed" });
      }
    } catch (error) {
      console.error("Error during payment verification:", error);
      return res.status(500).json({ status: "error", message: "Server error during payment verification" });
    }
  };
  
  const createcartOrder = async (req, res) => {
    const { userId, amount, currency, receipt, notes, idd, username, quantity, prodname } = req.body;
    console.log(idd);

    try {
        // Optionally update product stock here if needed, or ensure it's done after payment is confirmed

        const options = {
            amount: amount * 100, // Convert amount to paise
            currency: currency,
            receipt: receipt,
            notes: notes,
        };

        // Create Razorpay order
        const order = await razorpayInstance.orders.create(options);

        // Save the order to the database with status 'payment pending'
        const newOrder = new orderModel({
            razorpay_order_id: order.id,
            userId: userId,
            amount: order.amount / 100, // Convert paise back to INR
            currency: order.currency,
            receipt: order.receipt,
            productid: idd,
            username,
            quantity,
            prodname,
            status: 'payment pending', // Set initial status to 'payment pending'
        });

        await newOrder.save();

        res.json(order); // Return the Razorpay order details to the frontend
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Server error, unable to create order" });
    }
};

  const verifyPayment1 = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature ,productId,idd,newquantity} = req.body;
    console.log("````````",newquantity)
    console.log("````````",idd)
    try {
      await productModel.findByIdAndUpdate(idd, { productstock: newquantity });
      await cartModel.deleteOne({ _id: productId });
      await cartModel.updateMany({productId:idd},{prodquantity:newquantity})

      const secret = "mPIOUHrF7rOucCi7koQGz38p";
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generated_signature = hmac.digest('hex');
      
     
      
      if (generated_signature === razorpay_signature) {
        // Save payment details and update the order status
        await paymentModel.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status: 'completed'
        });
        
        await orderModel.updateOne(
          { razorpay_order_id },
          { status: 'paid' }
        );
        
        return res.json({ status: "success", message: "Payment verified successfully" });
      } else {
        return res.status(400).json({ status: "failure", message: "Payment verification failed" });
      }
    } catch (error) {
      console.error("Error during payment verification:", error);
      return res.status(500).json({ status: "error", message: "Server error during payment verification" });
    }
  };
  
  

const register=async(req,res)=>{
    const {firstname,lastname,email,password,confirm}=req.body
    const record=await userModel.find({email:email})
    if(record.length>0){
        res.json("Email already exists")
        res.end()
    }
    else if(password!=confirm){
        res.json("Wrong password")
    }
    else{
        bcrypt.hash(password,salt,function(err,hashpassword){
            const user=new userModel({
                firstname,lastname,email,password:hashpassword,confirm:hashpassword
            })
            user.save()
            res.json("Registered!")
        })
    }  
}

const login=async(req,res)=>{
    const {email,password}=req.body
    const record=await userModel.find({email:email})
    if(record.length>0){
        const hashpassword=record[0].password
        bcrypt.compare(password,hashpassword,function(err,result){
            if(err){
                res.json("Error")
            }
            else if(result){
                res.json({status:1,
                    msg:"Logged in!",
                    userid:record[0]._id,
                    username:record[0].firstname,
                    lastname:record[0].lastname,
                    email:record[0].email
                })
            }
            else{
                res.json({status:0,msg:"Wrong password!"})
            }

        })
    }
}

const addProduct = async (req, res) => {
    
    try {
        // Check if the file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const product = await productModel.create({
            productname: req.body.productname,
            producttype: req.body.producttype,
            productprice: req.body.productprice,
            productstock: req.body.productstock,
            description: req.body.description,
            image: req.file.filename, // Use req.file.filename safely
        });

        console.log("Product added:", product);
        res.json("Product added!");
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json("Failed to add product");
    }
};
const productview=async(req,res)=>{
    
    const record=await productModel.find()
    if(record.length>0){
        res.json(record)
    }
}

//to view for buy
const viewbuy= async (req, res) => {
    const pID = req.params.pid;
    
    try {
        const record = await cartModel.findById(pID); 
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

const viewbuy1= async (req, res) => {
  const pID = req.params.pid;
  
  try {
      const record = await productModel.findById(pID); 
      if (record) {
          res.json(record);
      } else {
          res.status(404).json({ message: 'Product not found' });
      }
  } catch (err) {
      console.error("Error fetching product:", err);
      res.status(500).json({ message: 'Server error' });
  }
};
const myorders = async (req, res) => {
    const uid = req.params.uid;
    try {
      const record = await orderModel.find({ userId: uid, status: "paid" });
      if (record.length > 0) {
        res.json(record);
      } else {
        res.status(404).json({ message: 'No paid orders found' });
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      res.status(500).json({ message: 'Server error' });
    }
  };


  const allorders = async (req, res) => {
    const uid = req.params.uid;
    try {
      const record = await orderModel.find({  });
      if (record.length > 0) {
        res.json(record);
      } else {
        res.status(404).json({ message: 'No paid orders found' });
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const addCart = async (req, res) => {
    try {
        const { pid: productId, uid: userId } = req.params;
  
        // Check if the product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
  
        // Check if the product is already in the user's cart
        const existingCartItem = await cartModel.findOne({ userId, productId });
        if (existingCartItem) {
            return res.status(400).json({ error: "Product already in the cart" });
        }
  
        // If not, add the product to the cart
        const { productname, productprice, productstock, description, image } = product;
        await cartModel.create({
            userId,
            productId,
            prodname:productname,
            prodamount:productprice,
            prodquantity:productstock,
            proddesc:description,
            image
        });
  
        res.status(200).json({ message: "Cart added successfully" });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: "Server error, unable to add to cart" });
    }
  };
  

  const viewCart=async(req,res)=>{
   
    const record=await cartModel.find({userId:req.params.userId})
    if(record.length>0){
        res.json(record)
    }
}

const deletecart = async (req, res) => {
    const cartid = req.params.productId;
    try {
        await cartModel.deleteOne({ _id: cartid });
        res.json("Deleted from cart");
    } catch (err) {
        console.error("Error deleting from cart:", err);
        res.status(500).json("Failed to delete from cart");
    }
    res.end();
}


//admin dekete prd

const deleteproduct = async (req, res) => {
  const pid = req.params.productId;
  try {
      await productModel.deleteOne({ _id: pid });
      await cartModel.deleteMany({productId:pid});
      res.json("Product Deleted");
  } catch (err) {
      console.error("Error deleting :", err);
      res.status(500).json("Failed to delete ");
  }
  res.end();
}

//edit
const FindbyId=async(req,res)=>{
  const idn=req.params.id;
  
  
  await productModel.find({_id:idn}).then(data => {
      res.json(data);
  })
}

//ipdate product

const updateProduct = async (req, res) => {
  const pid = req.params.id;
  const { productname, price, stock, description } = req.body;

  try {
    await cartModel.updateMany({productId:pid},{prodquantity:stock},{prodname:productname},{prodamount:price},{proddesc:description})
      const result = await productModel.updateOne(
          { _id: pid },
          { 
              productname, 
              productprice: price, 
              productstock: stock, 
              description
          }
      );
      if (result.modifiedCount > 0) {
          res.json("Product Updated");
      } else {
          res.status(404).json("Product Not Found or No Changes Made");
      }
  } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json("Error updating product");
  }
};

const Mostcustomer = async (req, res) => {
  try {
    
    const topCustomers = await orderModel.aggregate([
      { $match: { status: 'paid' } }, 
      { $group: {
        _id: "$userId", 
        totalOrders: { $sum: 1 } 
      }},
      { $sort: { totalOrders: -1 } }, 
      { $limit: 3 } 
    ]);

    if (topCustomers.length > 0) {
 
      const customerDetails = await Promise.all(topCustomers.map(async customer => {
        const details = await userModel.findById(customer._id).lean();
        return { ...details, totalOrders: customer.totalOrders };
      }));

      res.json(customerDetails);
    } else {
      res.json({ message: 'No paid orders found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the customers with most orders' });
  }
};
;

const MostPurchasedProducts = async (req, res) => {
  try {
    const topProducts = await orderModel.aggregate([
      { $match: { status: 'paid' } }, // Only include orders with status 'paid'
      { $group: {
        _id: "$productid", // Group by productid
        totalQuantity: { $sum: { $toInt: "$quantity" } }, // Sum the quantity of each product
        prodname: { $first: "$prodname" } // Capture the product name
      }},
      { $sort: { totalQuantity: -1 } }, // Sort by totalQuantity in descending order
      { $limit: 3 } // Limit to the top 3 products
    ]);

    if (topProducts.length > 0) {
      res.json(topProducts);
    } else {
      res.json({ message: 'No paid orders found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the most purchased products' });
  }
};






module.exports={
    register,
    login,
    addProduct,
    productview,
    viewbuy,
    createOrder,verifyPayment,myorders,addCart,viewCart
    ,deletecart,createcartOrder,verifyPayment1,viewbuy1
    ,deleteproduct,FindbyId,updateProduct,Mostcustomer,MostPurchasedProducts,allorders
}