import axios from "axios"

const checkToken=()=>{
    return new Promise((resolve)=>{
        let token=localStorage.getItem('token')
        if(token===null){
            resolve(false)
        }
        axios.get(`http://localhost:8081/checkToken?token=${token}`).then((res)=>{
            if(res.data.msg==="token解析失败"){
                resolve(false)
            }
            resolve(true)
        })
    })
    
}

export default checkToken