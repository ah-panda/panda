package models

type UserBasicInfo struct {
	CreateTime  int    `xorm:"not null default 0 INT(10)"`
	Description string `xorm:"not null default '' VARCHAR(1024)"`
	DeveloperId string `xorm:"not null default '' unique(idx_user_list_username_developer_id) CHAR(20)"`
	Email       string `xorm:"not null default '' VARCHAR(32)"`
	Fullname    string `xorm:"not null default '' VARCHAR(32)"`
	IsDeleted   int    `xorm:"not null default 0 TINYINT(8)"`
	Mobilephone string `xorm:"not null default '' VARCHAR(32)"`
	Password    string `xorm:"not null default '' VARCHAR(32)"`
	Username    string `xorm:"not null pk default '' unique unique(idx_user_list_username_developer_id) CHAR(32)"`
}
