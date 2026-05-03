FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy both frontend and backend directories
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Expose port
EXPOSE 8080

# Run uvicorn using the path to the backend module
# Change this line
WORKDIR /app
# Change this line
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]