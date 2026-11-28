import axios from "axios";

let api="http://127.0.0.1:3000/api/v1/auth/login"

async function loginreq(user:any) {
    try {
        let {data}=await axios.post(api,user)
        let token=data.access_token
        console.log(data);
        console.log(token);
          if(token){

        localStorage.setItem("token",token)
    }
    return token
    } catch (error) {
        console.error(error);
        
    }
}
export default loginreq