package main

import (
    "context"
    "encoding/json"
    "net/http"

    "github.com/aws/aws-lambda-go/events"
    "github.com/aws/aws-lambda-go/lambda"
)

type response struct {
    Message string `json:"message"`
}

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
    body, _ := json.Marshal(response{Message: "not implemented"})
    return events.APIGatewayProxyResponse{
        StatusCode: http.StatusOK,
        Headers:    map[string]string{"Content-Type": "application/json"},
        Body:       string(body),
    }, nil
}

func main() {
    lambda.Start(handler)
}
