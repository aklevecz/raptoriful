#!/bin/bash

# Run the command and process with jq to get just the results array
npx wrangler d1 execute DATABASE \
--remote --json --command "SELECT * from raptor_rsvps where event_name='bao3';" | jq '.[0].results' > bao3.json

# Print confirmation
echo "Query results saved to bao3.json"