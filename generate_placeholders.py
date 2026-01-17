"""
플레이스홀더 이미지 생성 스크립트
PIL을 사용해 JPG 형식으로 더미 이미지를 생성합니다.
"""
import os

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("PIL 라이브러리가 필요합니다. 설치 중...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'Pillow'])
    from PIL import Image, ImageDraw, ImageFont

# 테마별 색상 (RGB)
THEME_COLORS = {
    'traditional': (139, 69, 19),    # 갈색 (한국 전통)
    'daily': (107, 142, 35),         # 올리브 (일상)
    'princess': (255, 105, 180),     # 핑크 (공주왕자)
    'party': (255, 215, 0),          # 골드 (파티)
    'idol': (147, 112, 219),         # 보라 (아이돌)
    'country': (70, 130, 180),       # 파랑 (국가별)
}

# 카테고리 이름
CATEGORIES = ['earring', 'necklace', 'ring', 'bracelet', 'hairpin', 'etc']
CATEGORY_NAMES_KR = {
    'earring': '귀걸이',
    'necklace': '목걸이',
    'ring': '반지',
    'bracelet': '팔찌',
    'hairpin': '머리장식',
    'etc': '기타',
}

THEME_NAMES_KR = {
    'traditional': '전통',
    'daily': '데일리',
    'princess': '공주왕자',
    'party': '파티',
    'idol': '아이돌',
    'country': '국가별',
}

def get_font(size=30):
    """폰트 로드 (시스템 폰트 사용)"""
    font_paths = [
        "C:/Windows/Fonts/malgun.ttf",      # 맑은 고딕
        "C:/Windows/Fonts/gulim.ttc",        # 굴림
        "C:/Windows/Fonts/arial.ttf",        # Arial
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",  # Linux
    ]
    for font_path in font_paths:
        if os.path.exists(font_path):
            try:
                return ImageFont.truetype(font_path, size)
            except:
                continue
    return ImageFont.load_default()

def create_gradient_image(width, height, color1, color2):
    """그라데이션 이미지 생성"""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)

    for y in range(height):
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    return img

