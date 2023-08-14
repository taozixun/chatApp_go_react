import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import checkToken from "../utils/checkToken";
import styles from "./style/aboutFriend.module.scss";
import { Button, Input ,message,Radio,Empty } from 'antd';
const AboutFriend=()=>{
    const [messageApi, contextHolder] = message.useMessage();
    const navigate=useNavigate();
    const [gender,setGender]=useState(undefined);
    const [desc,setDesc]=useState(undefined);
    const [phone,setPhone]=useState(undefined);
    const [luckyNum,setLuckyNum]=useState(undefined);
    const [userName,setUserName]=useState("");
    const [ok,setOk]=useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const friendId = queryParams.get('friend');
    useEffect(()=>{
        checkToken().then((res)=>{
            if(!res){
                messageApi.open({
                    type: 'warning',
                    content: 'token已失效，请重新登陆',
                  });
                  setTimeout(()=>{
                    navigate('/')
                  },2000)
                return
            }
            axios.get(`http://localhost:8081/userDetail?userId=${friendId}`).then((res)=>{
                console.log(res.data)
                if(res.data.msg===undefined){
                    //设置过detail
                    setGender(res.data.data.Gender)
                    setDesc(res.data.data.Desc)
                    setPhone(res.data.data.Phone)
                    setLuckyNum(res.data.data.ID)
                    setUserName(res.data.data.UserId)
                }
                setOk(true)//不然defaultvalue不展示
            })
        })
    },[])
    return(
        <div className={styles.container}>
            {contextHolder}
            <Button onClick={()=>{
                navigate('/friendList')
            }}>返回</Button>
            <div className={styles.body}>
                {userName!==""?(
                <>
                    <div>user_id：{userName}</div>
                    <br/>
                    <div>幸运数字：{luckyNum!==undefined?luckyNum:"填写个人信息获取幸运数字"}</div>
                    <br/>
                    <div>
                        性别：
                        <Radio.Group value={gender} disabled>
                            <Radio value={true}>男</Radio>
                            <Radio value={false}>女</Radio>
                            <Radio value={3}>沃尔玛购物袋</Radio>
                        </Radio.Group>
                    </div>
                    <br/>
                    <div className={styles.eachLine}>
                        <div>个性签名：</div>
                        {ok&&(<div style={{width:'100%'}}>{desc}</div>)}
                    </div>
                    <br/>
                    <div className={styles.eachLine}>
                        <div>电话号码：</div>
                        {ok&&<Input defaultValue={phone}  disabled>
                        </Input>}
                    </div>
                </>):( <Empty description={null} />)}
                
            </div>
        </div>
    )
}

export default AboutFriend;