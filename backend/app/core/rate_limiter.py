from fastapi import HTTPException, Request
import time

requests = {}

def rate_limit(request: Request):
    ip = request.client.host
    now = time.time()

    if ip not in requests:
        requests[ip] = []

    requests[ip] = [t for t in requests[ip] if now - t < 60]

    if len(requests[ip]) > 5:
        raise HTTPException(status_code=429, detail="Too many requests")

    requests[ip].append(now)