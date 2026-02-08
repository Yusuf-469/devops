#!/bin/bash
# Vercel build wrapper script
cd "$(dirname "$0")"
npx vite build
