#!/bin/bash

# Script para levantar solo el Backend

echo "================================================"
echo "🔧 Iniciando Backend Service..."
echo "================================================"
echo ""

cd /workspaces/42_transendence/backend

echo "📦 Instalando dependencias..."
npm install

echo ""
echo "🚀 Levantando servidor Backend..."
npm run dev

echo ""
echo "================================================"
echo "✅ Backend en: http://localhost:3000"
echo "================================================"
