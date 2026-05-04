#!/bin/bash

# Healix Backup Script
# Usage: ./scripts/backup.sh [type]
# Types: config, logs, database, full

set -e

BACKUP_TYPE=${1:-full}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups/${TIMESTAMP}"
BACKUP_FILE="healix_backup_${BACKUP_TYPE}_${TIMESTAMP}.tar.gz"

echo "💾 Creating Healix backup: ${BACKUP_TYPE}"
echo "📁 Backup directory: ${BACKUP_DIR}"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Function to backup Kubernetes resources
backup_k8s() {
    echo "📋 Backing up Kubernetes resources..."
    mkdir -p ${BACKUP_DIR}/k8s

    # Backup all resources in healix namespace
    kubectl get all -n healix -o yaml > ${BACKUP_DIR}/k8s/resources.yaml
    kubectl get configmaps -n healix -o yaml > ${BACKUP_DIR}/k8s/configmaps.yaml
    kubectl get secrets -n healix -o yaml > ${BACKUP_DIR}/k8s/secrets.yaml
    kubectl get ingresses -n healix -o yaml > ${BACKUP_DIR}/k8s/ingress.yaml
}

# Function to backup configuration files
backup_config() {
    echo "⚙️ Backing up configuration files..."
    mkdir -p ${BACKUP_DIR}/config

    # Copy important config files (excluding secrets)
    cp docker-compose.yml ${BACKUP_DIR}/config/
    cp docker-compose.override.yml.example ${BACKUP_DIR}/config/
    cp -r k8s/ ${BACKUP_DIR}/config/
    cp -r monitoring/ ${BACKUP_DIR}/config/
    cp .env.example ${BACKUP_DIR}/config/
    cp package.json ${BACKUP_DIR}/config/
}

# Function to backup logs
backup_logs() {
    echo "📜 Backing up application logs..."
    mkdir -p ${BACKUP_DIR}/logs

    # Get pod logs
    for pod in $(kubectl get pods -n healix -o jsonpath='{.items[*].metadata.name}'); do
        kubectl logs ${pod} -n healix --since=24h > ${BACKUP_DIR}/logs/${pod}.log 2>/dev/null || echo "No logs for ${pod}"
    done
}

# Function to backup monitoring data
backup_monitoring() {
    echo "📊 Backing up monitoring configuration..."
    mkdir -p ${BACKUP_DIR}/monitoring

    # Backup Grafana dashboards and datasources
    kubectl get configmaps -n monitoring -o yaml > ${BACKUP_DIR}/monitoring/configmaps.yaml
}

# Execute backup based on type
case ${BACKUP_TYPE} in
    config)
        backup_config
        ;;
    logs)
        backup_logs
        ;;
    monitoring)
        backup_monitoring
        ;;
    full)
        backup_config
        backup_k8s
        backup_logs
        backup_monitoring
        ;;
    *)
        echo "❌ Invalid backup type. Use: config, logs, monitoring, or full"
        exit 1
        ;;
esac

# Create compressed archive
echo "📦 Creating compressed backup archive..."
tar -czf ${BACKUP_FILE} -C ${BACKUP_DIR} .

# Calculate backup size
BACKUP_SIZE=$(du -h ${BACKUP_FILE} | cut -f1)
echo "✅ Backup completed successfully!"
echo "📁 Backup file: ${BACKUP_FILE}"
echo "📏 Size: ${BACKUP_SIZE}"

# Cleanup temporary directory
rm -rf ${BACKUP_DIR}

# Optional: Upload to cloud storage (uncomment and configure)
# echo "☁️ Uploading to cloud storage..."
# aws s3 cp ${BACKUP_FILE} s3://your-backup-bucket/${BACKUP_FILE}
# or
# gsutil cp ${BACKUP_FILE} gs://your-backup-bucket/${BACKUP_FILE}

echo "🎉 Backup process completed!"