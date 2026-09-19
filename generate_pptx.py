import os
import collections
import collections.abc
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Palette
    BG_LIGHT = RGBColor(248, 249, 252)
    NAVY_DARK = RGBColor(15, 23, 42)
    NAVY_CARD = RGBColor(30, 41, 59)
    TEXT_DARK = RGBColor(15, 23, 42)
    TEXT_MUTED = RGBColor(100, 116, 139)
    AMBER = RGBColor(217, 119, 6)
    AMBER_LIGHT = RGBColor(254, 243, 199)
    EMERALD = RGBColor(5, 150, 105)
    EMERALD_LIGHT = RGBColor(209, 250, 229)
    BLUE = RGBColor(37, 99, 235)
    BLUE_LIGHT = RGBColor(219, 234, 254)
    RED = RGBColor(220, 38, 38)
    RED_LIGHT = RGBColor(254, 226, 226)
    WHITE = RGBColor(255, 255, 255)
    BORDER_COLOR = RGBColor(226, 232, 240)

    def add_header(slide, title_text, page_num):
        # Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_LIGHT
        bg.line.fill.background()

        # Top Bar container
        # Team pill on left
        team_pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.5), Inches(0.38), Inches(1.6), Inches(0.72))
        team_pill.fill.solid()
        team_pill.fill.fore_color.rgb = WHITE
        team_pill.line.color.rgb = RGBColor(15, 23, 42)
        team_pill.line.width = Pt(1.5)
        tf_team = team_pill.text_frame
        tf_team.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf_team.paragraphs[0]
        p.text = "NovaForge"
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK
        p.alignment = PP_ALIGN.CENTER

        # Title Center
        tb_title = slide.shapes.add_textbox(Inches(2.25), Inches(0.35), Inches(8.35), Inches(0.8))
        tf_title = tb_title.text_frame
        tf_title.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = "Georgia"
        if len(title_text) > 38:
            p_title.font.size = Pt(17)
        elif len(title_text) > 30:
            p_title.font.size = Pt(19)
        else:
            p_title.font.size = Pt(23)
        p_title.font.bold = True
        p_title.font.color.rgb = NAVY_DARK
        p_title.alignment = PP_ALIGN.CENTER

        # Right SIH Badge
        sih_box = slide.shapes.add_textbox(Inches(10.5), Inches(0.3), Inches(2.2), Inches(0.9))
        tf_sih = sih_box.text_frame
        p_sih1 = tf_sih.paragraphs[0]
        p_sih1.text = "SMART INDIA"
        p_sih1.font.name = "Arial"
        p_sih1.font.size = Pt(11)
        p_sih1.font.bold = True
        p_sih1.font.color.rgb = RGBColor(30, 64, 175)
        p_sih1.alignment = PP_ALIGN.RIGHT

        p_sih2 = tf_sih.add_paragraph()
        p_sih2.text = "HACKATHON 2026"
        p_sih2.font.name = "Arial"
        p_sih2.font.size = Pt(11)
        p_sih2.font.bold = True
        p_sih2.font.color.rgb = RGBColor(234, 88, 12)
        p_sih2.alignment = PP_ALIGN.RIGHT

        p_sih3 = tf_sih.add_paragraph()
        p_sih3.text = "SIH26021"
        p_sih3.font.name = "Arial"
        p_sih3.font.size = Pt(9)
        p_sih3.font.bold = True
        p_sih3.font.color.rgb = TEXT_MUTED
        p_sih3.alignment = PP_ALIGN.RIGHT

        # Bottom Bar
        footer = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.05), Inches(13.333), Inches(0.45))
        footer.fill.solid()
        footer.fill.fore_color.rgb = RGBColor(30, 58, 138)
        footer.line.fill.background()
        tf_f = footer.text_frame
        tf_f.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_f = tf_f.paragraphs[0]
        p_f.text = f"@SIH Idea submission- Template  |  Honey Chain  |  Team NovaForge                                                                            {page_num}"
        p_f.font.name = "Arial"
        p_f.font.size = Pt(9)
        p_f.font.color.rgb = WHITE

    # ==========================================
    # SLIDE 1: TITLE SLIDE
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = WHITE
    bg1.line.fill.background()

    # SIH Header Banner
    h_sih = s1.shapes.add_textbox(Inches(1.0), Inches(0.5), Inches(11.333), Inches(0.8))
    tf1 = h_sih.text_frame
    p1 = tf1.paragraphs[0]
    p1.text = "SMART INDIA HACKATHON 2026"
    p1.font.name = "Georgia"
    p1.font.size = Pt(32)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(30, 58, 138)
    p1.alignment = PP_ALIGN.CENTER

    # Project Title (Watermark / Feature)
    proj_tb = s1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.333), Inches(1.2))
    tf_p = proj_tb.text_frame
    p_proj = tf_p.paragraphs[0]
    p_proj.text = "Honey Chain"
    p_proj.font.name = "Arial"
    p_proj.font.size = Pt(48)
    p_proj.font.bold = True
    p_proj.font.color.rgb = RGBColor(217, 119, 6)
    p_proj.alignment = PP_ALIGN.LEFT

    # Details Card
    card1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(2.8), Inches(7.5), Inches(3.8))
    card1.fill.solid()
    card1.fill.fore_color.rgb = BG_LIGHT
    card1.line.color.rgb = RGBColor(226, 232, 240)
    card1.line.width = Pt(1.5)
    tf_c = card1.text_frame
    tf_c.margin_left = Inches(0.4)
    tf_c.margin_top = Inches(0.3)

    items = [
        ("Problem Statement ID", "SIH26021"),
        ("Problem Statement Title", "Honey Chain: A blockchain-based system for honey traceability and smart beekeeping management"),
        ("Theme", "Agriculture, FoodTech & Rural Development"),
        ("PS Category", "Software (IoT + Blockchain + AI)"),
        ("Team ID", "SIH2026-TEAM-894"),
        ("Team Name", "NovaForge")
    ]

    for idx, (lbl, val) in enumerate(items):
        p = tf_c.paragraphs[0] if idx == 0 else tf_c.add_paragraph()
        r1 = p.add_run()
        r1.text = f"{lbl} – "
        r1.font.name = "Arial"
        r1.font.size = Pt(13)
        r1.font.bold = True
        r1.font.color.rgb = NAVY_DARK

        r2 = p.add_run()
        r2.text = val + "\n"
        r2.font.name = "Arial"
        r2.font.size = Pt(13)
        r2.font.bold = False
        r2.font.color.rgb = RGBColor(51, 65, 85)

    # Right Hero Illustration Card
    right_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(2.0), Inches(3.8), Inches(4.6))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = NAVY_DARK
    right_card.line.fill.background()
    tf_rc = right_card.text_frame
    tf_rc.margin_left = Inches(0.3)
    tf_rc.margin_right = Inches(0.3)
    tf_rc.margin_top = Inches(0.4)

    p_rt1 = tf_rc.paragraphs[0]
    p_rt1.text = "CORE INNOVATION"
    p_rt1.font.name = "Arial"
    p_rt1.font.size = Pt(12)
    p_rt1.font.bold = True
    p_rt1.font.color.rgb = AMBER

    bullets = [
        "Hardware IoT Edge (Arduino + DHT22) monitors brood nest temperature & humidity.",
        "Rule-Based & Predictive AI Colony Health & Yield Diagnostics.",
        "Cryptographic SHA-256 Immutable Blockchain Ledger.",
        "5 Role-Scoped Portals: Beekeeper, Lab QA, Processor, Logistics, Consumer.",
        "1-Click Consumer QR Honey Passport with Purity Verification."
    ]
    for b in bullets:
        pb = tf_rc.add_paragraph()
        pb.text = "• " + b
        pb.font.name = "Arial"
        pb.font.size = Pt(11)
        pb.font.color.rgb = RGBColor(226, 232, 240)
        pb.space_before = Pt(8)

    # ==========================================
    # ==========================================
    # SLIDE 2: PROBLEM STATEMENT & PROPOSED SYSTEM SOLUTION
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "PROBLEM STATEMENT & PROPOSED SYSTEM SOLUTION", 2)

    col_y = Inches(1.35)
    header_h = Inches(0.48)
    card_y = Inches(1.83)
    card_h = Inches(5.1)

    # ----------------------------------------------------
    # COLUMN 1: NATIONAL PROBLEM (Width: 3.85", Left: 0.5")
    # ----------------------------------------------------
    col1_left = Inches(0.5)
    col1_w = Inches(3.85)

    # Column 1 Header Banner
    h1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col1_left, col_y, col1_w, header_h)
    h1.fill.solid()
    h1.fill.fore_color.rgb = RGBColor(2, 132, 199)  # Deep Blue
    h1.line.fill.background()
    tf_h1 = h1.text_frame
    tf_h1.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf_h1.paragraphs[0]
    p.text = "NATIONAL PROBLEM"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER

    # Column 1 Main Card
    c1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col1_left, card_y, col1_w, card_h)
    c1.fill.solid()
    c1.fill.fore_color.rgb = RGBColor(240, 249, 255)  # Soft Light Blue
    c1.line.color.rgb = RGBColor(186, 230, 253)
    c1.line.width = Pt(1.5)

    # Col 1 Items (Adulteration, Zero Visibility, Price Exploitation)
    problems = [
        ("icon_c4.png", "C4 Syrup Adulteration:", "Widespread market practice of mixing cheap inverted sugar, rice, and corn syrups. Destroys consumer trust and fails FSSAI NMR purity norms.", RGBColor(220, 38, 38)),
        ("icon_visibility.png", "Zero Supply Chain Visibility:", "Opaque traditional process from hive to consumer. No tamper-proof origin tracking, leaving consumers blind to synthetic adulterants.", RGBColor(37, 99, 235)),
        ("icon_beekeeper.png", "Beekeeper Price Exploitation:", "Middlemen dictate rock-bottom prices (<₹120/kg) to tribal and marginal beekeepers, capturing huge margins while beekeepers suffer losses.", RGBColor(217, 119, 6))
    ]

    for idx, (icon_file, title_text, desc_text, color) in enumerate(problems):
        item_y = Inches(1.95 + idx * 1.62)
        
        # Icon
        icon_path = os.path.join(r"c:\honey-chain\assets", icon_file)
        if os.path.exists(icon_path):
            s2.shapes.add_picture(icon_path, Inches(0.65), item_y + Inches(0.05), Inches(0.65), Inches(0.65))
        
        # Text box
        tb = s2.shapes.add_textbox(Inches(1.4), item_y, Inches(2.85), Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.05)
        tf.margin_top = Inches(0.0)
        tf.margin_right = Inches(0.05)
        
        p1 = tf.paragraphs[0]
        p1.text = title_text
        p1.font.name = "Arial"
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = NAVY_DARK
        
        p2 = tf.add_paragraph()
        p2.text = desc_text
        p2.font.name = "Arial"
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = RGBColor(71, 85, 105)
        p2.space_before = Pt(3)

    # ----------------------------------------------------
    # COLUMN 2: PROPOSED SOLUTION (Width: 4.1", Left: 4.55")
    # ----------------------------------------------------
    col2_left = Inches(4.55)
    col2_w = Inches(4.1)

    # Column 2 Header Banner
    h2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col2_left, col_y, col2_w, header_h)
    h2.fill.solid()
    h2.fill.fore_color.rgb = RGBColor(14, 116, 144)  # Cyan / Deep Teal
    h2.line.fill.background()
    tf_h2 = h2.text_frame
    tf_h2.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf_h2.paragraphs[0]
    p.text = "PROPOSED SOLUTION"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER

    # Column 2 Main Card
    c2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col2_left, card_y, col2_w, card_h)
    c2.fill.solid()
    c2.fill.fore_color.rgb = RGBColor(240, 253, 250)  # Light Mint / Ice
    c2.line.color.rgb = RGBColor(153, 246, 228)
    c2.line.width = Pt(1.5)

    # Col 2 Items (IoT Edge, Blockchain Ledger, Consumer QR Passport)
    solutions = [
        ("icon_iot.png", "Arduino IoT Hive Monitoring:", "Real-time edge tracking of brood temperature (32-35.5°C) & humidity on Pin 7 with local 16x2 LCD + dual-sync Python bridge to Supabase Cloud.", RGBColor(13, 148, 136)),
        ("icon_blockchain.png", "SHA-256 Blockchain Ledgering:", "Immutable, transparent cryptographic block chaining for every honey batch linking Harvest -> Lab QA -> Processing with instant tamper alerts.", RGBColor(79, 70, 229)),
        ("icon_qr.png", "Consumer QR Honey Passport:", "End-to-end trace capability via scannable QR labels revealing NMR purity score (99.4%), apiary GPS coordinates, and FSSAI lab certificates.", RGBColor(217, 119, 6))
    ]

    for idx, (icon_file, title_text, desc_text, color) in enumerate(solutions):
        item_y = Inches(1.95 + idx * 1.62)
        
        # Icon
        icon_path = os.path.join(r"c:\honey-chain\assets", icon_file)
        if os.path.exists(icon_path):
            s2.shapes.add_picture(icon_path, Inches(4.7), item_y + Inches(0.05), Inches(0.65), Inches(0.65))
        
        # Text box
        tb = s2.shapes.add_textbox(Inches(5.45), item_y, Inches(3.1), Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.05)
        tf.margin_top = Inches(0.0)
        tf.margin_right = Inches(0.05)
        
        p1 = tf.paragraphs[0]
        p1.text = title_text
        p1.font.name = "Arial"
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = NAVY_DARK
        
        p2 = tf.add_paragraph()
        p2.text = desc_text
        p2.font.name = "Arial"
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = RGBColor(71, 85, 105)
        p2.space_before = Pt(3)

    # ----------------------------------------------------
    # COLUMN 3: SYSTEM ARCHITECTURE (Width: 4.15", Left: 8.85")
    # ----------------------------------------------------
    col3_left = Inches(8.85)
    col3_w = Inches(4.0)

    # Column 3 Header Banner
    h3 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col3_left, col_y, col3_w, header_h)
    h3.fill.solid()
    h3.fill.fore_color.rgb = RGBColor(234, 88, 12)  # Amber / Orange
    h3.line.fill.background()
    tf_h3 = h3.text_frame
    tf_h3.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf_h3.paragraphs[0]
    p.text = "SYSTEM ARCHITECTURE"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER

    # Column 3 Main Card
    c3 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col3_left, card_y, col3_w, card_h)
    c3.fill.solid()
    c3.fill.fore_color.rgb = RGBColor(255, 251, 235)  # Warm Cream
    c3.line.color.rgb = RGBColor(254, 215, 170)
    c3.line.width = Pt(1.5)

    # Top Architecture Diagram
    arch_img_path = os.path.join(r"c:\honey-chain\assets", "arch_diagram.png")
    if os.path.exists(arch_img_path):
        s2.shapes.add_picture(arch_img_path, Inches(8.98), Inches(1.92), Inches(3.74), Inches(1.7))

    # Bottom Two Phone Mockups
    bk_img_path = os.path.join(r"c:\honey-chain\assets", "beekeeper_mockup.png")
    if os.path.exists(bk_img_path):
        s2.shapes.add_picture(bk_img_path, Inches(9.1), Inches(3.72), Inches(1.68), Inches(2.85))
        
        # Label below beekeeper phone
        lbl1 = s2.shapes.add_textbox(Inches(9.0), Inches(6.58), Inches(1.88), Inches(0.3))
        p = lbl1.text_frame.paragraphs[0]
        p.text = "Beekeeper Dashboard"
        p.font.name = "Arial"
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK
        p.alignment = PP_ALIGN.CENTER

    qr_img_path = os.path.join(r"c:\honey-chain\assets", "passport_mockup.png")
    if os.path.exists(qr_img_path):
        s2.shapes.add_picture(qr_img_path, Inches(10.95), Inches(3.72), Inches(1.68), Inches(2.85))
        
        # Label below QR passport phone
        lbl2 = s2.shapes.add_textbox(Inches(10.85), Inches(6.58), Inches(1.88), Inches(0.3))
        p = lbl2.text_frame.paragraphs[0]
        p.text = "QR Verification Passport"
        p.font.name = "Arial"
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK
        p.alignment = PP_ALIGN.CENTER


    # ==========================================
    # SLIDE 3: TECHNICAL APPROACH & ARCHITECTURE
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "TECHNICAL APPROACH & SYSTEM ARCHITECTURE", 3)

    # 3 Main Pillars
    col_w = Inches(3.8)
    col_gap = Inches(0.3)
    col_y = Inches(1.3)
    col_h = Inches(5.5)

    # Pillar 1: Hardware & IoT Edge
    p1_card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), col_y, col_w, col_h)
    p1_card.fill.solid()
    p1_card.fill.fore_color.rgb = WHITE
    p1_card.line.color.rgb = BORDER_COLOR
    p1_card.line.width = Pt(1)
    tf_p1 = p1_card.text_frame
    tf_p1.margin_left = Inches(0.25)
    tf_p1.margin_top = Inches(0.25)

    p = tf_p1.paragraphs[0]
    p.text = "HARDWARE & IOT EDGE"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = AMBER

    h_items = [
        ("Microcontroller", "Arduino Uno R3 (ATmega328P) processing sensor reads."),
        ("DHT22 Sensor", "Digital Pin 7, 0.1 C resolution, 2s query sampling cycle."),
        ("16x2 LCD Display", "Pins 12, 11, 5, 4, 3, 2 for live beekeeper on-site readouts."),
        ("Serial Bridge", "Python daemon on COM6, baud 9600 with auto-reconnect logic."),
        ("Dual Ingest", "Synchronous write to local SQLite and HTTPS PATCH to Supabase Cloud.")
    ]
    for t, d in h_items:
        pt = tf_p1.add_paragraph()
        pt.text = "• " + t + ":"
        pt.font.name = "Arial"
        pt.font.size = Pt(11)
        pt.font.bold = True
        pt.font.color.rgb = NAVY_DARK
        pt.space_before = Pt(6)

        pd = tf_p1.add_paragraph()
        pd.text = d
        pd.font.name = "Arial"
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = TEXT_MUTED

    # Pillar 2: AI Hive Health Engine
    p2_card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + 1 * (3.8 + 0.3)), col_y, col_w, col_h)
    p2_card.fill.solid()
    p2_card.fill.fore_color.rgb = WHITE
    p2_card.line.color.rgb = BORDER_COLOR
    p2_card.line.width = Pt(1)
    tf_p2 = p2_card.text_frame
    tf_p2.margin_left = Inches(0.25)
    tf_p2.margin_top = Inches(0.25)

    p = tf_p2.paragraphs[0]
    p.text = "AI ENGINE (ai-engine.js)"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = BLUE

    ai_items = [
        ("Colony Health Index", "Base 92% scored with penalties for thermal stress (<31 C or >36 C), pest risks, weak queen."),
        ("Stress Risk Metric", "Calculated as 100 - Health with amplifications for high pest and extreme temp (>37 C)."),
        ("Productivity Classifier", "Categorized into HIGH, MODERATE, LOW based on health score and honey reserves."),
        ("Harvest Readiness", "Predicts days to harvest (0-28 days) and yield volume (kg) with confidence scoring."),
        ("Automated Alerts", "Triggers Critical (Temp >36.5 C) & Warning (Hum >75%) alerts directly to dashboard & header.")
    ]
    for t, d in ai_items:
        pt = tf_p2.add_paragraph()
        pt.text = "• " + t + ":"
        pt.font.name = "Arial"
        pt.font.size = Pt(11)
        pt.font.bold = True
        pt.font.color.rgb = NAVY_DARK
        pt.space_before = Pt(6)

        pd = tf_p2.add_paragraph()
        pd.text = d
        pd.font.name = "Arial"
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = TEXT_MUTED

    # Pillar 3: Blockchain & Cloud Web
    p3_card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + 2 * (3.8 + 0.3)), col_y, col_w, col_h)
    p3_card.fill.solid()
    p3_card.fill.fore_color.rgb = WHITE
    p3_card.line.color.rgb = BORDER_COLOR
    p3_card.line.width = Pt(1)
    tf_p3 = p3_card.text_frame
    tf_p3.margin_left = Inches(0.25)
    tf_p3.margin_top = Inches(0.25)

    p = tf_p3.paragraphs[0]
    p.text = "BLOCKCHAIN & FULL-STACK"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    bc_items = [
        ("SHA-256 Ledger", "Cryptographic block hashing linking Harvest -> Quality -> Processing -> Distribution."),
        ("Tamper Detection", "Instant verification detects altered blocks and highlights compromised chain in red."),
        ("Frontend Stack", "React 19, TypeScript, Tailwind CSS, Leaflet Maps, Recharts, SVG QR codes."),
        ("Backend Stack", "Node.js Express REST API, SQLite (better-sqlite3), Supabase PostgreSQL Cloud."),
        ("Zero Gas Fees", "Permissible enterprise-grade cryptographic audit ledger without costly token gas.")
    ]
    for t, d in bc_items:
        pt = tf_p3.add_paragraph()
        pt.text = "• " + t + ":"
        pt.font.name = "Arial"
        pt.font.size = Pt(11)
        pt.font.bold = True
        pt.font.color.rgb = NAVY_DARK
        pt.space_before = Pt(6)

        pd = tf_p3.add_paragraph()
        pd.text = d
        pd.font.name = "Arial"
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 4: FEASIBILITY AND VIABILITY
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "FEASIBILITY AND VIABILITY ANALYSIS", 4)

    # 3 Grid Columns
    c4_w = Inches(3.8)
    c4_y = Inches(1.3)
    c4_h = Inches(5.5)

    # Col 1: Feasibility Analysis
    card_f = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), c4_y, c4_w, c4_h)
    card_f.fill.solid()
    card_f.fill.fore_color.rgb = WHITE
    card_f.line.color.rgb = BORDER_COLOR
    card_f.line.width = Pt(1)
    tf_f1 = card_f.text_frame
    tf_f1.margin_left = Inches(0.25)
    tf_f1.margin_top = Inches(0.25)

    p = tf_f1.paragraphs[0]
    p.text = "FEASIBILITY ANALYSIS"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    sub = tf_f1.add_paragraph()
    sub.text = "Can we build, operate and deploy it?"
    sub.font.name = "Arial"
    sub.font.size = Pt(10)
    sub.font.color.rgb = TEXT_MUTED

    feas = [
        ("Technical Feasibility", "Built entirely on proven, off-the-shelf components (Arduino, DHT22, React, Node.js, Supabase)."),
        ("Operational Feasibility", "Plug-and-play field setup. Clear local LCD status ensures non-tech beekeepers can use it effortlessly."),
        ("Network Feasibility", "Dual-sync architecture operates offline in rural apiaries via SQLite, syncing when connectivity resumes."),
        ("Regulatory Feasibility", "Fully compliant with FSSAI Honey Regulations (2020), AGMARK Grade A+, and ISO 22000 standards.")
    ]
    for t, d in feas:
        pt = tf_f1.add_paragraph()
        pt.text = "✔ " + t
        pt.font.name = "Arial"
        pt.font.size = Pt(11)
        pt.font.bold = True
        pt.font.color.rgb = NAVY_DARK
        pt.space_before = Pt(8)

        pd = tf_f1.add_paragraph()
        pd.text = d
        pd.font.name = "Arial"
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = TEXT_MUTED

    # Col 2: Viability
    card_v = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + 1 * (3.8 + 0.3)), c4_y, c4_w, c4_h)
    card_v.fill.solid()
    card_v.fill.fore_color.rgb = WHITE
    card_v.line.color.rgb = BORDER_COLOR
    card_v.line.width = Pt(1)
    tf_v = card_v.text_frame
    tf_v.margin_left = Inches(0.25)
    tf_v.margin_top = Inches(0.25)

    p = tf_v.paragraphs[0]
    p.text = "VIABILITY & MARKET"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = AMBER

    sub = tf_v.add_paragraph()
    sub.text = "Will it work and create sustainable value?"
    sub.font.name = "Arial"
    sub.font.size = Pt(10)
    sub.font.color.rgb = TEXT_MUTED

    viab = [
        ("Economic Viability", "Eliminates adulterated honey dumping, boosting beekeeper income by 30-40% via direct certification."),
        ("Market Demand", "India exports 74,000+ MT honey annually. Global markets demand 100% NMR-traceable raw honey."),
        ("Social Impact", "Empowers smallholder & tribal beekeepers under KVIC Honey Mission and TRIFED cooperatives."),
        ("Environmental Viability", "Reduces hive thermal stress mortality, protecting pollinator biodiversity and agricultural yields.")
    ]
    for t, d in viab:
        pt = tf_v.add_paragraph()
        pt.text = "★ " + t
        pt.font.name = "Arial"
        pt.font.size = Pt(11)
        pt.font.bold = True
        pt.font.color.rgb = NAVY_DARK
        pt.space_before = Pt(8)

        pd = tf_v.add_paragraph()
        pd.text = d
        pd.font.name = "Arial"
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = TEXT_MUTED

    # Col 3: Business Potential
    card_b = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + 2 * (3.8 + 0.3)), c4_y, c4_w, c4_h)
    card_b.fill.solid()
    card_b.fill.fore_color.rgb = WHITE
    card_b.line.color.rgb = BORDER_COLOR
    card_b.line.width = Pt(1)
    tf_b = card_b.text_frame
    tf_b.margin_left = Inches(0.25)
    tf_b.margin_top = Inches(0.25)

    p = tf_b.paragraphs[0]
    p.text = "BUSINESS & SCALE"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = BLUE

    sub = tf_b.add_paragraph()
    sub.text = "Can it scale and monetize?"
    sub.font.name = "Arial"
    sub.font.size = Pt(10)
    sub.font.color.rgb = TEXT_MUTED

    busi = [
        ("Massive Market Size", "India apiculture market reaches ₹3,500+ Cr, driven by organic health trends and exports."),
        ("B2B Revenue Model", "SaaS subscription for honey aggregators, FPOs, quality labs, and export packaging units."),
        ("API Monetization", "Traceability API licensing for e-commerce platforms (Amazon, BigBasket) to verify honey jars."),
        ("Government Integration", "Ready to integrate into National Bee Board Madhukranti portal and State Beekeeping missions.")
    ]
    for t, d in busi:
        pt = tf_b.add_paragraph()
        pt.text = "▲ " + t
        pt.font.name = "Arial"
        pt.font.size = Pt(11)
        pt.font.bold = True
        pt.font.color.rgb = NAVY_DARK
        pt.space_before = Pt(8)

        pd = tf_b.add_paragraph()
        pd.text = d
        pd.font.name = "Arial"
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 5: IMPACT AND BENEFITS
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "IMPACT, BENEFITS & FUTURE SCOPE", 5)

    # Top Left: Stakeholder Benefits (6.5 inches)
    stk_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.3), Inches(6.0), Inches(3.2))
    stk_card.fill.solid()
    stk_card.fill.fore_color.rgb = WHITE
    stk_card.line.color.rgb = BORDER_COLOR
    stk_card.line.width = Pt(1)
    tf_stk = stk_card.text_frame
    tf_stk.margin_left = Inches(0.25)
    tf_stk.margin_top = Inches(0.2)

    p = tf_stk.paragraphs[0]
    p.text = "STAKEHOLDER BENEFITS"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = NAVY_DARK

    stks = [
        ("Beekeepers (Marginal/Tribal)", "Early heat/humidity warnings, harvest readiness prediction, 30-40% higher price realization."),
        ("FPOs & Cooperatives", "Centralized apiary health monitoring, aggregate batch tracking, verified organic origin."),
        ("Processors & Exporters", "Automated FSSAI compliance, cold-chain temp logs, tamper-free cryptographic export passports."),
        ("Consumers", "100% confidence against syrup adulteration via instant smartphone QR scan.")
    ]
    for t, d in stks:
        pt = tf_stk.add_paragraph()
        pt.text = "• " + t + ": " + d
        pt.font.name = "Arial"
        pt.font.size = Pt(9.5)
        pt.font.color.rgb = NAVY_DARK
        pt.space_before = Pt(4)

    # Top Right: Metrics in Numbers (5.4 inches)
    num_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(1.3), Inches(5.4), Inches(3.2))
    num_card.fill.solid()
    num_card.fill.fore_color.rgb = WHITE
    num_card.line.color.rgb = BORDER_COLOR
    num_card.line.width = Pt(1)
    tf_num = num_card.text_frame
    tf_num.margin_left = Inches(0.25)
    tf_num.margin_top = Inches(0.2)

    p = tf_num.paragraphs[0]
    p.text = "ESTIMATED IMPACT IN NUMBERS"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    metrics = [
        ("30 – 40%", "Increase in beekeeper net revenue by selling certified Grade A+ batches."),
        ("35%", "Reduction in bee colony mortality via real-time temperature stress alerts."),
        ("100%", "Tamper detection against fake/counterfeit sugar syrup honey."),
        ("< 3 sec", "End-to-end hardware IoT telemetry propagation to cloud dashboard.")
    ]
    for val, desc in metrics:
        p_m = tf_num.add_paragraph()
        r1 = p_m.add_run()
        r1.text = val + "  "
        r1.font.name = "Arial"
        r1.font.size = Pt(13)
        r1.font.bold = True
        r1.font.color.rgb = EMERALD

        r2 = p_m.add_run()
        r2.text = desc
        r2.font.name = "Arial"
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = NAVY_DARK
        p_m.space_before = Pt(4)

    # Bottom: Future Roadmap (Full Width 11.7 inches)
    fut_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.7), Inches(11.7), Inches(2.1))
    fut_card.fill.solid()
    fut_card.fill.fore_color.rgb = NAVY_DARK
    fut_card.line.fill.background()
    tf_fut = fut_card.text_frame
    tf_fut.margin_left = Inches(0.3)
    tf_fut.margin_top = Inches(0.2)

    p_f = tf_fut.paragraphs[0]
    p_f.text = "FUTURE ROADMAP & SCALABILITY"
    p_f.font.name = "Arial"
    p_f.font.size = Pt(12)
    p_f.font.bold = True
    p_f.font.color.rgb = AMBER

    f_items = [
        ("Solar-Powered LoRaWAN Nodes", "Deploying long-range wireless nodes for deep forest & hilly apiary clusters."),
        ("Acoustic AI Bio-Sensing", "Microphone frequency analysis to predict swarming events and queen-less conditions."),
        ("Smart Contract Escrow", "Automated payments to beekeepers triggered immediately upon lab quality approval."),
        ("National Integration", "Seamless API bridge to Government of India Madhukranti portal for nationwide adoption.")
    ]
    for t, d in f_items:
        p = tf_fut.add_paragraph()
        p.text = "▲ " + t + " – " + d
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = RGBColor(226, 232, 240)
        p.space_before = Pt(4)

    # ==========================================
    # SLIDE 6: RESEARCH AND REFERENCES
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "RESEARCH AND REFERENCES", 6)

    # 6 Reference Cards in 2 Columns
    ref_items = [
        ("1. FSSAI – Manual of Methods of Analysis of Foods: Honey & Bee Products",
         "Category: Regulatory & Food Safety Standard\nStandards on moisture limits (<20%), C4 sugar detection, sucrose, and NMR testing.",
         AMBER),
        ("2. ISO 22000:2018 – Food Safety Management Systems Requirements",
         "Category: Quality Control & Traceability Compliance\nFramework for hazard analysis, critical control points, and supply chain accountability.",
         BLUE),
        ("3. IEEE 2413-2019 – Standard for Architectural Framework for IoT",
         "Category: Edge Sensing & Hardware Communication\nArchitectural guidelines for edge sensor nodes, data ingestion, and cloud telemetry.",
         EMERALD),
        ("4. NIST SP 800-162 – Attribute-Based Access Control & Data Integrity",
         "Category: Security & Access Governance\nRole-scoped authentication protocols for Beekeepers, Lab QA, and Logistics operators.",
         NAVY_DARK),
        ("5. OpenStreetMap – Overpass API for Geolocation & Apiary Mapping",
         "Category: GIS & Location Tracking\nPrecision mapping of apiary boundaries, floral reserves, and transport cold corridors.",
         BLUE),
        ("6. Solidity & SHA-256 Hashing & Cryptographic Ledger Audit",
         "Category: Blockchain & Smart Contracts\nCryptographic hash verification (FIPS PUB 180-4) ensuring immutable batch logging.",
         AMBER),
    ]

    for idx, (title, desc, accent) in enumerate(ref_items):
        r = idx // 2
        c = idx % 2
        rx = Inches(0.8 + c * 5.95)
        ry = Inches(1.3 + r * 1.55)

        rc = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, rx, ry, Inches(5.75), Inches(1.35))
        rc.fill.solid()
        rc.fill.fore_color.rgb = WHITE
        rc.line.color.rgb = BORDER_COLOR
        rc.line.width = Pt(1)

        tf_r = rc.text_frame
        tf_r.margin_left = Inches(0.2)
        tf_r.margin_top = Inches(0.15)

        pr1 = tf_r.paragraphs[0]
        pr1.text = title
        pr1.font.name = "Arial"
        pr1.font.size = Pt(10.5)
        pr1.font.bold = True
        pr1.font.color.rgb = NAVY_DARK

        pr2 = tf_r.add_paragraph()
        pr2.text = desc
        pr2.font.name = "Arial"
        pr2.font.size = Pt(9)
        pr2.font.color.rgb = TEXT_MUTED
        pr2.space_before = Pt(3)

    # Bottom Audit Box
    audit_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.0), Inches(11.7), Inches(0.85))
    audit_card.fill.solid()
    audit_card.fill.fore_color.rgb = RGBColor(30, 41, 59)
    audit_card.line.fill.background()
    tf_au = audit_card.text_frame
    tf_au.margin_left = Inches(0.3)
    tf_au.margin_top = Inches(0.12)

    pa1 = tf_au.paragraphs[0]
    pa1.text = "🏛 STANDARDS & REGULATORY COMPLIANCE AUDIT"
    pa1.font.name = "Arial"
    pa1.font.size = Pt(9.5)
    pa1.font.bold = True
    pa1.font.color.rgb = AMBER

    pa2 = tf_au.add_paragraph()
    pa2.text = "Honey Chain framework strictly aligns with official FSSAI honey purity norms, ISO 22000 food safety protocols, IEEE 2413 IoT standards, and NBB/KVIC guidelines for GoI Honey Mission deployment."
    pa2.font.name = "Arial"
    pa2.font.size = Pt(9)
    pa2.font.color.rgb = WHITE

    output_path = "c:\\honey-chain\\Honey_Chain_SIH2026_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to {output_path}")

if __name__ == "__main__":
    create_presentation()
