package main

import (
	"log"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-secretsmanager-caching-go/secretcache"
)

var db dynamodb.Client
var secretCache, _ = secretcache.New()

func init() {
	dbClient, err := getClient()

	if err != nil {
		log.Fatal(err)
	}

	db = dbClient
}

func main() {
	lambda.Start(router)
}
