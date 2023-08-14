package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	initbefore "test/init"
	"test/service"
)

func main() {
	initbefore.InitDateBase()     //初始化数据库
	go initbefore.InitWebSocket() //初始化ws
	go initbefore.InitRedis()     //初始化redis
	r := gin.Default()
	// 创建自定义的跨域请求中间件
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}         // 设置允许的域名列表
	config.AllowMethods = []string{"GET", "POST"}                   // 设置允许的请求方法
	config.AllowHeaders = []string{"Authorization", "Content-Type"} // 设置允许的请求头
	r.Use(cors.New(config))                                         // 使用自定义的跨域请求中间件
	//或者直接使用默认，所有来源GET, POST, HEAD都可以
	//r.Use(cors.Default())

	r.GET("/login", service.HandleLogin)
	r.GET("/friendList", service.HandleFriendList)
	r.POST("/addFriend", service.HandleAddFriend)
	r.GET("/deleteFriend", service.HandleDeleteFriend)
	r.GET("/friendMessage", service.GetFriendMsg)
	r.GET("/checkToken", service.HandleCheckToken)
	r.POST("/createUser", service.HandleCreateUser)
	r.GET("/userDetail", service.HandleUserDetail)
	r.POST("/setUserDetail", service.SetUserDetail)
	r.Run(":8081")
}
