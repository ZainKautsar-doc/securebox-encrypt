# In-memory storage / optional SQLite configuration if needed
# Benchmark and crypto operations are stateless and in-memory

class MemoryStorage:
    def __init__(self):
        self.logs = []

    def log_operation(self, op_type: str, algorithm: str):
        self.logs.append({"type": op_type, "algo": algorithm})

storage = MemoryStorage()
