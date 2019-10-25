package models

type Api struct {
	CategoryId  int    `xorm:"not null default 0 INT(10)"`
	Description string `xorm:"not null default '' VARCHAR(512)"`
	DeveloperId string `xorm:"CHAR(20)"`
	Id          int    `xorm:"not null pk autoincr INT(10)"`
	Name        string `xorm:"not null default '' VARCHAR(64)"`
}
