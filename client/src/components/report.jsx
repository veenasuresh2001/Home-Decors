import React, { useState } from 'react';
import AXIOS from 'axios';
import './report.css';

function Report() {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [showCustomersTable, setShowCustomersTable] = useState(false); // State to control the display of the customers table
    const [showProductsTable, setShowProductsTable] = useState(false); // State to control the display of the products table

    const fetchMostBoughtCustomers = async () => {
        try {
            const response = await AXIOS.get('http://localhost:9000/mostcustomer');
           
            setCustomers(response.data); // Set the fetched customers array
            setShowCustomersTable(true); // Show the customers table after fetching data
            setShowProductsTable(false); // Hide the products table
        } catch (error) {
            console.error('Error fetching most bought customers:', error);
        }
    };

    const fetchMostBoughtProducts = async () => {
        try {
            const response1 = await AXIOS.get('http://localhost:9000/mostproducts');
            console.log('Products data:', response1.data);
            setProducts(response1.data); // Set the fetched products array
            setShowProductsTable(true); // Show the products table after fetching data
            setShowCustomersTable(false); // Hide the customers table
        } catch (error) {
            console.error('Error fetching most bought products:', error);
        }
    };

    return (
        <>
            <div id="reportcontainer">
                <h2>
                    <button onClick={fetchMostBoughtCustomers}>Most Purchased Customer</button>
                    <button onClick={fetchMostBoughtProducts}>Most Purchased Product</button>
                </h2>
            </div>

            {showCustomersTable && ( // Conditionally render the customers table if showCustomersTable is true
                <div>
                    <h2>Most Bought Customers</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Total Purchases</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer._id}>
                                    <td>{customer.firstname}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.totalOrders}</td>
                                   
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
            )}

            {showProductsTable && ( // Conditionally render the products table if showProductsTable is true
                <div>
                    <h2>Most Bought Products</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Total Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product.prodname}</td> 
                                    <td>{product.totalQuantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default Report;
