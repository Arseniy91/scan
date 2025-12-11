from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

@app.get("/product/{barcode}")
def get_product(barcode: str):
    product = next((p for p in products if p["barcode"] == barcode), None)

    if not product:
        return {"found": False}

    expiry_str = product.get("expiryDate")
    try:
        expiry = datetime.fromisoformat(expiry_str)
    except:
        expiry = None

    now = datetime.now()
    is_expired = expiry is not None and expiry < now

    return {
        "found": True,
        "name": product.get("name", "Неизвестный продукт"),
        "expired": is_expired,
        "allergens": product.get("allergens", []),
        "diabetic": product.get("restrictions", {}).get("diabetic", False)
    }
