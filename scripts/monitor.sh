#!/bin/bash

# Healix Monitoring Script
# Usage: ./scripts/monitor.sh [command]
# Commands: status, health, logs, metrics, alerts

set -e

COMMAND=${1:-status}
NAMESPACE=${2:-default}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    printf "${BLUE}[INFO]${NC} %s\n" "$1"
}

print_success() {
    printf "${GREEN}[SUCCESS]${NC} %s\n" "$1"
}

print_warning() {
    printf "${YELLOW}[WARNING]${NC} %s\n" "$1"
}

print_error() {
    printf "${RED}[ERROR]${NC} %s\n" "$1"
}

# Function to check cluster status
check_cluster_status() {
    print_status "Checking Kubernetes cluster status..."

    if ! kubectl cluster-info >/dev/null 2>&1; then
        print_error "Cannot connect to Kubernetes cluster"
        return 1
    fi

    print_success "Kubernetes cluster is accessible"
}

# Function to check Healix deployment status
check_deployment_status() {
    print_status "Checking Healix deployment status..."

    # Check if namespace exists
    if ! kubectl get namespace ${NAMESPACE} >/dev/null 2>&1; then
        print_error "Namespace '${NAMESPACE}' does not exist"
        return 1
    fi

    # Check deployment status
    DEPLOYMENT_STATUS=$(kubectl get deployment healix -n ${NAMESPACE} -o jsonpath='{.status.conditions[?(@.type=="Available")].status}' 2>/dev/null || echo "False")

    if [[ "${DEPLOYMENT_STATUS}" != "True" ]]; then
        print_error "Healix deployment is not healthy"
        kubectl get pods -n ${NAMESPACE} --field-selector=status.phase!=Running
        return 1
    fi

    print_success "Healix deployment is healthy"

    # Show pod status
    kubectl get pods -n ${NAMESPACE} --sort-by=.metadata.creationTimestamp | tail -5
}

# Function to check application health
check_health() {
    print_status "Checking application health..."

    # Get service IP
    SERVICE_IP=$(kubectl get svc healix-service -n ${NAMESPACE} -o jsonpath='{.spec.clusterIP}' 2>/dev/null)

    if [[ -z "${SERVICE_IP}" ]]; then
        print_error "Cannot find Healix service"
        return 1
    fi

    # Perform health check
    if kubectl run health-check --image=curlimages/curl --rm -i --restart=Never -- curl -f --max-time 10 http://${SERVICE_IP}/health >/dev/null 2>&1; then
        print_success "Application health check passed"
    else
        print_error "Application health check failed"
        return 1
    fi
}

# Function to show recent logs
show_logs() {
    print_status "Showing recent application logs..."

    # Get the latest pod
    LATEST_POD=$(kubectl get pods -n ${NAMESPACE} -l app=healix --sort-by=.metadata.creationTimestamp -o jsonpath='{.items[-1].metadata.name}' 2>/dev/null)

    if [[ -z "${LATEST_POD}" ]]; then
        print_error "No Healix pods found"
        return 1
    fi

    echo "Logs from pod: ${LATEST_POD}"
    kubectl logs ${LATEST_POD} -n ${NAMESPACE} --tail=50
}

# Function to show metrics
show_metrics() {
    print_status "Showing application metrics..."

    # Check if Prometheus is available
    if kubectl get svc prometheus-service -n monitoring >/dev/null 2>&1; then
        PROMETHEUS_IP=$(kubectl get svc prometheus-service -n monitoring -o jsonpath='{.spec.clusterIP}')
        print_success "Prometheus available at: http://${PROMETHEUS_IP}:9090"

        # Show some basic metrics
        print_status "Current pod resource usage:"
        kubectl top pods -n ${NAMESPACE} 2>/dev/null || print_warning "Metrics server not available"
    else
        print_warning "Prometheus not found in monitoring namespace"
    fi

    # Show basic Kubernetes metrics
    print_status "Pod status summary:"
    kubectl get pods -n ${NAMESPACE} --no-headers | awk '{print $3}' | sort | uniq -c
}

# Function to check for alerts
check_alerts() {
    print_status "Checking for active alerts..."

    # This would integrate with AlertManager if configured
    print_warning "AlertManager integration not yet configured"

    # Basic checks
    print_status "Checking for pod restarts..."
    kubectl get pods -n ${NAMESPACE} --no-headers -o custom-columns=NAME:.metadata.name,RESTARTS:.status.containerStatuses[0].restartCount | grep -v " 0$"

    print_status "Checking for failed pods..."
    kubectl get pods -n ${NAMESPACE} --field-selector=status.phase!=Running,status.phase!=Succeeded
}

# Main execution
case ${COMMAND} in
    status)
        check_cluster_status
        check_deployment_status
        check_health
        ;;
    health)
        check_health
        ;;
    logs)
        show_logs
        ;;
    metrics)
        show_metrics
        ;;
    alerts)
        check_alerts
        ;;
    *)
        echo "Usage: $0 {status|health|logs|metrics|alerts} [namespace]"
        echo "Commands:"
        echo "  status   - Show overall system status"
        echo "  health   - Check application health"
        echo "  logs     - Show recent application logs"
        echo "  metrics  - Show system metrics"
        echo "  alerts   - Check for active alerts"
        exit 1
        ;;
esac