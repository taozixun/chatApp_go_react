import axios from "axios";
import { useEffect,useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import checkToken from "../utils/checkToken";
import styles from "./style/oneOnOne.module.scss";
import { Alert,Button, Input ,Empty,message} from 'antd';
const OneOnOne=()=>{
    const [messageApi, contextHolder] = message.useMessage();
    const [sendList,setSendList]=useState([])
    const [recvList,setRecvList]=useState([])
    const [msg,setMsg]=useState('')
    const [ws,setWs]=useState(undefined)
    const navigate=useNavigate()
    //下三行获取query参数
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const friendId = queryParams.get('friend');
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
            //建立连接时同时传递自己的id和friend的id
            webs = new WebSocket(`ws://localhost:8888/ws?id=${localStorage.getItem('id')}&friendId=${friendId}`);
            webs.onopen = function () { 
                console.log("websocket连接成功")
                axios.get(`http://localhost:8081/friendMessage?userId=${localStorage.getItem('id')}&friendId=${friendId}`).then((res)=>{
                    if(res.data.msg!==undefined){
                        messageApi.open({
                            type: 'warning',
                            content: res.data.msg,
                          });
                        navigate('/')
                        return
                    }
                    setSendList(res.data.dataSend)
                    setRecvList(res.data.data)
                })
                setWs(webs)
            }
            webs.onerror=function(e){
                console.log(e)
            }
            webs.onmessage=(e)=>{
                let data=JSON.parse(e.data)
                console.log(data)
                console.log(data.fromWho===friendId)
                if(data.fromWho===friendId){//由于给user的消息都从这个通道来，要判断一下是否是当前聊天对象发来的消息
                    setRecvList((prevList) => [...prevList, data.msg]);
                }
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
                <h3>{localStorage.getItem("id")} 与 {friendId} 的聊天</h3>
                <div className={styles.bt}>
                    <Button onClick={handleClear}>清空消息</Button>
                    <Button onClick={()=>{
                        navigate('/friendList')
                    }}>返回</Button>
                </div>
            </div>
            <Alert message="发送/接收信息只保留5条" type="info" showIcon />
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
export default OneOnOne