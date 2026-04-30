import redis
from app.core.config import settings

redis_client = redis.from_url(settings.REDIS_URL)

def blacklist_token(token: str):
    redis_client.set(token, "blacklisted", ex=3600)

def is_blacklisted(token: str):
    return redis_client.get(token) is not None