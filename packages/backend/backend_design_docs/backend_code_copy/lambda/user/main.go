package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
)

type AppSyncEvent struct {
	Info struct {
		FieldName string `json:"fieldName"`
	} `json:"info"`
	Arguments map[string]json.RawMessage `json:"arguments"`
	Identity  struct {
		Sub string `json:"sub"`
	} `json:"identity"`
}

type Referral struct {
	ID         string  `json:"id"`
	UserID     string  `json:"userId"`
	CompanyID  string  `json:"companyId"`
	ClientName string  `json:"clientName"`
	Status     string  `json:"status"`
	Amount     float64 `json:"amount,omitempty"`
	CreatedAt  string  `json:"createdAt"`
	UpdatedAt  string  `json:"updatedAt"`
}

type Payment struct {
	ID         string  `json:"id"`
	ReferralID string  `json:"referralId"`
	UserID     string  `json:"userId"`
	Amount     float64 `json:"amount"`
	Date       string  `json:"date"`
	Status     string  `json:"status"`
}

// DashboardMetrics provides enhanced analytics for the dashboard
type DashboardMetrics struct {
	TotalEarnings      float64 `json:"totalEarnings"`
	PendingCommissions int     `json:"pendingCommissions"`
	TotalReferrals     int     `json:"totalReferrals"`
	SuccessRate        float64 `json:"successRate"`
}

// MonthlyEarning represents earnings for a specific month
type MonthlyEarning struct {
	Month    string  `json:"month"`
	Earnings float64 `json:"earnings"`
}

type CreateReferralInput struct {
	CompanyID  string `json:"companyId"`
	ClientName string `json:"clientName"`
}

type UpdateReferralStatusInput struct {
	ID     string `json:"id"`
	Status string `json:"status"`
}

var (
	ddb            *dynamodb.Client
	referralsTable string
	paymentsTable  string
)

func init() {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	ddb = dynamodb.NewFromConfig(cfg)
	referralsTable = os.Getenv("REFERRALS_TABLE")
	paymentsTable = os.Getenv("PAYMENTS_TABLE")
}

func handler(ctx context.Context, event AppSyncEvent) (interface{}, error) {
	userID := event.Identity.Sub
	switch event.Info.FieldName {
	case "referrals":
		return listReferrals(ctx, userID)
	case "referral":
		var args struct {
			ID string `json:"id"`
		}
		json.Unmarshal(event.Arguments["id"], &args.ID)
		return getReferral(ctx, args.ID)
	case "payments":
		return listPayments(ctx, userID)
	case "dashboardMetrics":
		return dashboardMetrics(ctx, userID)
	case "earningsByMonth":
		var args struct {
			Months int `json:"months"`
		}
		json.Unmarshal(event.Arguments["months"], &args.Months)
		return earningsByMonth(ctx, userID, args.Months)
	case "createReferral":
		var input CreateReferralInput
		json.Unmarshal(event.Arguments["input"], &input)
		return createReferral(ctx, userID, input)
	case "updateReferralStatus":
		var input UpdateReferralStatusInput
		json.Unmarshal(event.Arguments["input"], &input)
		return updateReferralStatus(ctx, input)
	default:
		return nil, fmt.Errorf("unknown field %s", event.Info.FieldName)
	}
}

func listReferrals(ctx context.Context, userID string) ([]Referral, error) {
	out, err := ddb.Scan(ctx, &dynamodb.ScanInput{
		TableName:        aws.String(referralsTable),
		FilterExpression: aws.String("userId = :uid"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":uid": &types.AttributeValueMemberS{Value: userID},
		},
	})
	if err != nil {
		return nil, err
	}
	var refs []Referral
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &refs); err != nil {
		return nil, err
	}
	return refs, nil
}

func getReferral(ctx context.Context, id string) (*Referral, error) {
	out, err := ddb.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(referralsTable),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: fmt.Sprintf("REFERRAL#%s", id)},
			"SK": &types.AttributeValueMemberS{Value: fmt.Sprintf("METADATA#%s", id)},
		},
	})
	if err != nil {
		return nil, err
	}
	if out.Item == nil {
		return nil, nil
	}
	var r Referral
	if err := attributevalue.UnmarshalMap(out.Item, &r); err != nil {
		return nil, err
	}
	return &r, nil
}

