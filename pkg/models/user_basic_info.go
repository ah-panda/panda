package models

import (
	"errors"
	"fmt"
	"time"
)

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

	User      *User
	Developer *Developer `xorm:"-"`
}

func (ubi *UserBasicInfo) LoadDeveloper() error {
	return ubi.loadDeveloper(x)
}

func (ubi *UserBasicInfo) loadDeveloper(e Engine) (err error) {
	if ubi.Developer == nil {
		ubi.Developer, err = getDeveloperByDeveloperId(e, ubi.DeveloperId)
		if err != nil {
			return fmt.Errorf("getDeveloperByDeveloperId [%s]: %v", ubi.DeveloperId, err)
		}
	}
	return nil
}

func (ubi *UserBasicInfo) LoadUser() error {
	return ubi.loadUser(x)
}

func (ubi *UserBasicInfo) loadUser(e Engine) (err error) {
	if ubi.User == nil {
		ubi.User, err = getUserByRtx(e, ubi.Username)
		if err != nil {
			return fmt.Errorf("getUserByRtx [%s]: %v", ubi.Username, err)
		}
	}
	return nil
}

func CreateUserBasicInfo(ubi *UserBasicInfo) error {
	ubi.CreateTime = int(time.Now().Unix())
	return createUserBasicInfo(x, ubi)
}

func createUserBasicInfo(e Engine, ubi *UserBasicInfo) error {
	_, err := e.Insert(ubi)

	return err
}

func GetUserBasicInfoByUsername(username string) (*UserBasicInfo, error) {
	return getUserBasicInfoByUsername(x, username)
}

func getUserBasicInfoByUsername(e Engine, username string) (*UserBasicInfo, error) {
	ubi := &UserBasicInfo{
		Username: username,
	}

	has, err := e.Where("is_deleted=0").Get(ubi)
	if err != nil {
		return nil, err
	}

	if !has {
		return nil, ErrNotExist{Key: username}
	}

	return ubi, nil
}

func GetUserBasicInfoByDeveloperId(developerId string) (*UserBasicInfo, error) {
	return getUserBasicInfoByUsername(x, developerId)
}

func getUserBasicInfoByDeveloperId(e Engine, developerId string) (*UserBasicInfo, error) {
	ubi := &UserBasicInfo{
		DeveloperId: developerId,
	}

	has, err := e.Where("is_deleted=0").Get(ubi)
	if err != nil {
		return nil, err
	}

	if !has {
		return nil, ErrNotExist{Key: developerId}
	}

	return ubi, nil
}

type ListUserBasicInfosOption struct{}

func ListUserBasicInfos(opt ListUserBasicInfosOption) ([]*UserBasicInfo, error) {
	return listUserBasicInfos(x, opt)
}

func listUserBasicInfos(e Engine, opt ListUserBasicInfosOption) ([]*UserBasicInfo, error) {
	var ubis []*UserBasicInfo

	err := e.Asc("developer_id, username").Find(&ubis)
	if err != nil {
		return nil, err
	}

	return ubis, nil
}

func DeleteUserBasicInfoByUsername(username string) error {
	return deleteUserBasicInfoByUsername(x, username)
}

func deleteUserBasicInfoByUsername(e Engine, username string) error {
	ubi := &UserBasicInfo{
		IsDeleted: 1,
	}

	affected, err := e.Where("username=?", username).Cols("is_deleted").Update(ubi)
	if err != nil {
		return err
	}

	if affected != 1 {
		return errors.New("delete 0 line")
	}

	return nil
}
