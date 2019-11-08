package routers

import (
	"net/http"

	"github.com/ah-panda/panda/pkg/api/structs"
	"github.com/ah-panda/panda/pkg/logging"
	"github.com/ah-panda/panda/pkg/user"
	"github.com/gin-gonic/gin"
)

func login(c *gin.Context) {
	username := c.Query("username")
	password := c.Query("password")

	ctx, err := user.Login(username, password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, structs.Result{
			Code:    http.StatusUnauthorized,
			Message: err.Error(),
		})
		return
	}

	logging.Warnf("Login:%+v", ctx)

	ctx.WithRender(c)
	ctx.ClientIP = c.ClientIP()
	postSession(ctx)

	ctx.JSON(http.StatusOK, structs.NewResult(http.StatusOK, ctx))
}
