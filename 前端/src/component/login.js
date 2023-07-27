import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input ,message} from 'antd';
import styles from "./style/login.module.scss"
function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const [id,setId]=useState('')
  const [psw,setPsw]=useState('')
  const navigate=useNavigate()
  const handleLogin=()=>{
    if(id===""||psw===""){
      messageApi.open({
        type: 'warning',
        content: '账号密码不能为空！',
      });
      return
    }
    axios.get(`http://localhost:8081/login?id=${id}&psw=${psw}`).then((res)=>{
      console.log(res.data)  
    if(res.data.data!==undefined){
        localStorage.setItem('token',res.data.data.Token)
        localStorage.setItem('id',res.data.data.Id)
        // setTimeout(()=>{//测试token过期后再跳转
        //   navigate('/chat')
        // },30000)
        navigate('/friendList')
      }else{
        messageApi.open({
          type: 'warning',
          content: res.data.msg,
        });
      }
    })
  }
  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.eachLine}>
        <div>帐号：</div>
        <Input placeholder="请输入账号" allowClear onBlur={(e)=>{
          setId(e.target.value)
        }} />
      </div>
      <div className={styles.eachLine}>
      <div>密码：</div>
        <Input.Password placeholder="请输入密码" onBlur={(e)=>{
          setPsw(e.target.value)
        }}/>
      </div>
      <div className={styles.bt}>
        <Button type="primary" onClick={handleLogin}>登录</Button>
        <Button type="dashed" onClick={()=>{
          navigate('/regist')
        }}>注册</Button>
      </div>
    </div>
  );
}

export default Login;
