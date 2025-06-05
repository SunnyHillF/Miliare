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
	ddb           *dynamodb.Client
	partnersTable string
)

type Compensation struct {
	AgentPercentage      float64 `json:"agentPercentage,omitempty"`
	SmdPercentage        float64 `json:"smdPercentage,omitempty"`
	EvcPercentage        float64 `json:"evcPercentage,omitempty"`
	BonusPoolPercentage  float64 `json:"bonusPoolPercentage,omitempty"`
	MrnPercentage        float64 `json:"mrnPercentage,omitempty"`
	ContractorPercentage float64 `json:"contractorPercentage,omitempty"`
}

type CommissionInfo struct {
	Rate    string `json:"rate,omitempty"`
	Average string `json:"average,omitempty"`
}

type Partner struct {
	ID             string          `json:"id"`
	Name           string          `json:"name"`
	Email          string          `json:"email"`
	Website        string          `json:"website,omitempty"`
	Description    string          `json:"description,omitempty"`
	Status         string          `json:"status,omitempty"`
	Compensation   *Compensation   `json:"compensation,omitempty"`
	CommissionInfo *CommissionInfo `json:"commissionInfo,omitempty"`
	TrainingLinks  []string        `json:"trainingLinks,omitempty"`
	Tags           []string        `json:"tags,omitempty"`
	CreatedAt      string          `json:"createdAt,omitempty"`
	UpdatedAt      string          `json:"updatedAt,omitempty"`
}

func init() {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	ddb = dynamodb.NewFromConfig(cfg)
	partnersTable = getenv("PARTNERS_TABLE")
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
	case req.Resource == "/partners" && req.HTTPMethod == http.MethodGet:
		return handleListPartners(ctx)
	case req.Resource == "/partners" && req.HTTPMethod == http.MethodPost:
		return handleCreatePartner(ctx, req)
	case req.Resource == "/partners/{partnerId}" && req.HTTPMethod == http.MethodGet:
		return handleGetPartner(ctx, req)
	case req.Resource == "/partners/{partnerId}" && req.HTTPMethod == http.MethodPut:
		return handlePutPartner(ctx, req)
	default:
		return events.APIGatewayProxyResponse{StatusCode: http.StatusNotFound}, nil
	}
}

func handleListPartners(ctx context.Context) (events.APIGatewayProxyResponse, error) {
	out, err := ddb.Scan(ctx, &dynamodb.ScanInput{
		TableName: aws.String(partnersTable),
	})
	if err != nil {
		return serverError(err)
	}
	var partners []Partner
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &partners); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(partners)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func handleCreatePartner(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var p Partner
	if err := json.Unmarshal([]byte(req.Body), &p); err != nil {
		return clientError(http.StatusBadRequest, "invalid body")
	}
	if p.ID == "" {
		p.ID = uuid.NewString()
	}
	now := time.Now().UTC().Format(time.RFC3339)
	p.CreatedAt = now
	p.UpdatedAt = now

	item, err := attributevalue.MarshalMap(struct {
		PK string `dynamodbav:"PK"`
		SK string `dynamodbav:"SK"`
		Partner
	}{
		PK:      fmt.Sprintf("PARTNER#%s", p.ID),
		SK:      fmt.Sprintf("PROFILE#%s", p.ID),
		Partner: p,
	})
	if err != nil {
		return serverError(err)
	}
	if _, err := ddb.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(partnersTable), Item: item}); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(p)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusCreated, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func handleGetPartner(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["partnerId"]
	out, err := ddb.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(partnersTable),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: fmt.Sprintf("PARTNER#%s", id)},
			"SK": &types.AttributeValueMemberS{Value: fmt.Sprintf("PROFILE#%s", id)},
		},
	})
	if err != nil {
		return serverError(err)
	}
	if out.Item == nil {
		return events.APIGatewayProxyResponse{StatusCode: http.StatusNotFound}, nil
	}
	var p Partner
	if err := attributevalue.UnmarshalMap(out.Item, &p); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(p)
	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: string(body), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func handlePutPartner(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["partnerId"]
	var p Partner
	if err := json.Unmarshal([]byte(req.Body), &p); err != nil {
		return clientError(http.StatusBadRequest, "invalid body")
	}
	p.ID = id
	p.UpdatedAt = time.Now().UTC().Format(time.RFC3339)
	if p.CreatedAt == "" {
		p.CreatedAt = p.UpdatedAt
	}
	item, err := attributevalue.MarshalMap(struct {
		PK string `dynamodbav:"PK"`
		SK string `dynamodbav:"SK"`
		Partner
	}{
		PK:      fmt.Sprintf("PARTNER#%s", id),
		SK:      fmt.Sprintf("PROFILE#%s", id),
		Partner: p,
	})
	if err != nil {
		return serverError(err)
	}
	if _, err := ddb.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(partnersTable), Item: item}); err != nil {
		return serverError(err)
	}
	body, _ := json.Marshal(p)
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
