package models

type ApiGroupWhitelist struct {
	DeveloperId string `xorm:"not null pk unique(idx_api_group_whitelist_group_id_developer_id) CHAR(20)"`
	GroupId     int    `xorm:"not null pk unique(idx_api_group_whitelist_group_id_developer_id) INT(10)"`
}
