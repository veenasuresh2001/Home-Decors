import React, { useState } from 'react';
import axios from 'axios';
import '../components/Styles/AddProduct.css';

export default function AddProduct() {
    const [product, setProduct] = useState({
        productname: '',
        producttype: '',
        productprice: '',
        productstock:'',
        description: '',
        image: null,
    });

    const [preview, setPreview] = useState(null); // State to hold the image preview URL

    const handleChange = (name, value) => {
        if (name === 'image') {
            const file = value;
            setProduct({ ...product, image: file });

            // Generate image preview URL
            const previewURL = URL.createObjectURL(file);
            setPreview(previewURL);
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    const formData = new FormData();

    const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(); // Initialize FormData here

    formData.append('productname', product.productname);
    formData.append('producttype', product.producttype);
    formData.append('productprice', product.productprice);
    formData.append('productstock', product.productstock);
    formData.append('description', product.description);
    formData.append('image', product.image);

    axios.post('http://localhost:9000/product', formData)
        .then((res) => {
            alert(res.data);
        })
        .catch((err) => {
            console.error("Error adding product:", err);
            alert("Failed to add product");
        });
};

    return (
        <div className="add-product-container">
            <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
                <main className="main-content">
                    <h1>Add Product</h1>
                    <p>Here you can add products to your store.</p>
                    <div className="product-form">
                        <section className="product-details">
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    id="product-name"
                                    name="productname"
                                    placeholder="Enter Product Name Here"
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Product Type *</label>
                                <input
                                    type="text"
                                    id="product-type"
                                    name="producttype"
                                    placeholder="Enter Product Type Here"
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Product Price *</label>
                                <input
                                    type="text"
                                    id="product-price"
                                    name="productprice"
                                    placeholder="Enter Price"
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                            <label>Stock *</label>
                                <input
                                    type="number"
                                    id="product-price"
                                    name="productstock"
                                    placeholder="Enter Stock"
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description *</label>
                                <input
                                    type="textarea"
                                    id="description"
                                    name="description"
                                    placeholder="Enter Description"
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    required
                                />
                            </div>
                        </section>

                        <section className="product-image">
                            <h2>Product Image</h2>
                            <p>Here you can upload images of the product. You are allowed to upload 1 image at a time.</p>
                            <div className="image-upload">
                                <div className="image-preview">
                                    {preview ? (
                                        <img src={preview} alt="Preview" />
                                    ) : (
                                        <img src="placeholder-image.png" alt="No File Chosen" />
                                    )}
                                </div>
                                <input
    type="file"
    name="image"
    className="upload-image-btn"
    onChange={(e) => handleChange(e.target.name, e.target.files[0])}
    required
/>

                            </div>
                            <p className="note">
                                Note: Image can be uploaded in any dimension but we recommend you to upload an image with a dimension of 1024x1024 & its size must be less than 15MB.
                            </p>
                        </section>
                    </div>
                </main>
                <button type="submit" id="btn1">Add</button>
            </form>
        </div>
    );
}
