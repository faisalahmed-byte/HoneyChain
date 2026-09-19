import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs(r"c:\honey-chain\assets", exist_ok=True)

# Helper to get default font or truetype font
def get_font(size, bold=False):
    font_names = [
        "arialbd.ttf" if bold else "arial.ttf",
        "seguiemj.ttf",
        "tahoma.ttf",
        "calibri.ttf"
    ]
    for fn in font_names:
        try:
            return ImageFont.truetype(fn, size)
        except:
            continue
    return ImageFont.load_default()

# 1. Generate Architecture Flow Diagram (1000 x 420 px)
def create_architecture_diagram():
    w, h = 1000, 420
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Background box
    draw.rounded_rectangle([(0, 0), (w, h)], radius=16, fill=(255, 255, 255, 240), outline=(226, 232, 240, 255), width=2)

    font_title = get_font(20, bold=True)
    font_sub = get_font(13, bold=False)
    font_node_title = get_font(15, bold=True)
    font_node_sub = get_font(12, bold=False)
    font_badge = get_font(11, bold=True)

    # Box 1: Smart Hives
    draw.rounded_rectangle([(30, 60), (220, 360)], radius=12, fill=(254, 243, 199, 255), outline=(217, 119, 6, 255), width=2)
    draw.text((125, 90), "[HIVE] SMART HIVES", fill=(180, 83, 9), font=font_node_title, anchor="mm")
    draw.text((125, 120), "Arduino Uno R3", fill=(30, 41, 59), font=font_node_title, anchor="mm")
    draw.text((125, 145), "• DHT22 (Pin 7)", fill=(71, 85, 105), font=font_node_sub, anchor="mm")
    draw.text((125, 170), "• 16x2 LCD Output", fill=(71, 85, 105), font=font_node_sub, anchor="mm")
    draw.text((125, 195), "• Temp (32-35°C)", fill=(71, 85, 105), font=font_node_sub, anchor="mm")
    draw.text((125, 220), "• Humidity (55-65%)", fill=(71, 85, 105), font=font_node_sub, anchor="mm")
    
    # Hive sub-nodes representation
    draw.rounded_rectangle([(50, 255), (200, 295)], radius=6, fill=(253, 230, 138), outline=(245, 158, 11))
    draw.text((125, 275), "Node #1: Active Live", fill=(146, 64, 14), font=font_badge, anchor="mm")
    draw.rounded_rectangle([(50, 305), (200, 345)], radius=6, fill=(254, 240, 138), outline=(245, 158, 11))
    draw.text((125, 325), "Node #2: Hive Cluster", fill=(146, 64, 14), font=font_badge, anchor="mm")

    # Arrow 1 -> 2
    draw.line([(220, 210), (280, 210)], fill=(37, 99, 235), width=4)
    draw.polygon([(280, 204), (292, 210), (280, 216)], fill=(37, 99, 235))
    draw.text((256, 195), "COM6", fill=(37, 99, 235), font=font_badge, anchor="mm")

    # Box 2: Edge Gateway
    draw.rounded_rectangle([(295, 110), (455, 310)], radius=12, fill=(240, 249, 255), outline=(2, 132, 199), width=2)
    draw.text((375, 140), "EDGE GATEWAY", fill=(3, 105, 161), font=font_node_title, anchor="mm")
    draw.text((375, 170), "Python Serial Daemon", fill=(15, 23, 42), font=font_node_sub, anchor="mm")
    draw.text((375, 195), "• 9600 Baud USB", fill=(71, 85, 105), font=font_node_sub, anchor="mm")
    draw.text((375, 220), "• Auto-Reconnect", fill=(71, 85, 105), font=font_node_sub, anchor="mm")
    draw.text((375, 245), "• Dual-Ingest Engine", fill=(71, 85, 105), font=font_node_sub, anchor="mm")
    draw.text((375, 275), "Local Sync + Cloud Ingest", fill=(2, 132, 199), font=font_badge, anchor="mm")

    # Arrow 2 -> 3 (Split to Cloud and Blockchain)
    draw.line([(455, 190), (515, 150)], fill=(5, 150, 105), width=3)
    draw.polygon([(512, 144), (524, 144), (518, 156)], fill=(5, 150, 105))
    draw.line([(455, 230), (515, 270)], fill=(99, 102, 241), width=3)
    draw.polygon([(512, 276), (524, 276), (518, 264)], fill=(99, 102, 241))

    # Box 3A: Cloud & AI Services (Top)
    draw.rounded_rectangle([(525, 60), (745, 210)], radius=12, fill=(236, 253, 245), outline=(16, 185, 129), width=2)
    draw.text((635, 85), "CLOUD & AI SERVICES", fill=(4, 120, 87), font=font_node_title, anchor="mm")
    draw.text((635, 110), "Supabase PostgreSQL", fill=(15, 23, 42), font=font_node_sub, anchor="mm")
    draw.text((635, 135), "Node.js Express REST API", fill=(71, 85, 105), font=font_node_sub, anchor="mm")
    draw.text((635, 160), "ai-engine.js Diagnostics", fill=(4, 120, 87), font=font_node_title, anchor="mm")
    draw.text((635, 185), "Health (25-99%) • Stress • Yield", fill=(100, 116, 139), font=font_node_sub, anchor="mm")

    # Box 3B: Blockchain Ledger (Bottom)
    draw.rounded_rectangle([(525, 225), (745, 375)], radius=12, fill=(238, 242, 255), outline=(99, 102, 241), width=2)
    draw.text((635, 250), "BLOCKCHAIN LEDGER", fill=(67, 56, 202), font=font_node_title, anchor="mm")
    draw.text((635, 275), "SHA-256 Cryptographic Chain", fill=(15, 23, 42), font=font_node_sub, anchor="mm")
    draw.text((635, 300), "Immutable Genesis-to-Jar", fill=(71, 85, 105), font=font_node_sub, anchor="mm")
    draw.text((635, 325), "Tamper Detection Engine", fill=(67, 56, 202), font=font_node_sub, anchor="mm")
    draw.text((635, 350), "Zero Gas Cost Enterprise Audit", fill=(100, 116, 139), font=font_node_sub, anchor="mm")

    # Arrows 3A & 3B -> 4
    draw.line([(745, 140), (800, 180)], fill=(30, 41, 59), width=3)
    draw.polygon([(795, 174), (808, 185), (803, 192)], fill=(30, 41, 59))
    draw.line([(745, 290), (800, 240)], fill=(30, 41, 59), width=3)
    draw.polygon([(795, 246), (808, 235), (803, 228)], fill=(30, 41, 59))

    # Box 4: Web Application & Consumer Portals
    draw.rounded_rectangle([(810, 80), (970, 340)], radius=12, fill=(248, 250, 252), outline=(15, 23, 42), width=2)
    draw.text((890, 110), "APPS & PORTAL", fill=(15, 23, 42), font=font_node_title, anchor="mm")
    draw.text((890, 145), "React 19 Dashboard", fill=(37, 99, 235), font=font_node_sub, anchor="mm")
    draw.text((890, 175), "Beekeeper Telemetry", fill=(71, 85, 105), font=font_node_sub, anchor="mm")
    draw.text((890, 205), "FSSAI Lab QA Portal", fill=(71, 85, 105), font=font_node_sub, anchor="mm")
    draw.text((890, 235), "Interactive Tamper Demo", fill=(71, 85, 105), font=font_node_sub, anchor="mm")
    draw.text((890, 265), "Consumer QR Passport", fill=(217, 119, 6), font=font_node_sub, anchor="mm")
    draw.rounded_rectangle([(825, 290), (955, 325)], radius=6, fill=(15, 23, 42))
    draw.text((890, 307), "Vercel + Local Cloud", fill=(255, 255, 255), font=font_badge, anchor="mm")

    img.save(r"c:\honey-chain\assets\arch_diagram.png", "PNG")
    print("arch_diagram.png created")

