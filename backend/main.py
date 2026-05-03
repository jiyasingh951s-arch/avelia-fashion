import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="AVELIA Backend")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ContactRequest(BaseModel):
    name: str
    email: str
    inquiry: str

# Mock data for products
PRODUCTS = [
    {
        "id": "1",
        "name": "Obsidian Silk Evening Gown",
        "price": 2400.00,
        "imageUrl": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600",
    },
    {
        "id": "2",
        "name": "Pure Cashmere Overcoat",
        "price": 3150.00,
        "imageUrl": "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600",
    },
    {
        "id": "3",
        "name": "Avelia Signature Leather Tote",
        "price": 1850.00,
        "imageUrl": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600",
    },
    {
        "id": "4",
        "name": "Champagne Gold Cascade Necklace",
        "price": 4200.00,
        "imageUrl": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600",
    }
]

@app.get("/products")
async def get_products():
    return PRODUCTS

@app.post("/chat")
async def chat(request: ChatRequest):
    message = request.message.lower()
    if "material" in message:
        return {"response": "Avelia garments are crafted from Italian silk and hand-sourced cashmere."}
    
    return {"response": "Welcome to Avelia. Our concierge is currently assisting other patrons. Please leave a detailed inquiry and we will attend to you shortly."}

@app.post("/contact-submit")
async def contact_submit(request: ContactRequest):
    return {"status": "success", "message": f"Thank you, {request.name}. Your inquiry has been received."}

# --- STATIC FILES FIX ---
# This looks for the frontend folder in the same directory as the backend folder
current_dir = os.path.dirname(os.path.abspath(__file__)) # /app/backend
base_dir = os.path.dirname(current_dir) # /app
frontend_path = os.path.join(base_dir, "frontend")

if os.path.isdir(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)