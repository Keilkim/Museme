from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class User:
    id: int
    email: str
    password_hash: str
    created_at: datetime

@dataclass
class Product:
    id: int
    name: str
    code: str
    material: Optional[str]
    buy_price: int
    rent_price: Optional[int]
    theme: str
    category: str
    thumbnail: Optional[str]
    main_image: Optional[str]
    description: Optional[str]
    detail_images: List[str] = None
    wearing_shots: List[str] = None
    created_at: datetime = None

@dataclass
class ProductImage:
    id: int
    product_id: int
    image_url: str
    image_type: str  # 'detail' or 'wearing'