def create_category_image(width, height, bg_color, theme_name, category_name):
    """카테고리 이미지 생성"""
    # 그라데이션 배경
    darker_color = tuple(max(0, c - 40) for c in bg_color)
    img = create_gradient_image(width, height, bg_color, darker_color)
    draw = ImageDraw.Draw(img)

    # 중앙에 원 그리기
    center_x, center_y = width // 2, height // 2 - 30
    radius = min(width, height) // 4
    draw.ellipse(
        [center_x - radius, center_y - radius, center_x + radius, center_y + radius],
        outline=(255, 255, 255, 180),
        width=3
    )
    draw.ellipse(
        [center_x - radius + 20, center_y - radius + 20, center_x + radius - 20, center_y + radius - 20],
        outline=(255, 255, 255, 100),
        width=2
    )

    # 카테고리 텍스트
    font_large = get_font(36)
    font_small = get_font(24)

    # 카테고리명
    text = category_name
    bbox = draw.textbbox((0, 0), text, font=font_large)
    text_width = bbox[2] - bbox[0]
    draw.text(
        ((width - text_width) // 2, height // 2 + 50),
        text,
        fill=(255, 255, 255),
        font=font_large
    )

    # 테마명
    bbox = draw.textbbox((0, 0), theme_name, font=font_small)
    text_width = bbox[2] - bbox[0]
    draw.text(
        ((width - text_width) // 2, height - 50),
        theme_name,
        fill=(255, 255, 255, 180),
        font=font_small
    )

    return img

def create_hero_image(width, height, bg_color, theme_name):
    """히어로 이미지 생성"""
    darker_color = tuple(max(0, c - 60) for c in bg_color)
    img = create_gradient_image(width, height, bg_color, darker_color)
    draw = ImageDraw.Draw(img)

    font_large = get_font(72)
    font_small = get_font(32)

    # 테마명
    bbox = draw.textbbox((0, 0), theme_name, font=font_large)
    text_width = bbox[2] - bbox[0]
    draw.text(
        ((width - text_width) // 2, height // 2 - 50),
        theme_name,
        fill=(255, 255, 255),
        font=font_large
    )

    # COLLECTION
    text = "COLLECTION"
    bbox = draw.textbbox((0, 0), text, font=font_small)
    text_width = bbox[2] - bbox[0]
    draw.text(
        ((width - text_width) // 2, height // 2 + 40),
        text,
        fill=(255, 255, 255, 180),
        font=font_small
    )

    return img

def create_banner_image(width, height, number):
    """배너 이미지 생성"""
    colors = [
        (227, 36, 28),   # #E3241C
        (216, 43, 31),   # #D82B1F
        (196, 30, 26),
        (179, 27, 23),
        (162, 24, 20),
    ]
    color = colors[(number - 1) % len(colors)]
    bg_color = (230, 226, 216)  # #E6E2D8

    img = create_gradient_image(width, height, color, bg_color)
    draw = ImageDraw.Draw(img)

    font_large = get_font(64)
    font_medium = get_font(32)
    font_small = get_font(24)

    # MUSEME
    text = "MUSEME"
    bbox = draw.textbbox((0, 0), text, font=font_large)
    text_width = bbox[2] - bbox[0]
    draw.text(
        ((width - text_width) // 2, height // 3 - 30),
        text,
        fill=(255, 255, 255),
        font=font_large
    )

    # 배너 번호
    text = f"배너 {number}"
    bbox = draw.textbbox((0, 0), text, font=font_medium)
    text_width = bbox[2] - bbox[0]
    draw.text(
        ((width - text_width) // 2, height // 2),
        text,
        fill=(255, 255, 255, 230),
        font=font_medium
    )

    # 서브 텍스트
    text = "프리미엄 주얼리 컬렉션"
    bbox = draw.textbbox((0, 0), text, font=font_small)
    text_width = bbox[2] - bbox[0]
    draw.text(
        ((width - text_width) // 2, height // 2 + 60),
        text,
        fill=(255, 255, 255, 180),
        font=font_small
    )

    return img

def create_product_image(width, height, number):
    """제품 이미지 생성"""
    bg_color = (238, 235, 225)  # #EEEBE1
    accent_color = (227, 36, 28)  # #E3241C

    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # 주얼리 아이콘 (원)
    center_x, center_y = width // 2, height // 2 - 30
    draw.ellipse(
        [center_x - 80, center_y - 80, center_x + 80, center_y + 80],
        outline=accent_color,
        width=4
    )
    draw.ellipse(
        [center_x - 60, center_y - 60, center_x + 60, center_y + 60],
        outline=(216, 43, 31),
        width=2
    )

    font_large = get_font(28)
    font_small = get_font(18)

    # 제품명
    text = f"제품 {number}"
    bbox = draw.textbbox((0, 0), text, font=font_large)
    text_width = bbox[2] - bbox[0]
    draw.text(
        ((width - text_width) // 2, height * 3 // 4 - 10),
        text,
        fill=(51, 51, 51),
        font=font_large
    )

    # 제품 코드
    text = f"PROD-00{number}"
    bbox = draw.textbbox((0, 0), text, font=font_small)
    text_width = bbox[2] - bbox[0]
    draw.text(
        ((width - text_width) // 2, height * 3 // 4 + 30),
        text,
        fill=(102, 102, 102),
        font=font_small
    )

    return img

def create_logo_image(width, height):
    """로고 이미지 생성"""
    bg_color = (230, 226, 216)  # #E6E2D8
    accent_color = (227, 36, 28)  # #E3241C

    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    font = get_font(36)
    text = "MUSEME"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    draw.text(
        ((width - text_width) // 2, (height - text_height) // 2),
        text,
        fill=accent_color,
        font=font
    )

    return img

def create_about_image(width, height):
    """소개 이미지 생성"""
    bg_color = (230, 226, 216)  # #E6E2D8
    text_color = (51, 51, 51)

    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    font = get_font(48)
    text = "MUSEME 소개"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]

    draw.text(
        ((width - text_width) // 2, height // 2 - 24),
        text,
        fill=text_color,
        font=font
    )

    return img

def main():
    base_path = os.path.dirname(os.path.abspath(__file__))
    images_path = os.path.join(base_path, 'static', 'images')

    print("플레이스홀더 이미지 생성 시작...")

    # 1. 테마별 카테고리 이미지 생성
    for theme, color in THEME_COLORS.items():
        theme_path = os.path.join(images_path, 'themes', theme)
        os.makedirs(theme_path, exist_ok=True)

        theme_name_kr = THEME_NAMES_KR.get(theme, theme)

        # 카테고리별 이미지
        for category in CATEGORIES:
            category_name_kr = CATEGORY_NAMES_KR.get(category, category)
            img = create_category_image(400, 400, color, theme_name_kr, category_name_kr)

            file_path = os.path.join(theme_path, f'{category}.jpg')
            img.save(file_path, 'JPEG', quality=90)
            print(f'Created: {file_path}')

        # 히어로 이미지
        hero_img = create_hero_image(1200, 400, color, theme_name_kr)
        hero_path = os.path.join(theme_path, 'hero.jpg')
        hero_img.save(hero_path, 'JPEG', quality=90)
        print(f'Created: {hero_path}')

    # 2. 배너 이미지 생성
    banners_path = os.path.join(images_path, 'banners')
    os.makedirs(banners_path, exist_ok=True)

    for i in range(1, 6):
        banner_img = create_banner_image(1200, 500, i)
        banner_path = os.path.join(banners_path, f'banner{i}.jpg')
        banner_img.save(banner_path, 'JPEG', quality=90)
        print(f'Created: {banner_path}')

    # 3. About 이미지 생성
    about_path = os.path.join(images_path, 'about')
    os.makedirs(about_path, exist_ok=True)

    about_img = create_about_image(1200, 600)
    intro_path = os.path.join(about_path, 'intro.jpg')
    about_img.save(intro_path, 'JPEG', quality=90)
    print(f'Created: {intro_path}')

    # 4. 로고 이미지 생성
    logo_img = create_logo_image(200, 60)
    logo_path = os.path.join(images_path, 'logo.png')
    logo_img.save(logo_path, 'PNG')
    print(f'Created: {logo_path}')

    # 5. 샘플 제품 이미지 생성
    products_path = os.path.join(images_path, 'products')
    os.makedirs(products_path, exist_ok=True)

    for i in range(1, 7):
        product_img = create_product_image(400, 400, i)
        product_path = os.path.join(products_path, f'product{i}.jpg')
        product_img.save(product_path, 'JPEG', quality=90)
        print(f'Created: {product_path}')

    print('\n모든 플레이스홀더 이미지가 생성되었습니다!')

if __name__ == '__main__':
    main()
