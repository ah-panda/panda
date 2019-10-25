package context

type Render interface {
	JSON(int, interface{})
}
