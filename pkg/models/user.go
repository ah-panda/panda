package models

import (
	"time"
)

type User struct {
	Deleted       int       `xorm:"not null default 0 TINYINT(8)"`
	DeveloperId   string    `xorm:"CHAR(20)"`
	LastLoginTime time.Time `xorm:"DATETIME"`
	Rtx           string    `xorm:"unique CHAR(32)"`
	UserId        int       `xorm:"not null pk autoincr INT(20)"`
}
