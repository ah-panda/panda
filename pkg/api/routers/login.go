package routers

import (
	"net/http"
	"strconv"

	"github.com/ah-panda/panda/pkg/api/structs"
	"github.com/ah-panda/panda/pkg/logging"
	"github.com/ah-panda/panda/pkg/user"
	"github.com/gin-gonic/gin"
)

func login(c *gin.Context) {
	username := c.Query("username")
	password := c.Query("password")

	res, err := user.Login(username, password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, structs.Result{
			Code:    http.StatusUnauthorized,
			Message: err.Error(),
		})
		return
	}

	logging.Warnf("Login:%+v", res)

	c.SetCookie("resthub_user_id", strconv.Itoa(res.User.UserId), 3600*24*7, "/", ".", false, true)
}
