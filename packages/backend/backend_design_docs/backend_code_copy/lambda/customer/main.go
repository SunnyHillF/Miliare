package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
)

var (
	ddb            *dynamodb.Client
	customersTable string
)

type Customer struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	CreatedAt string `json:"createdAt,omitempty"`
	UpdatedAt string `json:"updatedAt,omitempty"`
}

func init() {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	ddb = dynamodb.NewFromConfig(cfg)
	customersTable = getenv("CUSTOMERS_TABLE")
}

func getenv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		panic(fmt.Sprintf("%s not set", key))
	}
	return v
}

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	switch {
	case req.Resource == "/customers" && req.HTTPMethod == http.MethodGet:
		return handleListCustomers(ctx)
	case req.Resource == "/customers" && req.HTTPMethod == http.MethodPost:
		return handleCreateCustomer(ctx, req)
	case req.Resource == "/customers/{customerId}" && req.HTTPMethod == http.MethodGet:
		return handleGetCustomer(ctx, req)
	case req.Resource == "/customers/{customerId}" && req.HTTPMethod == http.MethodPut:
		return handlePutCustomer(ctx, req)
	default:
		return events.APIGatewayProxyResponse{StatusCode: http.StatusNotFound}, nil
	}
}

func handleListCustomers(ctx context.Context) (events.APIGatewayProxyResponse, error) {
	out, err := ddb.Scan(ctx, &dynamodb.ScanInput{TableName: aws.String(customersTable)})
	if err != nil {
		return serverError(err)
	}
	var customers []Customer
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &customers); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(customers)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func handleCreateCustomer(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var c Customer
	if err := json.Unmarshal([]byte(req.Body), &c); err != nil {
		return clientError(http.StatusBadRequest, "invalid body")
	}
	if c.ID == "" {
		c.ID = uuid.NewString()
	}
	now := time.Now().UTC().Format(time.RFC3339)
	c.CreatedAt = now
	c.UpdatedAt = now
	item, err := attributevalue.MarshalMap(struct {
		PK string `dynamodbav:"PK"`
		SK string `dynamodbav:"SK"`
		Customer
	}{
		PK:       fmt.Sprintf("CUSTOMER#%s", c.ID),
		SK:       fmt.Sprintf("PROFILE#%s", c.ID),
		Customer: c,
	})
	if err != nil {
		return serverError(err)
	}
	if _, err := ddb.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(customersTable), Item: item}); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(c)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusCreated, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func handleGetCustomer(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["customerId"]
	out, err := ddb.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(customersTable),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: fmt.Sprintf("CUSTOMER#%s", id)},
			"SK": &types.AttributeValueMemberS{Value: fmt.Sprintf("PROFILE#%s", id)},
		},
	})
	if err != nil {
		return serverError(err)
	}
	if out.Item == nil {
		return events.APIGatewayProxyResponse{StatusCode: http.StatusNotFound}, nil
	}
	var c Customer
	if err := attributevalue.UnmarshalMap(out.Item, &c); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(c)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func handlePutCustomer(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["customerId"]
	var c Customer
	if err := json.Unmarshal([]byte(req.Body), &c); err != nil {
		return clientError(http.StatusBadRequest, "invalid body")
	}
	c.ID = id
	c.UpdatedAt = time.Now().UTC().Format(time.RFC3339)
	if c.CreatedAt == "" {
		c.CreatedAt = c.UpdatedAt
	}
	item, err := attributevalue.MarshalMap(struct {
		PK string `dynamodbav:"PK"`
		SK string `dynamodbav:"SK"`
		Customer
	}{
		PK:       fmt.Sprintf("CUSTOMER#%s", id),
		SK:       fmt.Sprintf("PROFILE#%s", id),
		Customer: c,
	})
	if err != nil {
		return serverError(err)
	}
	if _, err := ddb.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(customersTable), Item: item}); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(c)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func serverError(err error) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: err.Error()}, nil
}

func clientError(code int, msg string) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{StatusCode: code, Body: msg}, nil
}

func main() {
	lambda.Start(handler)
}
