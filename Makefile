gen :
	go generate

linux :  gen
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build

os :  gen
	CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build

test:
	go test ./... -race -coverprofile=coverage.txt -covermode=atomic

dev:
    go run main.go  server --http.devMode