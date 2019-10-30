package routers

import (
	"net/http"

	"github.com/ah-panda/panda/pkg/api/status"
	static2 "github.com/ah-panda/panda/pkg/static"
	"github.com/gin-gonic/gin"
)

func NewGin() *gin.Engine {
	r := gin.Default()

	gin.SetMode(gin.ReleaseMode)

	r.StaticFS("/static", static2.NewHTTPFileSystem())

	r.GET("/version", func(c *gin.Context) {
		res, err := status.Version()
		if err != nil {
			_ = c.AbortWithError(http.StatusInternalServerError, err)
			return
		}
		c.JSON(res.Code, res.Data)
	})

	return r
}
