import time

class SimpleTTLCache:
    def __init__(self, ttl=300):
        self.ttl = ttl
        self.cache = {}

    def get(self, key):
        if key in self.cache:
            item, exp = self.cache[key]
            if time.time() < exp:
                return item
            else:
                del self.cache[key]
        return None

    def set(self, key, value):
        self.cache[key] = (value, time.time() + self.ttl)

cache = SimpleTTLCache()
