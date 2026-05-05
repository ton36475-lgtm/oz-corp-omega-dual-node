#!/bin/bash

##############################################################################
# OZ-CORP OMEGA - Complete Installation Script
# Automates the entire setup process for development and production
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="${1:-.}"
ENVIRONMENT="${2:-development}"

##############################################################################
# Helper Functions
##############################################################################

print_header() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

##############################################################################
# Prerequisite Checks
##############################################################################

check_prerequisites() {
  print_header "Checking Prerequisites"

  # Check Node.js
  if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
  fi
  NODE_VERSION=$(node -v)
  print_success "Node.js $NODE_VERSION found"

  # Check pnpm
  if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm is not installed, installing..."
    npm install -g pnpm
  fi
  PNPM_VERSION=$(pnpm -v)
  print_success "pnpm $PNPM_VERSION found"

  # Check PostgreSQL
  if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL client is not installed"
    if [ "$ENVIRONMENT" = "production" ]; then
      print_error "PostgreSQL client is required for production"
      exit 1
    fi
  else
    PSQL_VERSION=$(psql --version)
    print_success "$PSQL_VERSION found"
  fi

  # Check Docker (optional but recommended)
  if ! command -v docker &> /dev/null; then
    print_warning "Docker is not installed (optional but recommended)"
  else
    DOCKER_VERSION=$(docker --version)
    print_success "$DOCKER_VERSION found"
  fi

  # Check Terraform (for production)
  if [ "$ENVIRONMENT" = "production" ]; then
    if ! command -v terraform &> /dev/null; then
      print_error "Terraform is required for production deployment"
      exit 1
    fi
    TF_VERSION=$(terraform version | head -n 1)
    print_success "$TF_VERSION found"
  fi
}

##############################################################################
# Project Setup
##############################################################################

setup_project() {
  print_header "Setting Up Project"

  cd "$PROJECT_DIR"

  # Check if project directory exists
  if [ ! -f "package.json" ]; then
    print_error "package.json not found in $PROJECT_DIR"
    exit 1
  fi

  print_info "Project directory: $PROJECT_DIR"
  print_info "Environment: $ENVIRONMENT"
}

##############################################################################
# Dependencies Installation
##############################################################################

install_dependencies() {
  print_header "Installing Dependencies"

  print_info "Installing npm packages with pnpm..."
  pnpm install

  print_success "Dependencies installed"
}

##############################################################################
# Environment Configuration
##############################################################################

setup_environment() {
  print_header "Setting Up Environment"

  if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
      print_info "Creating .env from .env.example..."
      cp .env.example .env
      print_warning "Please edit .env with your configuration"
    else
      print_warning ".env.example not found, creating minimal .env..."
      cat > .env << EOF
# OZ-CORP OMEGA Configuration
NODE_ENV=$ENVIRONMENT
PORT=3000
JWT_SECRET=$(openssl rand -base64 32)

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ozdb

# GitHub (optional)
GITHUB_TOKEN=
GITHUB_REPO=ton36475-lgtm/oz-corp-omega
EOF
      print_warning "Please edit .env with your actual configuration"
    fi
  else
    print_success ".env already exists"
  fi

  # Verify required environment variables
  if ! grep -q "DATABASE_URL" .env; then
    print_error ".env missing DATABASE_URL"
    exit 1
  fi

  if ! grep -q "JWT_SECRET" .env; then
    print_error ".env missing JWT_SECRET"
    exit 1
  fi

  print_success "Environment configured"
}

##############################################################################
# Database Setup
##############################################################################

setup_database() {
  print_header "Setting Up Database"

  # Load environment variables
  export $(cat .env | grep -v '^#' | xargs)

  # Check database connection
  print_info "Checking database connection..."
  if ! psql "$DATABASE_URL" -c "SELECT NOW();" &> /dev/null; then
    print_warning "Cannot connect to database at $DATABASE_URL"
    print_info "Make sure PostgreSQL is running and DATABASE_URL is correct"
    if [ "$ENVIRONMENT" = "development" ]; then
      print_info "Skipping database setup for development"
      return 0
    else
      print_error "Database connection required for production"
      exit 1
    fi
  fi

  print_success "Database connection verified"

  # Run migrations
  print_info "Running database migrations..."
  if [ -f "scripts/db-migrate.mjs" ]; then
    node scripts/db-migrate.mjs
    print_success "Migrations completed"
  else
    print_warning "db-migrate.mjs not found, skipping migrations"
  fi

  # Seed database (development only)
  if [ "$ENVIRONMENT" = "development" ]; then
    print_info "Seeding database with sample data..."
    if [ -f "scripts/db-seed.mjs" ]; then
      node scripts/db-seed.mjs
      print_success "Database seeded"
    else
      print_warning "db-seed.mjs not found, skipping seeding"
    fi
  fi
}

##############################################################################
# Validation
##############################################################################

validate_setup() {
  print_header "Validating Setup"

  # Validate Terraform (if present)
  if [ -d "terraform" ]; then
    print_info "Validating Terraform configuration..."
    cd terraform
    if terraform validate &> /dev/null; then
      print_success "Terraform configuration is valid"
    else
      print_warning "Terraform validation failed (non-critical)"
    fi
    cd ..
  fi

  # Validate database schema
  if [ -f "scripts/test-db-schema.mjs" ]; then
    print_info "Validating database schema..."
    if node scripts/test-db-schema.mjs &> /dev/null; then
      print_success "Database schema is valid"
    else
      print_warning "Database schema validation failed (non-critical)"
    fi
  fi

  # Validate TypeScript
  if command -v tsc &> /dev/null; then
    print_info "Validating TypeScript..."
    if pnpm check &> /dev/null; then
      print_success "TypeScript validation passed"
    else
      print_warning "TypeScript validation failed (non-critical)"
    fi
  fi
}

##############################################################################
# Summary
##############################################################################

print_summary() {
  print_header "Installation Complete"

  echo -e "${GREEN}OZ-CORP OMEGA is ready to use!${NC}\n"

  echo "Next steps:"
  echo ""
  echo "1. Review and update .env configuration"
  echo "   ${BLUE}nano .env${NC}"
  echo ""

  if [ "$ENVIRONMENT" = "development" ]; then
    echo "2. Start development server"
    echo "   ${BLUE}pnpm dev${NC}"
    echo ""
    echo "3. Access dashboard"
    echo "   ${BLUE}open http://localhost:3000${NC}"
    echo ""
  else
    echo "2. Deploy infrastructure"
    echo "   ${BLUE}cd terraform && terraform apply${NC}"
    echo ""
    echo "3. Build and push Docker image"
    echo "   ${BLUE}docker build -t oz-corp-omega:latest .${NC}"
    echo "   ${BLUE}docker push your-registry/oz-corp-omega:latest${NC}"
    echo ""
    echo "4. Deploy to Kubernetes"
    echo "   ${BLUE}kubectl apply -f k8s/${NC}"
    echo ""
  fi

  echo "Documentation:"
  echo "   ${BLUE}cat COMPLETE_PROJECT_SUMMARY.md${NC}"
  echo ""
  echo "GitHub:"
  echo "   ${BLUE}https://github.com/ton36475-lgtm/oz-corp-omega${NC}"
  echo ""
}

##############################################################################
# Main Execution
##############################################################################

main() {
  print_header "OZ-CORP OMEGA Installation"

  check_prerequisites
  setup_project
  install_dependencies
  setup_environment
  setup_database
  validate_setup
  print_summary
}

# Run main function
main
