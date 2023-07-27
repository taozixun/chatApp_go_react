import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./style/register.module.scss";
import { Button, Input ,message} from 'antd';
function Regist() {
  const [messageApi, contextHolder] = message.useMessage();
  const [id,setId]=useState('')
  const [psw,setPsw]=useState('')
  const [confirmPsw,setConfirmPsw]=useState('')
  const navigate=useNavigate()
  const handleCreate=()=>{
    if(id===""||psw===""){
      messageApi.open({
        type: 'warning',
        content: '账号密码不能为空！',
      });
      return
    }
    if(psw!==confirmPsw){
      messageApi.open({
        type: 'warning',
        content: '两次密码不一致！',
      });
      return
    }
    const formData=new FormData()//直接在axios里用大括号传是json的，不是formdata
    formData.append('id',id)
    formData.append('psw',psw)
    axios.post(`http://localhost:8081/createUser`,formData).then((res)=>{
      console.log(res.data.data)
      if(res.data.data===undefined){
        messageApi.open({
          type: 'warning',
          content: '用户已存在，请勿重复注册！',
        });
        return
      }
      navigate('/')

    })
  }
  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.eachLine}>
        <div>设置帐号：</div>
        <Input placeholder="请输入账号" allowClear onBlur={(e)=>{
          setId(e.target.value)
        }} />
      </div>
      <div className={styles.eachLine}>
        <div>设置密码：</div>
        <Input.Password placeholder="请输入密码" onBlur={(e)=>{
          setPsw(e.target.value)
        }}/>
      </div>
      <div className={styles.eachLine}>
        <div>确认密码：</div>
        <Input.Password placeholder="请确认密码" onBlur={(e)=>{
          setConfirmPsw(e.target.value)
        }}/>
      </div>
      <div className={styles.bt}>
        <Button type="primary" onClick={handleCreate}>创建用户</Button>
        <Button type="dashed" onClick={()=>{
          navigate('/')
        }}>返回</Button>
      </div>
    </div>
  );
}

export default Regist;
