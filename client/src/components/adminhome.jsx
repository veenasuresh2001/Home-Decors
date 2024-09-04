import AddProduct from "./addproduct";
import Adminnav from "./adminnav";
import { Route, Routes } from "react-router-dom";
import ProductView from "./adminview";
import Editproduct from "./editproduct";
import Report from "./report";
import Allorders from "./adminvieworders";
import Admindesign from "./admindesign";

export default function Adminhome() {
    return (
        <>
            <Adminnav/>
            <Routes>
                <Route path="/" element={<Admindesign/>}></Route> {/* Adding a default route */}
                <Route path="/addproduct" element={<AddProduct/>}></Route>
                <Route path="/viewproduct" element={<ProductView/>}></Route>
                <Route path='/edittask/:id' element={<Editproduct/>}/>
                <Route path='/report' element={<Report/>}/>
                <Route path='/allorders' element={<Allorders/>}/>
            </Routes>
        </>
    );
}
