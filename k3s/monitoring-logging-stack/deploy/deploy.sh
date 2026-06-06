#!/bin/bash
set -e

echo "Deploying monitoring stack..."

kubectl apply -f ../namespace/ns.yml
kubectl apply -f ../storage-class/expandable-local-storageclass.yml
kubectl apply -f ../pv/loki-pv.yml
kubectl apply -f ../pv/prometheus-pv.yml
kubectl apply -f ../pv/grafana-pv.yml

kubectl apply -f ../node-exporter/manifest.yml
kubectl apply -f ../prometheus/configmap.yml
kubectl apply -f ../prometheus/manifest.yml
kubectl apply -f ../loki/configmap.yml
kubectl apply -f ../loki/manifest.yml
kubectl apply -f ../promtail/configmap.yml
kubectl apply -f ../promtail/manifest.yml
kubectl apply -f ../grafana/datasources/datasources-configmap.yml
kubectl apply -f ../grafana/manifest.yml

echo "Monitoring stack deployed successfully!"
