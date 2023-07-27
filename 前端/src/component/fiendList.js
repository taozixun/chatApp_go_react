import axios from "axios"
import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
import checkToken from "../utils/checkToken"
import styles from "./style/friendList.module.scss";
import { Button, Input ,message,Empty } from 'antd';
const FriendList=()=>{
    const [messageApi, contextHolder] = message.useMessage();
    const [friendList,setFriendList]=useState([])
    const [friendName,setFriendName]=useState('')
    const [refreshFlag,setRefreshFlag]=useState(1)
    const navigate=useNavigate()
    const handleAddFriend=()=>{
        if(friendName===''){
            messageApi.open({
                type: 'warning',
                content: '请输入用户名！',
              });
            return
        }
        let formData=new FormData()
        formData.append("userId",localStorage.getItem("id"))
        formData.append("friendId",friendName)
        axios.post(`http://localhost:8081/addFriend`,formData).then((res)=>{
            if(res.data.msg==="添加好友成功"){
                messageApi.open({
                    type: 'success',
                    content: '添加好友成功!',
                  });
                setRefreshFlag(refreshFlag+1)
                setFriendName('')
            }else{
                messageApi.open({
                    type: 'warning',
                    content: res.data.msg,
                  });
            }
        })
    }
    const handleDeleteFriend=(friendId)=>{
        axios.get(`http://localhost:8081/deleteFriend?userId=${localStorage.getItem("id")}&friendId=${friendId}`).then((res)=>{
            if(res.data.msg==="删除好友成功"){
                setRefreshFlag(refreshFlag+1)
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
                navigate('/')
                return
            }
            let id =localStorage.getItem("id")
            axios.get(`http://localhost:8081/friendList?id=${id}`).then((res)=>{
                console.log(res.data)
                if(res.data.data===undefined){
                    messageApi.open({
                        type: 'warning',
                        content: "好友列表获取失败",
                      });
                      setTimeout(()=>{
                        navigate('/')
                      },1000)
                    return
                }
                setFriendList(res.data.data)
            })
        })
    },[refreshFlag])
    return(
        <div className={styles.container}>
            {contextHolder}
            <div className={styles.header}>
                <div>
                    <h3>你好！ {localStorage.getItem("id")}</h3>
                    <h4>欢迎登录聊天室！</h4>
                </div>
                <div className={styles.bt}>
                    <Button onClick={()=>{
                            navigate('/aboutMe')
                    }}>个人主页</Button>
                    <Button onClick={()=>{
                            navigate('/')
                    }}>退出登录</Button>
                </div>
            </div>
            <div className={styles.body}>
                <div className={styles.eachLine}>
                    <Input placeholder="请输入用户名" value={friendName} onChange={(e)=>{
                        setFriendName(e.target.value)
                    }}></Input>
                    <Button type="primary" onClick={handleAddFriend}>添加好友</Button>
                </div>
                {
                    friendList.map((item)=>{
                        return(
                            <div key={item.ID} className={styles.eachItem}>
                                <Button type="dashed" danger onClick={()=>{handleDeleteFriend(item.UserId)}}>
                                    删除好友
                                </Button>
                                <div>{item.UserId}</div>
                                <Button type="dashed" onClick={()=>{
                                    navigate(`/oneOnOne?friend=${item.UserId}`)
                                }}>
                                    和他聊天
                                </Button>
                            </div>
                        )
                    })
                }
                {friendList.length===0&&(
                    <Empty description={null} />
                )}
                <Button type="primary" onClick={()=>{
                    navigate('/chat')
                }}>在线交流大厅</Button>
            </div>
        </div>
    )
}
export default FriendList
