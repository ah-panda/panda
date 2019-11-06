package models

import "fmt"

// ErrNotExist represents a "ErrNotExist" kind of error.
type ErrNotExist struct {
	Key interface{}
}

// IsErrNotExist checks if an error is a ErrNotExist.
func IsErrNotExist(err error) bool {
	_, ok := err.(ErrNotExist)
	return ok
}

func (err ErrNotExist) Error() string {
	return fmt.Sprintf("obj does not exist [key: %v]", err.Key)
}
