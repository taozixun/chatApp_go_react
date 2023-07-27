package initbefore

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"net/http"
)

var upgrader = websocket.Upgrader{
	//设置允许跨域
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		fmt.Println("请求的来源：", origin, origin == "http://localhost:3000")
		if origin == "http://localhost:3000" {
			return true
		}
		return false
	},
}
var clients = make(map[*websocket.Conn]string)

func InitWebSocket() {
	http.HandleFunc("/ws", handleWebSocket)
	err := http.ListenAndServe(":8888", nil)
	if err != nil {
		fmt.Println("启动webSocket服务失败", err)
	}
}
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("升级到webSocket服务失败", err)
	}
	userId := r.URL.Query().Get("id")
	friendId := r.URL.Query().Get("friendId")
	fmt.Println("userId", userId)
	fmt.Println("friendId", friendId)
	clients[conn] = userId
	defer func() {
		conn.Close()
		delete(clients, conn)
	}()
	for {
		_, msg, err := conn.ReadMessage()
		//当前端关闭连接时，这里会接收到err，直接退出
		if err != nil {
			fmt.Println("websocket接收消息失败", err)
			break
		}
		fmt.Println("接收到的消息：", string(msg))
		//消息转发
		if friendId == "" { //没传friendId代表是交流大厅
			for client := range clients {
				if client != conn {
					err := client.WriteMessage(websocket.TextMessage, []byte(clients[conn]+"说："+string(msg)))
					if err != nil {
						fmt.Println("websocket消息转发失败", err)
						break
					}
				}
			}
		} else { //私聊
			type selfChat struct {
				Msg     string `json:"msg"`
				FromWho string `json:"fromWho"`
			}
			SaveRedisMessage(string(msg), userId+"-"+friendId)
			//GetRedisMessage(userId + "-" + friendId)
			thisMsg := selfChat{
				string(msg),
				userId,
			}
			msgJSON, _ := json.Marshal(thisMsg)
			for client, thisId := range clients {
				if thisId == friendId { //只转发给这个friendID
					err := client.WriteMessage(websocket.TextMessage, msgJSON)
					if err != nil {
						fmt.Println("websocket消息转发失败", err)
						break
					}
				}
			}
		}

	}
}
