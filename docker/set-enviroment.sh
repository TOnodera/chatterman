#!/bin/bash

echo "HOST_UID = $(id -u $USER)" >> .env
echo "HOST_GID = $(id -g $USER)" >> .env