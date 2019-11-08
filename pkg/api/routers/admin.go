package routers

import (
	"github.com/gin-gonic/gin"
)

func getAdmin(c *gin.Context) {
	//ctx := c.MustGet(SessionKey).(*context.APIContext)

	//userId, err := strconv.Atoi(c.Query("user_id"))
	//if err != nil {
	//	ctx.JSON(http.StatusOK, structs.NewErrResult(1002, "invalid params"))
	//	return
	//}
	//developerId := c.Query("developer_id")
	//groupId, err := strconv.Atoi(c.Query("group_id"))
	//if err != nil {
	//	ctx.JSON(http.StatusOK, structs.NewErrResult(1002, "invalid params"))
	//	return
	//}

	//if rtx == "" && query == "" {
	//	ctx.JSON(http.StatusOK, structs.NewErrResult(1002, "invalid params"))
	//	return
	//}
	//
	//if rtx != "" {
	//	admin, err := models.GetAdminByRtx(rtx)
	//	if err != nil {
	//		ctx.JSON(http.StatusOK, structs.NewErrResult(3103, "get admin failed:"+err.Error()))
	//		return
	//	}
	//
	//	allowed := ctx.IsAllowed(admin.DeveloperId, -1, -1)
	//
	//	if allowed == false && admin.AdminId != ctx.AdminID {
	//		ctx.JSON(http.StatusOK, structs.NewErrResult(1001, "permission deny"))
	//
	//	}
	//
	//	ctx.JSON(http.StatusOK, structs.NewResult(http.StatusOK, admin))
	//} else {
	//	admin, err := models.GetAdminByAdminId(ctx.AdminID)
	//	if err != nil {
	//		ctx.JSON(http.StatusOK, structs.NewErrResult(3103, "get admin failed:"+err.Error()))
	//		return
	//	}
	//
	//	admins, err := models.ListAdmins(models.ListAdminsOption{}.WithDeveloperId(admin.DeveloperId).WithRtx(query))
	//	if err != nil {
	//		ctx.JSON(http.StatusOK, structs.NewErrResult(3101, "get admin list by developer id failed:"+err.Error()))
	//		return
	//	}
	//
	//	var result []map[string]interface{}
	//	for _, v := range admins {
	//		result = append(result, map[string]interface{}{
	//			"rtx":      v.Rtx,
	//			"admin_id": v.AdminId,
	//		})
	//	}
	//
	//	ctx.JSON(http.StatusOK, structs.NewResult(http.StatusOK, result))
	//}
	//
	//ctx.JSON(http.StatusOK, structs.NewResult(http.StatusOK, ""))
}
