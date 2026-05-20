FROM python:3.11-slim

WORKDIR /app

# Install deps first (better layer caching)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source and CSV data
COPY backend/ .
COPY data/ ./data/

# Override CSV_DIR so loader finds files at runtime
ENV CSV_DIR=./data/

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
