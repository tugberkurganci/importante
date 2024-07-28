import axios from "axios";
import { loadToken, storeToken } from "../store/storage";



const http2 = axios.create({
  baseURL: "https://node-mkag.onrender.com",
});



export default http2;