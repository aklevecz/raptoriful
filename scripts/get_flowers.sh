#!/bin/bash

# Run the command and process with jq to get just the results array
npx wrangler d1 execute DATABASE \
--remote --json --command "SELECT * from flowers;" | jq '.[0].results' > flowers.json

# Print confirmation
echo "Query results saved to flowers.json"