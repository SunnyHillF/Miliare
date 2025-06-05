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
	ddb              *dynamodb.Client
	userProfileTable string
	paymentsTable    string
)

type UserProfile struct {
	ID               string `json:"id"`
	Name             string `json:"name"`
	Email            string `json:"email"`
	Phone            string `json:"phone,omitempty"`
	Address          string `json:"address,omitempty"`
	Company          string `json:"company,omitempty"`
	UplineEVC        string `json:"uplineEVC,omitempty"`
	UplineSMD        string `json:"uplineSMD,omitempty"`
	BankInfoDocument string `json:"bankInfoDocument,omitempty"`
	TaxDocument      string `json:"taxDocument,omitempty"`
	CreatedAt        string `json:"createdAt,omitempty"`
	UpdatedAt        string `json:"updatedAt,omitempty"`
}

type Payment struct {
	ID         string  `json:"id"`
	ReferralID string  `json:"referralId"`
	UserID     string  `json:"userId"`
	Amount     float64 `json:"amount"`
	Date       string  `json:"date"`
	Status     string  `json:"status"`
}

func init() {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	ddb = dynamodb.NewFromConfig(cfg)
	userProfileTable = getenv("USER_PROFILE_TABLE")
	paymentsTable = getenv("PAYMENTS_TABLE")
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
	case req.Resource == "/users/{userId}" && req.HTTPMethod == http.MethodGet:
		return handleGetUser(ctx, req)
	case req.Resource == "/users/{userId}" && req.HTTPMethod == http.MethodPut:
		return handlePutUser(ctx, req)
	case req.Resource == "/users/{userId}/payments" && req.HTTPMethod == http.MethodGet:
		return handleGetPayments(ctx, req)
	case req.Resource == "/payments" && req.HTTPMethod == http.MethodGet:
		return handleGetAllPayments(ctx, req)
	case req.Resource == "/payments" && req.HTTPMethod == http.MethodPost:
		return handleCreatePayment(ctx, req)
	case req.Resource == "/payments/{paymentId}" && req.HTTPMethod == http.MethodGet:
		return handleGetPayment(ctx, req)
	case req.Resource == "/payments/{paymentId}" && req.HTTPMethod == http.MethodPut:
		return handleUpdatePayment(ctx, req)
	default:
		return events.APIGatewayProxyResponse{StatusCode: http.StatusNotFound}, nil
	}
}

func handleGetUser(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	userID := req.PathParameters["userId"]
	out, err := ddb.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(userProfileTable),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: fmt.Sprintf("USER#%s", userID)},
			"SK": &types.AttributeValueMemberS{Value: fmt.Sprintf("PROFILE#%s", userID)},
		},
	})
	if err != nil {
		return serverError(err)
	}
	if out.Item == nil {
		return events.APIGatewayProxyResponse{StatusCode: http.StatusNotFound}, nil
	}
	var profile UserProfile
	if err := attributevalue.UnmarshalMap(out.Item, &profile); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(profile)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func handlePutUser(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	userID := req.PathParameters["userId"]
	var profile UserProfile
	if err := json.Unmarshal([]byte(req.Body), &profile); err != nil {
		return clientError(http.StatusBadRequest, "invalid body")
	}
	now := time.Now().UTC().Format(time.RFC3339)
	if profile.CreatedAt == "" {
		profile.CreatedAt = now
	}
	profile.UpdatedAt = now
	profile.ID = userID

	item, err := attributevalue.MarshalMap(struct {
		PK string `dynamodbav:"PK"`
		SK string `dynamodbav:"SK"`
		UserProfile
	}{
		PK:          fmt.Sprintf("USER#%s", userID),
		SK:          fmt.Sprintf("PROFILE#%s", userID),
		UserProfile: profile,
	})
	if err != nil {
		return serverError(err)
	}

	if _, err := ddb.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(userProfileTable), Item: item}); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(profile)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func handleGetPayments(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	userID := req.PathParameters["userId"]
	out, err := ddb.Scan(ctx, &dynamodb.ScanInput{
		TableName:        aws.String(paymentsTable),
		FilterExpression: aws.String("userId = :uid"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":uid": &types.AttributeValueMemberS{Value: userID},
		},
	})
	if err != nil {
		return serverError(err)
	}
	var payments []Payment
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &payments); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(payments)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func handleGetAllPayments(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	out, err := ddb.Scan(ctx, &dynamodb.ScanInput{
		TableName: aws.String(paymentsTable),
	})
	if err != nil {
		return serverError(err)
	}
	var payments []Payment
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &payments); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(payments)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func handleCreatePayment(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var payment Payment
	if err := json.Unmarshal([]byte(req.Body), &payment); err != nil {
		return clientError(http.StatusBadRequest, "invalid body")
	}

	now := time.Now().UTC().Format(time.RFC3339)
	if payment.ID == "" {
		payment.ID = uuid.NewString()
	}
	if payment.Date == "" {
		payment.Date = now
	}

	item, err := attributevalue.MarshalMap(struct {
		PK string `dynamodbav:"PK"`
		SK string `dynamodbav:"SK"`
		Payment
	}{
		PK:      fmt.Sprintf("PAYMENT#%s", payment.ID),
		SK:      fmt.Sprintf("USER#%s", payment.UserID),
		Payment: payment,
	})
	if err != nil {
		return serverError(err)
	}

	if _, err := ddb.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(paymentsTable), Item: item}); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(payment)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusCreated, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func handleGetPayment(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	paymentID := req.PathParameters["paymentId"]

	// First try to find by scanning for the payment ID
	out, err := ddb.Scan(ctx, &dynamodb.ScanInput{
		TableName:        aws.String(paymentsTable),
		FilterExpression: aws.String("#id = :pid"),
		ExpressionAttributeNames: map[string]string{
			"#id": "id",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pid": &types.AttributeValueMemberS{Value: paymentID},
		},
	})
	if err != nil {
		return serverError(err)
	}
	if len(out.Items) == 0 {
		return events.APIGatewayProxyResponse{StatusCode: http.StatusNotFound}, nil
	}
	var payment Payment
	if err := attributevalue.UnmarshalMap(out.Items[0], &payment); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(payment)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func handleUpdatePayment(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	paymentID := req.PathParameters["paymentId"]
	var payment Payment
	if err := json.Unmarshal([]byte(req.Body), &payment); err != nil {
		return clientError(http.StatusBadRequest, "invalid body")
	}
	payment.ID = paymentID

	// First find the existing payment to get the correct PK/SK
	out, err := ddb.Scan(ctx, &dynamodb.ScanInput{
		TableName:        aws.String(paymentsTable),
		FilterExpression: aws.String("id = :pid"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pid": &types.AttributeValueMemberS{Value: paymentID},
		},
	})
	if err != nil {
		return serverError(err)
	}
	if len(out.Items) == 0 {
		return events.APIGatewayProxyResponse{StatusCode: http.StatusNotFound}, nil
	}

	// Update with the new data
	item, err := attributevalue.MarshalMap(struct {
		PK string `dynamodbav:"PK"`
		SK string `dynamodbav:"SK"`
		Payment
	}{
		PK:      fmt.Sprintf("PAYMENT#%s", payment.ID),
		SK:      fmt.Sprintf("USER#%s", payment.UserID),
		Payment: payment,
	})
	if err != nil {
		return serverError(err)
	}

	if _, err := ddb.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(paymentsTable), Item: item}); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(payment)
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
