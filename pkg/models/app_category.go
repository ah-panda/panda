package models

type AppCategory struct {
	Description string `xorm:"not null default '' VARCHAR(64)"`
	Id          int    `xorm:"not null pk autoincr INT(10)"`
	Name        string `xorm:"not null default '' VARCHAR(16)"`
}
