#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
TODAY=$(date +"%Y%m%d")
CURRENT_COMMIT=`git rev-parse HEAD`

PROJECTPATH="/Users/gk/gk-playground-backend"
REMOTE_USER="ec2-user"
REMOTE_SERVER="ec2-3-140-103-253.us-east-2.compute.amazonaws.com"
CERT_KEY="/Users/gk/certs/sideProjectEC2.pem"
REMOTE_BIN="/var/www/html/api/gk-playground-backend"
REMOTE_SERVICE="gk-playground-server.service"

echo "Start Deployment: $TODAY"
echo "Remote BIN Location: $REMOTE_BIN"
echo "Current Commit: $CURRENT_COMMIT"

printf "Stopping remote service\n"
if ssh -i $CERT_KEY $REMOTE_USER@$REMOTE_SERVER "sudo systemctl stop $REMOTE_SERVICE"; then
    printf "${GREEN}Stop remote service completed${NC}\n"
else
    printf "${RED}Stop remote service failed${NC}\n"
    exit 1
fi

echo "Uploading to $REMOTE_SERVER"
if rsync -e "ssh -i $CERT_KEY" --rsync-path "sudo rsync" -avr $PROJECTPATH/* --exclude ".env" --exclude "node_modules" $REMOTE_USER@$REMOTE_SERVER:$REMOTE_BIN ; then
    printf "${GREEN}Upload to $REMOTE_SERVER Completed${NC}\n"
else
    printf "${RED}Upload to $REMOTE_SERVER Failed${NC}\n"
    exit 1
fi

printf "Restarting remote service\n"
if ssh -i $CERT_KEY $REMOTE_USER@$REMOTE_SERVER "sudo systemctl restart $REMOTE_SERVICE"; then
    printf "${GREEN}Restart remote service completed${NC}\n"
else
    printf "${RED}Restart remote service failed${NC}\n"
    exit 1
fi
