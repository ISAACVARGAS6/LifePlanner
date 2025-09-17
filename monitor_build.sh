#!/bin/bash

echo "🚀 Monitoreando build de LifePlanner..."
echo "📱 Build ID: 8c2bf79e-75ce-4a9a-894b-017b1b1b15ab"
echo "⏱️  Tiempo estimado: 10-20 minutos (Free Tier)"
echo ""

# Función para verificar el estado
check_build_status() {
    echo "🔄 Verificando estado... $(date '+%H:%M:%S')"
    eas build:list --limit 1 --non-interactive | grep -E "(Status|Finished at|Build Artifacts URL)"
    echo ""
}

# Verificar cada 2 minutos
while true; do
    check_build_status
    
    # Verificar si el build está completo
    STATUS=$(eas build:list --limit 1 --non-interactive | grep "Status" | awk '{print $2}')
    
    if [ "$STATUS" = "finished" ]; then
        echo "🎉 ¡Build completado!"
        echo "📥 Descargando AAB..."
        eas build:download 8c2bf79e-75ce-4a9a-894b-017b1b1b15ab
        echo "✅ ¡AAB descargado exitosamente!"
        break
    elif [ "$STATUS" = "errored" ]; then
        echo "❌ Build falló. Revisa los logs:"
        echo "🔗 https://expo.dev/accounts/isaacvc/projects/lifeplanner/builds/8c2bf79e-75ce-4a9a-894b-017b1b1b15ab"
        break
    else
        echo "⏳ Build en progreso... Esperando 2 minutos"
        sleep 120
    fi
done

