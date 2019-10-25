package status

import (
	"net/http"

	"github.com/ah-panda/panda/pkg/api/structs"
)

const _version = "v0.0.1"

func Version() (*structs.Result, error) {
	return &structs.Result{
		Code: http.StatusOK,
		Data: map[string]string{"version": _version},
	}, nil
}
