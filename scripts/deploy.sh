#!/bin/bash

# Healix Deployment Script
# Usage: ./scripts/deploy.sh [environment] [version]
# Example: ./scripts/deploy.sh production v1.2.3

set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}
NAMESPACE=${ENVIRONMENT}

echo "🚀 Deploying Healix to ${ENVIRONMENT} environment"
echo "📦 Version: ${VERSION}"
echo "🌐 Namespace: ${NAMESPACE}"

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo "❌ Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

# Check if kubectl is configured
if ! kubectl cluster-info >/dev/null 2>&1; then
    echo "❌ kubectl is not configured or cluster is not accessible"
    exit 1
fi

# Create namespace if it doesn't exist
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

# Update image version in kustomization
cd k8s
kustomize edit set image healix=ghcr.io/${GITHUB_REPOSITORY:-your-org/healix}:${VERSION}

# Apply Kubernetes manifests
echo "📋 Applying Kubernetes manifests..."
kubectl apply -k . -n ${NAMESPACE}

# Wait for rollout to complete
echo "⏳ Waiting for deployment to be ready..."
kubectl rollout status deployment/healix -n ${NAMESPACE} --timeout=300s

# Run health check
echo "🏥 Running health checks..."
HEALTH_CHECK_URL=$(kubectl get svc healix-service -n ${NAMESPACE} -o jsonpath='{.spec.clusterIP}')
if kubectl run health-check --image=curlimages/curl --rm -i --restart=Never -- curl -f --max-time 10 http://${HEALTH_CHECK_URL}/health; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    exit 1
fi

# Get service URL
SERVICE_URL=$(kubectl get svc healix-service -n ${NAMESPACE} -o jsonpath='{.spec.clusterIP}')
echo "🎉 Deployment successful!"
echo "🌐 Service available at: http://${SERVICE_URL}"
echo "📊 Check Grafana dashboard for metrics: http://grafana-service.monitoring.svc.cluster.local:3000"