package service

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	initbefore "test/init"
	"test/utils"
	"time"
)

type loginMsg struct {
	Id    string
	Psw   string
	Token string
}

func HandleLogin(c *gin.Context) {
	id := c.Query("id")
	psw := c.Query("psw")
	var thisUser = initbefore.User{}
	initbefore.DB.Where("user_id = ? AND psw = ?", id, psw).First(&thisUser)
	if thisUser.UserId == "" {
		c.JSON(200, gin.H{
			"msg": "查询失败",
		})
	} else {
		jwtStr := utils.CreateJWT(id)
		if jwtStr == "" {
			c.JSON(200, gin.H{
				"msg": "token加密失败",
			})
			return
		}
		data := loginMsg{
			id, psw, jwtStr,
		}
		c.JSON(200, gin.H{
			"data": data,
		})
	}
}
func HandleCreateUser(context *gin.Context) {
	id := context.PostForm("id")
	psw := context.PostForm("psw")
	var thisUser initbefore.User
	initbefore.DB.Where("user_id = ?", id).First(&thisUser)
	if thisUser.UserId != "" {
		context.JSON(200, gin.H{
			"msg": "用户名已存在",
		})
		return
	}
	res := initbefore.DB.Create(&initbefore.User{
		UserId: id,
		PSW:    psw,
	})
	if res.Error != nil {
		context.JSON(200, gin.H{
			"msg": "创建失败，写入数据库失败",
		})
		return
	}
	context.JSON(200, gin.H{
		"data": "创建成功",
	})
}
func HandleCheckToken(c *gin.Context) {
	s := c.Query("token") //前端传回的加密串进行解析
	token, err := jwt.ParseWithClaims(s, &utils.MyJWT{}, func(token *jwt.Token) (interface{}, error) {
		return utils.MySigningKey, nil
	})
	if err != nil {
		fmt.Println("token解析失败", err)
		c.JSON(200, gin.H{
			"msg": "token解析失败",
		})
		return
	}
	c.JSON(200, gin.H{
		"msg":  "token解析成功,",
		"data": token.Claims,
	})
}
func HandleUserDetail(c *gin.Context) {
	userId := c.Query("userId")
	//先去查缓存
	val := initbefore.RedisClient.Get(context.TODO(), userId+"_detail")
	userDetail := initbefore.UserDetail{}
	if val.Val() == "" {
		fmt.Println("缓存不存在/缓存已过期")
		initbefore.DB.Where("user_id = ?", userId).First(&userDetail)
		jsonData, e := json.Marshal(userDetail)
		if e != nil {
			fmt.Println("数据json序列化出错")
			c.JSON(200, gin.H{
				"msg": "数据json序列化出错",
			})
			return
		}
		if userDetail.UserId == "" {
			initbefore.RedisClient.Set(context.TODO(), userId+"_detail", jsonData, 5*time.Second) //假数据5s后过期，防止缓存击穿
			c.JSON(200, gin.H{
				"msg": "未设置详情信息",
			})
			return
		}
		initbefore.RedisClient.Set(context.TODO(), userId+"_detail", jsonData, 30*time.Second) //真数据，30s过期
		c.JSON(200, gin.H{
			"data": userDetail,
		})
	} else {
		fmt.Println("直接从redis中拿数据")
		json.Unmarshal([]byte(val.Val()), &userDetail)
		if userDetail.UserId == "" {
			c.JSON(200, gin.H{
				"msg": "未设置详情信息",
			})
			return
		}
		c.JSON(200, gin.H{
			"data": userDetail,
		})
	}

}

func SetUserDetail(c *gin.Context) {
	userDetail := initbefore.UserDetail{}
	e := c.ShouldBindJSON(&userDetail)
	if e != nil {
		fmt.Println("参数解析失败", e)
		c.JSON(500, gin.H{
			"msg": "参数解析失败",
		})
		return
	}
	checkExist := initbefore.UserDetail{}
	initbefore.DB.Where("user_id = ?", userDetail.UserId).First(&checkExist)
	if checkExist.UserId == "" {
		//没有查到数据，直接创建
		e = initbefore.DB.Create(&userDetail).Error
		if e != nil {
			fmt.Println("写入数据库失败", e)
			c.JSON(500, gin.H{
				"msg": "写入数据库失败",
			})
			return
		}
	} else {
		//有数据进行更新
		checkExist.Desc = userDetail.Desc
		checkExist.Phone = userDetail.Phone
		checkExist.Gender = userDetail.Gender
		e = initbefore.DB.Save(&checkExist).Error
		if e != nil {
			fmt.Println("更新数据库失败", e)
			c.JSON(500, gin.H{
				"msg": "更新数据库失败",
			})
			return
		}
	}
	//保持数据一致性，更新用户信息时，要同步更新redis
	jsonData, e := json.Marshal(userDetail)
	if e != nil {
		fmt.Println("数据json序列化出错")
		c.JSON(200, gin.H{
			"msg": "数据json序列化出错",
		})
		return
	}
	initbefore.RedisClient.Set(context.TODO(), userDetail.UserId+"_detail", jsonData, 30*time.Second) //真数据，30s过期
	c.JSON(200, gin.H{
		"msg": "创建成功",
	})
	return
}
