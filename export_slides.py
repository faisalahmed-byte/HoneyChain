import os
import shutil
import win32com.client

ppt_path = os.path.abspath(r"c:\honey-chain\Honey_Chain_SIH2026_Presentation.pptx")
output_dir = os.path.abspath(r"c:\honey-chain\slides")
artifact_dir = os.path.abspath(r"C:\Users\DELL\.gemini\antigravity-ide\brain\db83fa61-9e96-48f8-99bc-16a5168a5d7a\slides")

os.makedirs(output_dir, exist_ok=True)
os.makedirs(artifact_dir, exist_ok=True)

print(f"Opening presentation: {ppt_path}")
ppt_app = win32com.client.Dispatch("PowerPoint.Application")

try:
    pres = ppt_app.Presentations.Open(ppt_path, ReadOnly=True, Untitled=False, WithWindow=False)
    count = pres.Slides.Count
    print(f"Total slides found: {count}")
    
    for i in range(1, count + 1):
        slide = pres.Slides(i)
        out_file = os.path.join(output_dir, f"slide_{i}.png")
        art_file = os.path.join(artifact_dir, f"slide_{i}.png")
        # Export as 1920x1080 Full HD PNG
        slide.Export(out_file, "PNG", 1920, 1080)
        shutil.copyfile(out_file, art_file)
        print(f"Exported slide {i} -> {out_file}")
        
    pres.Close()
    print("All slides exported successfully!")
finally:
    ppt_app.Quit()
