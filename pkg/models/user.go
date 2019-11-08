package models

import (
	"fmt"
	"time"
)

type User struct {
	Deleted       int       `xorm:"not null default 0 TINYINT(8)" json:"-"`
	DeveloperId   string    `xorm:"CHAR(20)" json:"developer_id"`
	LastLoginTime time.Time `xorm:"DATETIME" json:"-"`
	Rtx           string    `xorm:"unique CHAR(32)" json:"rtx"`
	UserId        int       `xorm:"not null pk autoincr INT(20)" json:"user_id"`

	Developer     *Developer     `xorm:"-" json:"-"`
	UserBasicInfo *UserBasicInfo `xorm:"-" json:"-"`
}

func (u *User) LoadDeveloper() error {
	return u.loadDeveloper(x)
}

func (u *User) loadDeveloper(e Engine) (err error) {
	if u.Developer == nil {
		u.Developer, err = getDeveloperByDeveloperId(e, u.DeveloperId)
		if err != nil {
			return fmt.Errorf("getDeveloperByDeveloperId [%s]: %v", u.DeveloperId, err)
		}
	}
	return nil
}

func (u *User) LoadUserBasicInfo() error {
	return u.loadUserBasicInfo(x)
}

func (u *User) loadUserBasicInfo(e Engine) (err error) {
	if u.UserBasicInfo == nil {
		u.UserBasicInfo, err = getUserBasicInfoByUsername(e, u.Rtx)
		if err != nil {
			return fmt.Errorf("getUserBasicInfoByUsername [%s]: %v", u.Rtx, err)
		}
	}
	return nil
}

func CreateUser(d *User) error {
	return createUser(x, d)
}

func createUser(e Engine, d *User) error {
	_, err := e.Insert(d)

	return err
}

func GetUserByUserId(UserId int) (*User, error) {
	return getUserByUserId(x, UserId)
}

func getUserByUserId(e Engine, UserId int) (*User, error) {
	d := &User{
		UserId: UserId,
	}

	has, err := e.Get(d)
	if err != nil {
		return nil, err
	}

	if !has {
		return nil, ErrNotExist{Key: UserId}
	}

	return d, nil
}

func GetUserByRtx(rtx string) (*User, error) {
	return getUserByRtx(x, rtx)
}

func getUserByRtx(e Engine, rtx string) (*User, error) {
	d := &User{
		Rtx: rtx,
	}

	has, err := e.Get(d)
	if err != nil {
		return nil, err
	}

	if !has {
		return nil, ErrNotExist{Key: rtx}
	}

	return d, nil
}

type ListUsersOption struct {
	developerId *string
	rtx         *string
}

func (opt ListUsersOption) WithDeveloperId(developerId string) ListUsersOption {
	opt.developerId = &developerId
	return opt
}

func (opt ListUsersOption) WithRtx(rtx string) ListUsersOption {
	if rtx != "" {
		rtx = rtx + "%"
		opt.rtx = &rtx
	}

	return opt
}

func ListUsers(opt ListUsersOption) ([]*User, error) {
	return listUsers(x, opt)
}

func listUsers(e Engine, opt ListUsersOption) ([]*User, error) {
	var ds []*User

	if opt.developerId != nil {
		e.Where("developer_id = ?", *opt.developerId)
	}

	if opt.rtx != nil {
		e.Where("rtx like ?", *opt.rtx)
	}

	err := e.Asc("developer_id").Find(&ds)
	if err != nil {
		return nil, err
	}

	return ds, nil
}
