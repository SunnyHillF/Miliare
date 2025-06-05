package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

var (
	ddb              *dynamodb.Client
	userProfileTable string
)

type LeadUser struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func init() {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	ddb = dynamodb.NewFromConfig(cfg)
	userProfileTable = getenv("USER_PROFILE_TABLE")
}

func getenv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		panic(fmt.Sprintf("%s not set", key))
	}
	return v
}

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if req.Resource == "/lead/users" && req.HTTPMethod == http.MethodGet {
		return handleGetUsers(ctx)
	}
	return events.APIGatewayProxyResponse{StatusCode: http.StatusNotFound}, nil
}

func handleGetUsers(ctx context.Context) (events.APIGatewayProxyResponse, error) {
	out, err := ddb.Scan(ctx, &dynamodb.ScanInput{TableName: aws.String(userProfileTable)})
	if err != nil {
		return serverError(err)
	}
	var users []LeadUser
	for _, item := range out.Items {
		var u LeadUser
		if err := attributevalue.UnmarshalMap(item, &u); err != nil {
			return serverError(err)
		}
		users = append(users, u)
	}
	body, _ := json.Marshal(users)
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(body),
	}, nil
}

func serverError(err error) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: err.Error()}, nil
}

func main() {
	lambda.Start(handler)
}
