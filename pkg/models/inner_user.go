package models

type InnerUser struct {
	Id   int    `xorm:"not null pk autoincr INT(10)"`
	Name string `xorm:"not null default '' VARCHAR(32)"`
}
