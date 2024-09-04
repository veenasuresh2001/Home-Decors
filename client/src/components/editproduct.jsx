import React, { useState,useEffect,useRef } from 'react';
import { useParams } from 'react-router-dom';
import './editproduct.css';
import AXIOS from 'axios'

function Editproduct() {
    const [update,setUpdate]=useState({})
    const params=useParams();
    const useReference=useRef({})



    useEffect(()=>{
        const url=`http://localhost:9000/findbyid/${params.id}`
        AXIOS.get(url).then((res)=>{
            const record=res.data[0];
            setUpdate(record)
            useReference.current['productname'].value=record.productname;
            useReference.current['price'].value=record.productprice;
            useReference.current['stock'].value=record.productstock;
            useReference.current['description'].value=record.description;
            useReference.current['type'].value=record.producttype;

           
           
           
        })
    },[])

    const handleChange=(e)=>{
       
        setUpdate({...update,[e.target.name]:e.target.value})
    }   
    const handleSubmit=(e)=>{
        e.preventDefault();
        const url=`http://localhost:9000/updateproduct/${params.id}`
    
       
 
        AXIOS.post(url,update).then((res)=>{
             alert(res.data)
             })
    }
  
  return (
    <div className="form-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} ref={useReference}>
        <div className="form-group">
          <label htmlFor="productname">Product Name</label>
          <input
            type="text"
            id="productname"
            name="productname"
           
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
           
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
           
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
           
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <input
            type="text"
            id="type"
            name="type"
          
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="edit-button">
         Update Product
        </button>
      </form>
    </div>
  );
}

export default Editproduct;
