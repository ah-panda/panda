package routers

import (
	"net/http"

	"github.com/ah-panda/panda/pkg/context"
	"github.com/gin-gonic/gin"
)

func logout(c *gin.Context) {
	ctx := c.MustGet(SessionKey).(*context.APIContext)
	deleteSession(ctx)

	c.Redirect(http.StatusSeeOther, "/static/login.html")
}
