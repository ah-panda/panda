package models

type Admin struct {
	Charactar   int    `xorm:"not null INT(8)"`
	Deleted     int    `xorm:"not null default 0 TINYINT(8)"`
	DeveloperId string `xorm:"not null unique(idx_admin_user_id_developer_id_group_id) CHAR(20)"`
	GroupId     int    `xorm:"unique(idx_admin_user_id_developer_id_group_id) INT(10)"`
	UserId      int    `xorm:"not null unique(idx_admin_user_id_developer_id_group_id) INT(20)"`
}
