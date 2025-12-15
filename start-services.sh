#!/bin/bash

# Script para levantar todos los servicios
# Uso: ./start-services.sh

set -e

echo "================================================"
echo "Iniciando servicios de 42_transendence"
echo "================================================"

echo ""
echo "🚀 Construyendo y Levantando servicios..."
docker-compose watch

echo ""
echo "================================================"
echo "Servicios iniciados exitosamente:"
echo "  - DB Service: http://localhost:3001"
echo "  - DB Swagger: http://localhost:3001/docs"
echo "  - Backend: http://localhost:3000"
echo "  - Frontend: http://localhost:8080"
echo "================================================"
