package initbefore

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
)

var RedisClient *redis.Client //创建Redis客户端
var Ctx = context.TODO()

// 初始化Redis客户端
func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", // Redis服务器地址
		Password: "",               // Redis密码
		DB:       0,                // 使用默认数据库
	})
	Ctx = context.Background()
} // 处理接收到的消息，并将消息存储到Redis中
func SaveRedisMessage(message string, recipientID string) {
	//将消息存储到Redis的list中，最多存5个，再有消息则首位丢弃，利用user-fiend结构存消息
	e := RedisClient.RPush(Ctx, recipientID, message).Err()
	if e != nil {
		fmt.Println(e)
	}
	listLength, _ := RedisClient.LLen(Ctx, recipientID).Result()
	if listLength > 5 { //删除多余消息
		RedisClient.LTrim(Ctx, recipientID, 1, -1)
	}
}

// 用户上线时，从Redis中查询两人的消息列表
func GetRedisMessage(recipientID string) ([]string, error) {
	// 从Redis中获取未读消息
	messageList, err := RedisClient.LRange(Ctx, recipientID, 0, -1).Result()
	if err != nil {
		// 处理获取未读消息失败的情况
		fmt.Println("读取redis失败", err)
		return nil, err
	}
	// 将消息列表返回给前端
	fmt.Println("最终消息列表：", messageList)
	return messageList, nil
}
