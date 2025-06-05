# DynamoDB Seed Data

This directory contains example records for the backend DynamoDB tables. The
sample entries mirror the placeholder data used in the frontend prototype so the
UI can render meaningful information once backend connectivity is implemented.

To load the data you can use the AWS CLI or any SDK. Each JSON file is an array
of items ready for `batch-write-item` or similar operations. Table names follow
the schemas under `design_docs/dynamodb` and use the standard `PK` and `SK`
keys.
