"""Seed What's New editorial content and the BrosCafé Collection products."""
import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv(Path(__file__).parent / ".env")
db = MongoClient(os.environ["MONGO_URL"])[os.environ["DB_NAME"]]

WHATS_NEW = [
    {
        "id": "pistachio-latte", "order": 1, "kind": "drink",
        "title_en": "Pistachio Latte", "title_hu": "Pisztácia Latte",
        "blurb_en": "Creamy espresso with pistachio and steamed milk.",
        "blurb_hu": "Krémes eszpresszó pisztáciával és gőzölt tejjel.",
        "body_en": "Our newest seasonal pour: a smooth double shot balanced with house-made pistachio and silky steamed milk. Nutty, warm, and just sweet enough.",
        "body_hu": "Legújabb szezonális kávénk: lágy dupla eszpresszó saját készítésű pisztáciakrémmel és selymes gőzölt tejjel. Diós, meleg és épp csak annyira édes.",
        "image": "https://images.unsplash.com/photo-1770282184778-f474bd3a379a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    },
    {
        "id": "almond-croissant", "order": 2, "kind": "pastry",
        "title_en": "Almond Croissant", "title_hu": "Mandulás Croissant",
        "blurb_en": "Buttery, flaky, baked fresh every morning.",
        "blurb_hu": "Vajas, leveles, minden reggel frissen sütve.",
        "body_en": "Layered by hand and filled with almond frangipane, then dusted with toasted flakes. Best enjoyed warm with a flat white.",
        "body_hu": "Kézzel hajtogatva, mandulás frangipane töltelékkel, pirított mandulapehellyel megszórva. Melegen, egy flat white mellé a legjobb.",
        "image": "https://images.unsplash.com/photo-1623334044303-241021148842?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    },
]

PRODUCTS = [
    {
        "id": "house-blend-beans", "order": 1,
        "name_en": "House Blend Beans", "name_hu": "Házi Keverék Szemeskávé",
        "desc_en": "Our signature medium roast — chocolate, hazelnut, a soft citrus finish. Whole bean, 250g.",
        "desc_hu": "Jellegzetes közepes pörkölésünk — csokoládé, mogyoró, lágy citrusos lecsengéssel. Szemes, 250g.",
        "price": 14.0, "options": ["Whole bean", "Ground"],
        "image": "https://images.unsplash.com/photo-1701256406754-22fa4c84f3ff?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    },
    {
        "id": "ceramic-mug", "order": 2,
        "name_en": "BrosCafé Ceramic Mug", "name_hu": "BrosCafé Kerámia Bögre",
        "desc_en": "A hefty stoneware mug that keeps coffee warm and feels good in the hand. 350ml.",
        "desc_hu": "Masszív kőagyag bögre, ami melegen tartja a kávét és jól fekszik a kézben. 350ml.",
        "price": 18.0, "options": ["Cream", "Olive"],
        "image": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    },
    {
        "id": "canvas-tote", "order": 3,
        "name_en": "BrosCafé Canvas Tote", "name_hu": "BrosCafé Vászontáska",
        "desc_en": "Heavyweight natural cotton tote with a minimal BrosCafé mark. Everyday carry.",
        "desc_hu": "Vastag, natúr pamut táska minimál BrosCafé jelzéssel. Mindennapi használatra.",
        "price": 22.0, "options": ["Natural"],
        "image": "https://images.unsplash.com/photo-1630381260512-e3fe55c11973?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    },
]

db.content.delete_many({})
db.products.delete_many({})
db.content.insert_many(WHATS_NEW)
db.products.insert_many(PRODUCTS)
print(f"Seeded {len(WHATS_NEW)} content items, {len(PRODUCTS)} products")