func listPayments(ctx context.Context, userID string) ([]Payment, error) {
	out, err := ddb.Scan(ctx, &dynamodb.ScanInput{
		TableName:        aws.String(paymentsTable),
		FilterExpression: aws.String("userId = :uid"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":uid": &types.AttributeValueMemberS{Value: userID},
		},
	})
	if err != nil {
		return nil, err
	}
	var payments []Payment
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &payments); err != nil {
		return nil, err
	}
	return payments, nil
}

func createReferral(ctx context.Context, userID string, input CreateReferralInput) (*Referral, error) {
	id := uuid.NewString()
	now := time.Now().UTC().Format(time.RFC3339)
	r := &Referral{
		ID:         id,
		UserID:     userID,
		CompanyID:  input.CompanyID,
		ClientName: input.ClientName,
		Status:     "IN_PROGRESS",
		CreatedAt:  now,
		UpdatedAt:  now,
	}
	item, err := attributevalue.MarshalMap(struct {
		PK string `dynamodbav:"PK"`
		SK string `dynamodbav:"SK"`
		Referral
	}{
		PK:       fmt.Sprintf("REFERRAL#%s", id),
		SK:       fmt.Sprintf("METADATA#%s", id),
		Referral: *r,
	})
	if err != nil {
		return nil, err
	}
	if _, err := ddb.PutItem(ctx, &dynamodb.PutItemInput{TableName: aws.String(referralsTable), Item: item}); err != nil {
		return nil, err
	}
	return r, nil
}

func updateReferralStatus(ctx context.Context, input UpdateReferralStatusInput) (*Referral, error) {
	now := time.Now().UTC().Format(time.RFC3339)
	_, err := ddb.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: aws.String(referralsTable),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: fmt.Sprintf("REFERRAL#%s", input.ID)},
			"SK": &types.AttributeValueMemberS{Value: fmt.Sprintf("METADATA#%s", input.ID)},
		},
		UpdateExpression:         aws.String("SET #s = :s, updatedAt = :u"),
		ExpressionAttributeNames: map[string]string{"#s": "status"},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":s": &types.AttributeValueMemberS{Value: input.Status},
			":u": &types.AttributeValueMemberS{Value: now},
		},
		ReturnValues: types.ReturnValueAllNew,
	})
	if err != nil {
		return nil, err
	}
	return getReferral(ctx, input.ID)
}

// dashboardMetrics returns enhanced analytics for the dashboard
func dashboardMetrics(ctx context.Context, userID string) (*DashboardMetrics, error) {
	refs, err := listReferrals(ctx, userID)
	if err != nil {
		return nil, err
	}
	pays, err := listPayments(ctx, userID)
	if err != nil {
		return nil, err
	}

	var metrics DashboardMetrics
	var paidCount int

	for _, p := range pays {
		if p.Status == "Paid" {
			metrics.TotalEarnings += p.Amount
		}
	}

	for _, r := range refs {
		metrics.TotalReferrals++
		switch r.Status {
		case "PAID":
			paidCount++
		case "IN_PROGRESS", "IN_REVIEW":
			metrics.PendingCommissions += 1
		}
	}

	if metrics.TotalReferrals > 0 {
		metrics.SuccessRate = float64(paidCount) / float64(metrics.TotalReferrals) * 100
	}

	return &metrics, nil
}

// earningsByMonth returns monthly earnings data for analytics
func earningsByMonth(ctx context.Context, userID string, months int) ([]MonthlyEarning, error) {
	refs, err := listReferrals(ctx, userID)
	if err != nil {
		return nil, err
	}
	pays, err := listPayments(ctx, userID)
	if err != nil {
		return nil, err
	}

	earningsByMonth := make(map[string]float64)

	// Process payments
	for _, p := range pays {
		if p.Status == "Paid" {
			// Extract YYYY-MM from date
			if len(p.Date) >= 7 {
				monthKey := p.Date[:7]
				earningsByMonth[monthKey] += p.Amount
			}
		}
	}

	// Process referrals that are paid
	for _, r := range refs {
		if r.Status == "PAID" && r.Amount > 0 {
			// Extract YYYY-MM from createdAt
			if len(r.CreatedAt) >= 7 {
				monthKey := r.CreatedAt[:7]
				earningsByMonth[monthKey] += r.Amount
			}
		}
	}

	// Convert map to slice
	earnings := make([]MonthlyEarning, 0, len(earningsByMonth))
	for month, amount := range earningsByMonth {
		earnings = append(earnings, MonthlyEarning{
			Month:    month,
			Earnings: amount,
		})
	}

	return earnings, nil
}

func main() {
	lambda.Start(handler)
}
