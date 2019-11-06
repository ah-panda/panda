package structs

type Result struct {
	Code    int
	Message string
	Data    interface{}
}

func NewResult(code int, data interface{}) Result {
	return Result{
		Code:    code,
		Message: "ok",
		Data:    data,
	}
}

func NewErrResult(code int, message string) Result {
	return Result{
		Code:    code,
		Message: message,
	}
}
