package routers

import (
	"net/http"

	"github.com/ah-panda/panda/pkg/api/structs"
	"github.com/ah-panda/panda/pkg/context"
	"github.com/ah-panda/panda/pkg/models"
	"github.com/gin-gonic/gin"
)

func getUser(c *gin.Context) {
	rtx := c.Query("rtx")
	query := c.Query("query")
	ctx := c.MustGet(SessionKey).(*context.APIContext)

	if rtx == "" && query == "" {
		ctx.JSON(http.StatusOK, structs.NewErrResult(1002, "invalid params"))
		return
	}

	if rtx != "" {
		user, err := models.GetUserByRtx(rtx)
		if err != nil {
			ctx.JSON(http.StatusOK, structs.NewErrResult(3103, "get user failed:"+err.Error()))
			return
		}

		allowed := ctx.IsAllowed(user.DeveloperId, -1, -1)

		if allowed == false && user.UserId != ctx.UserID {
			ctx.JSON(http.StatusOK, structs.NewErrResult(1001, "permission deny"))

		}

		ctx.JSON(http.StatusOK, structs.NewResult(http.StatusOK, user))
	} else {
		user, err := models.GetUserByUserId(ctx.UserID)
		if err != nil {
			ctx.JSON(http.StatusOK, structs.NewErrResult(3103, "get user failed:"+err.Error()))
			return
		}

		users, err := models.ListUsers(models.ListUsersOption{}.WithDeveloperId(user.DeveloperId).WithRtx(query))
		if err != nil {
			ctx.JSON(http.StatusOK, structs.NewErrResult(3101, "get user list by developer id failed:"+err.Error()))
			return
		}

		var result []map[string]interface{}
		for _, v := range users {
			result = append(result, map[string]interface{}{
				"rtx":     v.Rtx,
				"user_id": v.UserId,
			})
		}

		ctx.JSON(http.StatusOK, structs.NewResult(http.StatusOK, result))
	}

	ctx.JSON(http.StatusOK, structs.NewResult(http.StatusOK, ""))
}
