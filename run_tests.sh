#!/bin/bash

# Script para ejecutar todas las pruebas del proyecto

echo "🧪 EJECUTANDO SUITE COMPLETA DE PRUEBAS"
echo "========================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar resultados
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

# 1. Instalar dependencias de pruebas del backend
echo -e "\n${BLUE}📦 Instalando dependencias de pruebas del backend...${NC}"
cd Backend
pip install -r requirements-test.txt
show_result $? "Dependencias del backend instaladas"

# 2. Ejecutar pruebas del backend
echo -e "\n${BLUE}🔧 Ejecutando pruebas del backend...${NC}"
python -m pytest tests/ -v --cov=app --cov-report=term-missing --cov-report=html
show_result $? "Pruebas del backend completadas"

# 3. Instalar dependencias de pruebas del frontend
echo -e "\n${BLUE}📦 Instalando dependencias de pruebas del frontend...${NC}"
cd ../Frontend
npm install --save-dev @testing-library/react-native @testing-library/jest-native @testing-library/react-hooks
show_result $? "Dependencias del frontend instaladas"

# 4. Ejecutar pruebas del frontend
echo -e "\n${BLUE}📱 Ejecutando pruebas del frontend...${NC}"
npm test -- --coverage --watchAll=false
show_result $? "Pruebas del frontend completadas"

# 5. Mostrar resumen
echo -e "\n${GREEN}🎉 TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE${NC}"
echo -e "${YELLOW}📊 Reportes de cobertura generados:${NC}"
echo -e "   - Backend: Backend/htmlcov/index.html"
echo -e "   - Frontend: Frontend/coverage/lcov-report/index.html"

echo -e "\n${BLUE}📋 Resumen de pruebas:${NC}"
echo -e "   ✅ Modelos y validaciones"
echo -e "   ✅ Rutas de API"
echo -e "   ✅ Sistema de chibis"
echo -e "   ✅ Aislamiento de usuarios"
echo -e "   ✅ Servicios del frontend"
echo -e "   ✅ Hooks y componentes"
echo -e "   ✅ Pruebas de integración"
echo -e "   ✅ Manejo de errores"

echo -e "\n${GREEN}🚀 El proyecto está listo para producción!${NC}"

