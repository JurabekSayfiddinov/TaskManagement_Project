import axios from "axios";
let api="http://127.0.0.1:3000/api/v1/auth/me"
let getme=async()=>{
    try {
        let {data}=await axios.get(api,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})
        return data
    } catch (error) {
        console.error(error);
        
    }
}
export default getme