import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkToken from "../utils/checkToken";
import styles from "./style/aboutMe.module.scss";
import { Button, Input ,message,Radio } from 'antd';
const AboutMe=()=>{
    const { TextArea } = Input;
    const [messageApi, contextHolder] = message.useMessage();
    const navigate=useNavigate();
    const [gender,setGender]=useState(undefined);
    const [desc,setDesc]=useState(undefined);
    const [phone,setPhone]=useState(undefined);
    const [luckyNum,setLuckyNum]=useState(undefined);
    const [ok,setOk]=useState(false);
    const handleChangeDetail=()=>{
        if(gender===3){
            messageApi.open({
                type: 'error',
                content: '沃尔玛购物袋滚出中国！',
              });
            return
        }
        if(!/^\d+$/.test(phone)){//检测字符串是否仅有数字组成
            messageApi.open({
                type: 'warning',
                content: '电话号码仅支持数字',
              });
            return
        }
        axios.post("http://localhost:8081/setUserDetail",{
            "Phone":phone,
            "Gender":gender,
            "UserId":localStorage.getItem("id"),
            "Desc":desc,
        }).then((res)=>{
            if(res.data.msg==="创建成功"){
                messageApi.open({
                    type: 'success',
                    content: '操作成功',
                  });
                axios.get(`http://localhost:8081/userDetail?userId=${localStorage.getItem("id")}`).then((res)=>{
                console.log(res.data)
                if(res.data.msg===undefined){
                    //设置过detail
                    setGender(res.data.data.Gender)
                    setDesc(res.data.data.Desc)
                    setPhone(res.data.data.Phone)
                    setLuckyNum(res.data.data.ID)
                    return
                }
            })
            }else{
                messageApi.open({
                    type: 'warning',
                    content: res.data.msg,
                  });
            }
        })
    }
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
            axios.get(`http://localhost:8081/userDetail?userId=${localStorage.getItem("id")}`).then((res)=>{
                console.log(res.data)
                if(res.data.msg===undefined){
                    //设置过detail
                    setGender(res.data.data.Gender)
                    setDesc(res.data.data.Desc)
                    setPhone(res.data.data.Phone)
                    setLuckyNum(res.data.data.ID)
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
                <div>user_id：{localStorage.getItem("id")}</div>
                <br/>
                <div>幸运数字：{luckyNum!==undefined?luckyNum:"填写个人信息获取幸运数字"}</div>
                <br/>
                <div>
                    性别：
                    <Radio.Group onChange={(e)=>{
                        console.log(e.target.value)
                        setGender(e.target.value)
                    }} value={gender}>
                        <Radio value={true}>男</Radio>
                        <Radio value={false}>女</Radio>
                        <Radio value={3}>沃尔玛购物袋</Radio>
                    </Radio.Group>
                </div>
                    {/* <input defaultValue={gender} onBlur={(e)=>{
                    console.log(e.target.value)
                    setGender(e.target.value)
                }}></input><span>true代表男，false代表女</span></div> */}
                <br/>
                <div className={styles.eachLine}>
                    <div>个性签名：</div>
                    {ok&&(<TextArea
                        defaultValue={desc} onBlur={(e)=>{
                            console.log(e.target.value)
                            setDesc(e.target.value)
                        }}
                        placeholder="请输入个性签名"
                        autoSize={{ minRows: 2, maxRows: 8 }}
                    />)}
                </div>
                <br/>
                <div className={styles.eachLine}>
                    <div>电话号码：</div>
                    {ok&&<Input defaultValue={phone}  placeholder="请输入电话号码" onBlur={(e)=>{
                            console.log(e.target.value)
                            setPhone(e.target.value)
                        }}>
                    </Input>}
                </div>
            </div>
            <Button type="primary" onClick={handleChangeDetail}>提交修改</Button>
        </div>
    )
}

export default AboutMe;