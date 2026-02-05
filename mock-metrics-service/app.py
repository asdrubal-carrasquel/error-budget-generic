#!/usr/bin/env python3
"""
Mock Metrics Service

SRE NOTE: This service generates sample HTTP metrics in Prometheus format.
It's used for testing and demonstration purposes.

The service simulates:
- HTTP requests with different status codes
- Configurable error rate
- Realistic request patterns
"""

from flask import Flask, Response
import random
import time
import os
from threading import Lock

app = Flask(__name__)

# Metrics storage
metrics_lock = Lock()
request_counts = {
    '200': 0,
    '500': 0,
    'total': 0,
}

# Configuration
ERROR_RATE = float(os.environ.get('ERROR_RATE', '0.01'))  # 1% error rate by default

@app.route('/')
def index():
    """Simple health check endpoint"""
    return {'status': 'healthy', 'service': 'mock-metrics-service'}

@app.route('/metrics')
def metrics():
    """
    Prometheus metrics endpoint
    
    SRE NOTE: This endpoint exposes metrics in Prometheus format:
    - http_requests_total{status="200"}: Successful requests
    - http_requests_total{status="500"}: Error requests
    
    These metrics are scraped by Prometheus and used for SLI calculation.
    """
    global request_counts
    
    # Simulate some requests
    with metrics_lock:
        # Generate some requests (simulate activity)
        for _ in range(random.randint(10, 50)):
            request_counts['total'] += 1
            if random.random() > ERROR_RATE:
                request_counts['200'] += 1
            else:
                request_counts['500'] += 1
    
    # Format metrics in Prometheus format
    metrics_output = f"""# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{{status="200"}} {request_counts['200']}
http_requests_total{{status="500"}} {request_counts['500']}
http_requests_total{{status="total"}} {request_counts['total']}
"""
    
    return Response(metrics_output, mimetype='text/plain')

@app.route('/simulate-error')
def simulate_error():
    """Endpoint to temporarily increase error rate for testing"""
    global ERROR_RATE
    ERROR_RATE = min(1.0, ERROR_RATE + 0.1)
    return {'error_rate': ERROR_RATE, 'message': 'Error rate increased'}

@app.route('/simulate-recovery')
def simulate_recovery():
    """Endpoint to reduce error rate for testing"""
    global ERROR_RATE
    ERROR_RATE = max(0.0, ERROR_RATE - 0.1)
    return {'error_rate': ERROR_RATE, 'message': 'Error rate decreased'}

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
