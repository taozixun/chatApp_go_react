package initbefore

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"time"
)

type User struct {
	gorm.Model
	UserId  string `gorm:"unique_index"`
	PSW     string
	Friends []User `gorm:"many2many:user_friends;association_jointable_foreignkey:friend_id"`
}
type UserDetail struct {
	gorm.Model
	Gender  bool
	Aviator string
	UserId  string `gorm:"unique_index"`
	Desc    string
	Phone   string
}

var DB *gorm.DB

func InitDateBase() {
	dsn := "root:123456@tcp(127.0.0.1:3306)/testUser?charset=utf8mb4&parseTime=True&loc=Local"
	//gorm.Config里配置打印sql语句
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.New(
			log.New(log.Writer(), "", log.LstdFlags), // Provide the log.New function with the required arguments
			logger.Config{
				SlowThreshold: time.Second, // 慢查询阈值，超过该阈值会被认为是慢查询，被打印出来
				LogLevel:      logger.Info, // 日志级别
				Colorful:      true,        // 是否使用彩色日志
			},
		),
	})
	if err != nil {
		fmt.Println("连接数据库失败")
		fmt.Println(err)
		return
	}

	DB = db
	//自动建表
	err = db.AutoMigrate(&User{})
	if err != nil {
		fmt.Println("建表失败")
		fmt.Println(err)
		return
	}
	err = db.AutoMigrate(&UserDetail{})
	if err != nil {
		fmt.Println("建表失败")
		fmt.Println(err)
		return
	}
}
