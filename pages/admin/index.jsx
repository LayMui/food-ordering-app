import styles from '../../styles/Admin.module.css'
import Image from "next/image";
import axios from 'axios';
import { useState } from 'react';

const Index = ({orders, products}) => {
 
     const [pizzaList, setPizzaList] = useState(products);
     const [orderList, setOrderList] = useState(orders);
     const status = ["preparing", "on the way", "delivered"];

     const handleStatus = async (id) => {
         const item = orderList.filter(order => order._id === id)[0]
         const currentStatus = item.status;
        try {
            const res = await axios.put(process.env.HOST + "/api/orders/" + id, {
                status: currentStatus+1,
        });
        setOrderList([
            res.data, 
            ...orderList.filter(order=> order._id !== id),
            
        ])
        } catch(err) {
            console.log(err)
        }
     }

    const handleDelete = async(id) => {
        try {
            const res = await axios.delete(process.env.HOST + "/api/products/"+id);
            setPizzaList(pizzaList.filter((pizza) => pizza._id !== id)) 
        } catch(err) {
            console.log(err)
        }
    }
    return (
        <div className={styles.container}>
        <div className={styles.item}>
        <h1 className={styles.title}>Products</h1>
        <table className={styles.table}>
            <tbody>
                <tr className={styles.trTitle}>
                    <td>Image</td>
                    <td>Id</td>
                    <td>Title</td>
                    <td>Price</td>
                    <td>Action</td>

                </tr>
            </tbody>
            { pizzaList.map(product => {

            <tbody key={product._id}>
          
     
                <tr className={styles.trTitle}>
                <td>
                  <Image
                  src={product.img}
                  width={50}
                  height={50}
                  objectFit="cover"
                  alt=""
                  />
                </td>
                    <td>{product._id.slice(0,5)}...</td>
                    <td>{product.title}</td>
                    <td>${product.prices[0]}</td>
                    <td>
                        <button className={styles.button}>Edit</button>
                        <button className={styles.button} onClick={()=> handleDelete(product._id)}>Delete</button>
                    </td>

                </tr>
           
            </tbody>
        })}
        </table>
        </div>

        <div className={styles.item}>
        <h1 className={styles.title}>Orders</h1>
        <table className={styles.table}>
            <tbody>
                <tr className={styles.trTitle}>
                    <td>Id</td>
                    <td>Customer</td>
                    <td>Total</td>
                    <td>Payment</td>
                    <td>Status</td>
                    <td>Action</td>

                </tr>
            </tbody>
            { orderList.map((order) =>  (
            <tbody key={order._id}>
                <tr className={styles.trTitle}>
                    <td>{order._id.slice(0,5)}...</td>
                    <td>{order.customer}</td>
                    <td>${order.total}</td>
                    <td>{order.method === 0 ? (<span>cash</span>) : (<span>paid</span>)}</td>
                    <td>{status[order.status]}</td>
                    <td>
                        <button onClick={()=> handleStatus(order._id)}>Next Stage</button>
                    </td>

                </tr>
            </tbody>
            ))}
        </table>
        
            </div>
    

    </div>
    )
}

export const getServerSideProps = async(ctx) => {
    const myCookie = ctx.req?.cookie || "";

    if(myCookie.token !== process.env.TOKEN) {
        return {
            redirect: {
                destination: "/admin/login",
                permanent: false,
            }
        }
    }
    const productRes = await axios.get(process.env.HOST + "/api/products");
    const orderRes = await axios.get(process.env.HOST + "/api/orders");

    return {
        props: {
            orders: orderRes.data,
            products: productRes.data,
        }
    }
}

export default Index;