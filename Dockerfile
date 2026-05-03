FROM python:3.11-slim

WORKDIR /app

# 1. Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy the actual folders (This is where your images live!)
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# 3. Expose the port
EXPOSE 8080

# 4. Start the server
# Note: we use backend.main:app because main.py is inside the backend folder
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]