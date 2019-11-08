package user

import (
	"errors"
	"time"

	"github.com/ah-panda/panda/pkg/context"
	"github.com/ah-panda/panda/pkg/models"
)

func Login(username, password string) (*context.APIContext, error) {
	ubi, err := models.GetUserBasicInfoByUsername(username)
	if err != nil {
		return nil, err
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

	ctx := &context.APIContext{
		UserID:      ubi.User.UserId,
		Username:    ubi.Username,
		DeveloperId: ubi.DeveloperId,
		Timestamp:   time.Now().Unix(),
	}

	return ctx, nil
}