# 2. Generate Beekeeper Dashboard Mobile Mockup (340 x 640 px)
def create_beekeeper_mockup():
    w, h = 340, 640
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Phone outer frame
    draw.rounded_rectangle([(4, 4), (w-4, h-4)], radius=36, fill=(15, 23, 42), outline=(51, 65, 85), width=4)
    # Inner screen
    draw.rounded_rectangle([(14, 14), (w-14, h-14)], radius=28, fill=(248, 250, 252))

    # Phone notch
    draw.rounded_rectangle([(w//2 - 45, 18), (w//2 + 45, 36)], radius=9, fill=(15, 23, 42))

    font_xs = get_font(10, bold=False)
    font_sm = get_font(12, bold=False)
    font_bold_sm = get_font(12, bold=True)
    font_md = get_font(15, bold=True)
    font_lg = get_font(20, bold=True)
    font_xl = get_font(24, bold=True)

    # Status bar
    draw.text((36, 26), "09:41", fill=(15, 23, 42), font=font_xs, anchor="lm")
    draw.text((w-36, 26), "5G 100%", fill=(15, 23, 42), font=font_xs, anchor="rm")

    # App Header
    draw.text((28, 62), "Honey Chain", fill=(15, 23, 42), font=font_lg)
    draw.text((28, 86), "Beekeeper Live Portal", fill=(100, 116, 139), font=font_xs)

    # Live Badge
    draw.rounded_rectangle([(w-95, 60), (w-28, 84)], radius=6, fill=(220, 252, 231))
    draw.text((w-61, 72), "[LIVE SYNC]", fill=(22, 101, 52), font=font_xs, anchor="mm")

    # Telemetry Card 1 (Temp & Humidity)
    draw.rounded_rectangle([(24, 108), (w-24, 215)], radius=14, fill=(255, 255, 255), outline=(226, 232, 240))
    draw.text((40, 126), "HIVE #1 BROOD TELEMETRY", fill=(100, 116, 139), font=font_xs)
    
    # Temp
    draw.text((40, 160), "34.2°C", fill=(217, 119, 6), font=font_xl)
    draw.text((40, 185), "Normal (32-35.5°C)", fill=(5, 150, 105), font=font_xs)

    # Divider
    draw.line([(w//2, 140), (w//2, 195)], fill=(226, 232, 240), width=1)

    # Humidity
    draw.text((w//2 + 20, 160), "58.4%", fill=(37, 99, 235), font=font_xl)
    draw.text((w//2 + 20, 185), "Optimal Balance", fill=(5, 150, 105), font=font_xs)

    # AI Health Card
    draw.rounded_rectangle([(24, 225), (w-24, 340)], radius=14, fill=(236, 253, 245), outline=(16, 185, 129))
    draw.text((40, 245), "AI COLONY HEALTH ENGINE", fill=(4, 120, 87), font=font_bold_sm)
    draw.text((40, 280), "94%", fill=(5, 150, 105), font=font_xl)
    draw.text((105, 280), "EXCELLENT", fill=(6, 95, 70), font=font_md)
    draw.text((40, 310), "Stress Risk: 6% | Productivity: HIGH [UP]", fill=(4, 120, 87), font=font_xs)

    # Harvest Forecast Card
    draw.rounded_rectangle([(24, 350), (w-24, 445)], radius=14, fill=(254, 243, 199), outline=(245, 158, 11))
    draw.text((40, 370), "PREDICTIVE HARVEST FORECAST", fill=(180, 83, 9), font=font_bold_sm)
    draw.text((40, 400), "Ready in ~6 Days", fill=(146, 64, 14), font=font_md)
    draw.text((40, 422), "Est. Yield: 8.5 kg (Grade A+ Raw Honey)", fill=(120, 53, 15), font=font_xs)

    # Recent Blockchain Events
    draw.rounded_rectangle([(24, 455), (w-24, 555)], radius=14, fill=(255, 255, 255), outline=(226, 232, 240))
    draw.text((40, 472), "RECENT BATCH LEDGER", fill=(100, 116, 139), font=font_xs)
    draw.text((40, 495), "Batch #HC-TG-2026-001", fill=(15, 23, 42), font=font_bold_sm)
    draw.text((40, 515), "SHA-256: 0x9f1a...c82b", fill=(99, 102, 241), font=font_xs)
    draw.text((40, 535), "Status: Lab QA Passed [PASS]", fill=(5, 150, 105), font=font_xs)

    # Bottom action button
    draw.rounded_rectangle([(24, 570), (w-24, 615)], radius=12, fill=(22, 101, 52))
    draw.text((w//2, 592), "Add Harvest Batch", fill=(255, 255, 255), font=font_bold_sm, anchor="mm")

    img.save(r"c:\honey-chain\assets\beekeeper_mockup.png", "PNG")
    print("beekeeper_mockup.png created")

# 3. Generate QR Honey Passport Mobile Mockup (340 x 640 px)
def create_passport_mockup():
    w, h = 340, 640
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Phone outer frame
    draw.rounded_rectangle([(4, 4), (w-4, h-4)], radius=36, fill=(15, 23, 42), outline=(51, 65, 85), width=4)
    # Inner screen
    draw.rounded_rectangle([(14, 14), (w-14, h-14)], radius=28, fill=(248, 250, 252))

    # Phone notch
    draw.rounded_rectangle([(w//2 - 45, 18), (w//2 + 45, 36)], radius=9, fill=(15, 23, 42))

    font_xs = get_font(10, bold=False)
    font_sm = get_font(12, bold=False)
    font_bold_sm = get_font(12, bold=True)
    font_md = get_font(15, bold=True)
    font_lg = get_font(20, bold=True)
    font_xl = get_font(22, bold=True)

    # Status bar
    draw.text((36, 26), "09:41", fill=(15, 23, 42), font=font_xs, anchor="lm")
    draw.text((w-36, 26), "5G 100%", fill=(15, 23, 42), font=font_xs, anchor="rm")

    # App Header
    draw.text((28, 62), "QR Honey Passport", fill=(180, 83, 9), font=font_lg)
    draw.text((28, 86), "Farm-to-Table Trust Engine", fill=(100, 116, 139), font=font_xs)

    # Verified Seal
    draw.rounded_rectangle([(w-105, 60), (w-28, 84)], radius=6, fill=(254, 243, 199))
    draw.text((w-66, 72), "[CERTIFIED]", fill=(180, 83, 9), font=font_xs, anchor="mm")

    # QR Code Frame Card
    draw.rounded_rectangle([(24, 108), (w-24, 250)], radius=14, fill=(255, 255, 255), outline=(226, 232, 240))
    # Fake QR code pattern
    qr_cx, qr_cy = w//2, 160
    draw.rectangle([(qr_cx - 45, qr_cy - 45), (qr_cx + 45, qr_cy + 45)], fill=(241, 245, 249), outline=(15, 23, 42), width=2)
    draw.rectangle([(qr_cx - 35, qr_cy - 35), (qr_cx - 15, qr_cy - 15)], fill=(15, 23, 42))
    draw.rectangle([(qr_cx + 15, qr_cy - 35), (qr_cx + 35, qr_cy - 15)], fill=(15, 23, 42))
    draw.rectangle([(qr_cx - 35, qr_cy + 15), (qr_cx - 15, qr_cy + 35)], fill=(15, 23, 42))
    draw.rectangle([(qr_cx - 5, qr_cy - 5), (qr_cx + 5, qr_cy + 5)], fill=(217, 119, 6))
    draw.text((w//2, 225), "Scan to Verify Provenance", fill=(100, 116, 139), font=font_xs, anchor="mm")

    # Provenance Details Card
    draw.rounded_rectangle([(24, 260), (w-24, 385)], radius=14, fill=(255, 255, 255), outline=(226, 232, 240))
    draw.text((40, 276), "PROVENANCE & ORIGIN", fill=(100, 116, 139), font=font_xs)
    draw.text((40, 298), "Flora: Wild Multifloral", fill=(15, 23, 42), font=font_bold_sm)
    draw.text((40, 318), "Apiary: Nilgiris Organic Apiary #3", fill=(71, 85, 105), font=font_xs)
    draw.text((40, 338), "GPS: 11.4102° N, 76.6950° E", fill=(71, 85, 105), font=font_xs)
    draw.text((40, 358), "Harvest Date: Sept 14, 2026", fill=(71, 85, 105), font=font_xs)

    # FSSAI Lab Quality Card
    draw.rounded_rectangle([(24, 395), (w-24, 490)], radius=14, fill=(236, 253, 245), outline=(16, 185, 129))
    draw.text((40, 412), "FSSAI & AGMARK TEST RESULTS", fill=(4, 120, 87), font=font_bold_sm)
    draw.text((40, 435), "• Moisture: 18.2% (Pass <20%)", fill=(6, 95, 70), font=font_xs)
    draw.text((40, 452), "• C4 Sugar Adulteration: 0.0% (Pure)", fill=(6, 95, 70), font=font_xs)
    draw.text((40, 470), "• NMR Purity Score: 99.4%", fill=(4, 120, 87), font=font_bold_sm)

    # Blockchain Verification Stamp
    draw.rounded_rectangle([(24, 500), (w-24, 565)], radius=14, fill=(238, 242, 255), outline=(99, 102, 241))
    draw.text((40, 516), "BLOCKCHAIN IMMUTABILITY", fill=(67, 56, 202), font=font_bold_sm)
    draw.text((40, 535), "Hash: 0x8a72...f4e1 (Audit Passed)", fill=(79, 70, 229), font=font_xs)
    draw.text((40, 550), "Blocks: 4/4 Verified Cryptographically", fill=(5, 150, 105), font=font_xs)

    # Bottom CTA
    draw.rounded_rectangle([(24, 575), (w-24, 615)], radius=12, fill=(217, 119, 6))
    draw.text((w//2, 595), "Download Lab Certificate PDF", fill=(255, 255, 255), font=font_bold_sm, anchor="mm")

    img.save(r"c:\honey-chain\assets\passport_mockup.png", "PNG")
    print("passport_mockup.png created")

def create_circular_icons():
    icons = [
        ("icon_c4.png", "C4", (220, 38, 38), (254, 226, 226), "Adulteration"),
        ("icon_visibility.png", "EYE", (37, 99, 235), (219, 234, 254), "Visibility"),
        ("icon_beekeeper.png", "INR", (217, 119, 6), (254, 243, 199), "Beekeeper"),
        ("icon_iot.png", "IOT", (13, 148, 136), (204, 251, 241), "Sensors"),
        ("icon_blockchain.png", "LED", (79, 70, 229), (224, 231, 255), "Blockchain"),
        ("icon_qr.png", "QR", (217, 119, 6), (254, 243, 199), "Passport")
    ]
    font = get_font(18, bold=True)
    font_sub = get_font(10, bold=True)
    for fname, label, color, bg_c, sub in icons:
        size = 120
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw.ellipse([(4, 4), (size - 4, size - 4)], fill=bg_c, outline=color, width=4)
        draw.text((size // 2, size // 2 - 8), label, fill=color, font=font, anchor="mm")
        draw.text((size // 2, size // 2 + 16), sub, fill=color, font=font_sub, anchor="mm")
        out_p = os.path.join(r"c:\honey-chain\assets", fname)
        img.save(out_p, "PNG")
        print(f"{fname} created")

create_architecture_diagram()
create_beekeeper_mockup()
create_passport_mockup()
create_circular_icons()

