import os
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="AVELIA Backend")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
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
def get_products():
    return PRODUCTS

@app.post("/chat")
def chat(request: ChatRequest):
    message = request.message.lower()
    if "material" in message:
        return {"response": "Avelia garments are crafted from Italian silk and hand-sourced cashmere."}
    
    # Generic high-end response for other messages
    return {"response": "Welcome to Avelia. Our concierge is currently assisting other patrons. Please leave a detailed inquiry and we will attend to you shortly."}

@app.post("/contact-submit")
def contact_submit(request: ContactRequest):
    # In a real app, save to DB or send an email
    return {"status": "success", "message": f"Thank you, {request.name}. Your inquiry has been received by our concierge."}

# Mount the frontend static files at the root
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.isdir(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port)