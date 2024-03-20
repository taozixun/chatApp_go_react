package service

import (
	"fmt"
	"github.com/gin-gonic/gin"
	initbefore "test/init"
)

func HandleFriendList(c *gin.Context) {
	id := c.Query("id")
	user := initbefore.User{}
	//有其他结构体别忘了预加载
	initbefore.DB.Preload("Friends").Where("user_id = ?", id).First(&user)
	if initbefore.DB.Error != nil {
		fmt.Println(initbefore.DB.Error)
		c.JSON(200, gin.H{
			"msg": "查询好友列表出错",
		})
		return
	}
	c.JSON(200, gin.H{
		"data": user.Friends,
	})
}
func HandleAddFriend(c *gin.Context) {
	userId := c.PostForm("userId")
	friendId := c.PostForm("friendId")
	user := initbefore.User{}
	initbefore.DB.Where("user_id = ?", userId).First(&user) //找到user
	friend := initbefore.User{}
	initbefore.DB.Where("user_id = ?", friendId).First(&friend) //找到friend
	if friend.UserId == "" {
		c.JSON(200, gin.H{
			"msg": "用户不存在",
		})
		return
	}
	tx := initbefore.DB.Begin()
	// 将 friend 添加到 user 的好友列表中
	user.Friends = append(user.Friends, friend)
	e := tx.Save(&user).Error
	if e != nil {
		fmt.Println(e)
		tx.Rollback()
		c.JSON(200, gin.H{
			"msg": "添加好友失败",
		})
		return
	}
	//好友属性双向绑定
	friend.Friends = append(friend.Friends, user)
	e = tx.Save(&friend).Error
	if e != nil {
		fmt.Println(e)
		tx.Rollback()
		c.JSON(200, gin.H{
			"msg": "添加好友失败",
		})
		return
	}
	if err := tx.Commit().Error; err != nil {
		fmt.Println(err)
		tx.Rollback()
		c.JSON(200, gin.H{
			"msg": "添加好友失败",
		})
		return
	}
	c.JSON(200, gin.H{
		"msg": "添加好友成功",
	})
}
func HandleDeleteFriend(c *gin.Context) {
	userId := c.Query("userId")
	friendId := c.Query("friendId")
	user := initbefore.User{}
	friend := initbefore.User{}
	initbefore.DB.Preload("Friends").Where("user_id = ?", userId).First(&user)
	initbefore.DB.Preload("Friends").Where("user_id = ?", friendId).First(&friend)
	err := initbefore.DB.Model(&user).Association("Friends").Delete(&friend)
	if err != nil {
		c.JSON(200, gin.H{
			"msg": "删除好友失败1",
		})
		return
	}
	err = initbefore.DB.Model(&friend).Association("Friends").Delete(&user)
	if err != nil {
		c.JSON(200, gin.H{
			"msg": "删除好友失败2",
		})
		return
	}
	c.JSON(200, gin.H{
		"msg": "删除好友成功",
	})
}
func GetFriendMsg(c *gin.Context) {
	userId := c.Query("userId")
	friendId := c.Query("friendId")
	//这回获取的是friend发给自己的
	msgList, e := initbefore.GetRedisMessage(friendId + "-" + userId)
	if e != nil {
		c.JSON(500, gin.H{
			"msg": "获取消息列表失败",
		})
		return
	}
	msgListSend, e := initbefore.GetRedisMessage(userId + "-" + friendId)
	if e != nil {
		c.JSON(500, gin.H{
			"msg": "获取消息列表失败",
		})
		return
	}
	c.JSON(200, gin.H{
		"data":     msgList,
		"dataSend": msgListSend,
	})
}
