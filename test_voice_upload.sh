#!/bin/bash

# Create a simple test audio file (fake WebM)
echo "WEBM TEST FILE" > /tmp/test_audio.webm

# Get OAuth token (you'll need to replace this with an actual token)
# For now, let's just test if the endpoint responds properly

# Test the voice endpoint
curl -X POST \
  http://api.lifebuffer.test/api/activities/voice \
  -H 'Authorization: Bearer your_token_here' \
  -F 'audio=@/tmp/test_audio.webm' \
  -v

# Clean up
rm /tmp/test_audio.webm