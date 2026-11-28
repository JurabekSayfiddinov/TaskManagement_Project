import axios from "axios";
let api="http://127.0.0.1:3000/api/v1/auth/register"
let registeruser=async(user:any)=>{
    try {
        await axios.post(api,user)
    } catch (error) {
        console.error(error);
        
    }
}
export default registeruser