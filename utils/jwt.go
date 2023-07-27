package utils

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"time"
)

type MyJWT struct {
	UserId string `json:"userId"`
	jwt.StandardClaims
}

var MySigningKey = []byte("tzxownkey") //声明自己的token加密解密密钥

func CreateJWT(UserId string) string {
	c := MyJWT{
		UserId: UserId,
		StandardClaims: jwt.StandardClaims{
			NotBefore: time.Now().Unix() - 60,
			ExpiresAt: time.Now().Unix() + 600,
		},
	} //创建jwt对象
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, c) //生成jwt
	s, e := t.SignedString(MySigningKey)              //对jwt用自己的签名加密
	if e != nil {
		fmt.Println("token加密失败", e)
		return ""
	}
	return s
}
