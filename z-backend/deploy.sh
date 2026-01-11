#!/bin/bash
# Deployment script for Hetzner VPS
# Run this script on your production server

set -e  # Exit on error

echo "🚀 Starting Trudy Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${GREEN}Activating virtual environment...${NC}"
source venv/bin/activate

# Install/update dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt

# Run database migrations
echo -e "${GREEN}Running database migrations...${NC}"
if [ -f "database/migrations/run_migrations.sh" ]; then
    bash database/migrations/run_migrations.sh
else
    echo -e "${YELLOW}Migration script not found, skipping...${NC}"
fi

# Check environment variables
echo -e "${GREEN}Checking environment variables...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}ERROR: .env file not found!${NC}"
    echo "Please create .env file from .env.production.example"
    exit 1
fi

# Validate critical environment variables
source .env
REQUIRED_VARS=("SUPABASE_URL" "SUPABASE_SERVICE_KEY" "CLERK_SECRET_KEY" "CLERK_WEBHOOK_SECRET" "ENCRYPTION_KEY")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}ERROR: Missing required environment variables:${NC}"
    printf '%s\n' "${MISSING_VARS[@]}"
    exit 1
fi

# Restart service (adjust based on your service manager)
echo -e "${GREEN}Restarting service...${NC}"
if systemctl is-active --quiet trudy-backend; then
    sudo systemctl restart trudy-backend
    echo -e "${GREEN}Service restarted${NC}"
elif systemctl is-active --quiet uvicorn; then
    sudo systemctl restart uvicorn
    echo -e "${GREEN}Service restarted${NC}"
else
    echo -e "${YELLOW}No systemd service found. Please restart manually.${NC}"
fi

# Health check
echo -e "${GREEN}Performing health check...${NC}"
sleep 3
if curl -f http://localhost:8000/internal/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
else
    echo -e "${RED}❌ Health check failed!${NC}"
    echo "Check logs: journalctl -u trudy-backend -n 50"
    exit 1
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

