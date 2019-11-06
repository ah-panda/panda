package user

import (
	"errors"

	"github.com/ah-panda/panda/pkg/models"
)

func Login(username, password string) (*models.UserBasicInfo, error) {
	ubi, err := models.GetUserBasicInfoByUsername(username)
	if err != nil {
		return ubi, err
	}

	sign := getSignPasswd(username, password, ubi.DeveloperId, ubi.CreateTime)

	if ubi.Password != sign {
		return nil, errors.New("用户名或密码错误")
	}

	if err := ubi.LoadDeveloper(); err != nil {
		return nil, err
	}
	if err := ubi.LoadUser(); err != nil {
		return nil, err
	}

	return ubi, nil
}
