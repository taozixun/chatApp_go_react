import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import checkToken from "../utils/checkToken"
import styles from "./style/chat.module.scss";
import { Button, Input ,Empty,message} from 'antd';
const Chat=()=>{
    const [messageApi, contextHolder] = message.useMessage();
    const [sendList,setSendList]=useState([])
    const [recvList,setRecvList]=useState([])
    const [msg,setMsg]=useState('')
    const [ws,setWs]=useState(undefined)
    const navigate=useNavigate()
    const handleInput=(e)=>{
        if(e.target.value!==''){
            setMsg(e.target.value)
        }
    }
    const handleClear=()=>{
        setSendList([]);
        setRecvList([]);
    }
    const handleSend=()=>{
        if(msg===''){
            messageApi.open({
                type: 'warning',
                content: "消息不能为空",
              });
            return
        }
        ws.send(msg);
        setSendList([...sendList,msg])
        setMsg('')
    }
    useEffect(()=>{
        var webs 
        checkToken().then((res)=>{
            if(!res){
                messageApi.open({
                    type: 'warning',
                    content: "token已失效，请重新登陆",
                  });
                  setTimeout(()=>{
                    navigate('/')
                  },2000)
                return
            }        
            //建立连接时传递自己的id
            webs = new WebSocket(`ws://localhost:8888/ws?id=${localStorage.getItem('id')}`);
            webs.onopen = function () { 
                console.log("websocket连接成功")
                setWs(webs)
            }
            webs.onerror=function(e){
                console.log(e)
            }
            webs.onmessage=(e)=>{
                setRecvList((prevList) => [...prevList, e.data]);
            }
        })
        return ()=>{
            webs&&webs.close()
        }
    },[])
    return(
        <div className={styles.container}>
            {contextHolder}
            <div className={styles.header}>
                <h3>欢迎 {localStorage.getItem("id")} 进入在线交流大厅</h3>
                <div className={styles.bt}>
                    <Button onClick={handleClear}>清空消息</Button>
                    <Button onClick={()=>{
                        navigate('/friendList')
                    }}>返回</Button>
                </div>
            </div>
            
            <div className={styles.eachLine}>
                <Input placeholder="请输入消息内容" value={msg} onChange={handleInput}></Input>
                <Button type="primary" onClick={handleSend}>发送</Button>
            </div>
            <div className={styles.block}>
                <div className={styles.tag}>send:</div>
                {
                    sendList.map((item,index)=>{
                        return(
                            <div className={styles.eachMsgSend} key={index}>{item}</div>
                        )
                    })
                }
                {
                   sendList.length===0&&<Empty description={null} style={{marginTop:'40px'}}/>
                }
            </div>
            <div className={styles.block}>
                <div className={styles.tag}>recv:</div>
                {
                    recvList.map((item,index)=>{
                        return(
                            <div className={styles.eachMsgRecv} key={index}>{item}</div>
                        )
                    })
                }
                {
                   recvList.length===0&&<Empty description={null} style={{marginTop:'40px'}}/>
                }
            </div>
        </div>
        
    )
}
export default Chat