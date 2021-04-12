#!/bin/bash

echo "HOST_USER_ID=$(id -u $USER)" >> .env
echo "HOST_GROUP_ID=$(id -g $USER)" >> .env