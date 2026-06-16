#!/bin/bash

set -e

APP_DIR="/home/ec2-user/lms-frontend"

echo "Starting frontend deployment..."

cd $APP_DIR

echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm ci

echo "Building Next.js app..."
npm run build

echo "Restarting PM2..."

if pm2 describe lms-frontend > /dev/null; then
    pm2 reload lms-frontend
else
    pm2 start ecosystem.config.cjs
fi

echo "Saving PM2 process..."
pm2 save

echo "Frontend deployment completed successfully!"
