#!/bin/bash

# Script para levantar solo el servicio DB

echo "================================================"
echo "🗄️  Iniciando DB Service..."
echo "================================================"
echo ""

cd /workspaces/42_transendence/db

echo "📦 Instalando dependencias..."
npm install

echo ""
echo "🚀 Levantando servidor DB..."
npm run dev

echo ""
echo "================================================"
echo "✅ DB Service en: http://localhost:3001"
echo "📚 Swagger UI en: http://localhost:3001/docs"
echo "================================================"
