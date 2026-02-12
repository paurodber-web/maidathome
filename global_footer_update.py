
import os
import re

ROOT_DIR = "/Volumes/WinToUSB/Users/Pau Rodriguez/Antigravity/Trading/Creacion Web/Maid At Home (Responsive Mobile & Tablet) & PageSpeed Optimized"

def fix_footer(content):
    # 1. Change logo size in footer
    # Target logo-white.webp inside the footer
    # Current index.html logo: width="252" height="81" style="height: 81px; width: 252px; display: block;"
    content = re.sub(
        r'(<img\s+src="[^"]*assets/logo-white\.webp"[^>]*width=")\d+("[^>]*height=")\d+',
        r'\1 180\2 58',
        content
    )
    content = re.sub(
        r'(<img\s+src="[^"]*assets/logo-white\.webp"[^>]*style=")(height:\s*)\d+px(;\s*width:\s*)\d+px',
        r'\1\2 58px\3 180px',
        content
    )
    # Template style: style="height: 50px; width: auto; display: block;"
    content = re.sub(
        r'(<img\s+src="[^"]*assets/logo-white\.webp"[^>]*style=")(height:\s*)\d+px(;\s*width:\s*auto)',
        r'\1\2 58px\3',
        content
    )

    # 2. Increase spacing between logo and text
    # Look for the logo-white image parent <a> and update its margin-bottom
    # We look for the <a> that contains our logo-white img
    def replace_logo_link(match):
        link_open = match.group(1)
        img_tag = match.group(2)
        link_close = match.group(3)
        
        # Increase margin-bottom to 40px
        if 'margin-bottom:' in link_open:
            link_open = re.sub(r'margin-bottom:\s*\d+px', 'margin-bottom: 40px', link_open)
        else:
            link_open = link_open.replace('style="', 'style="margin-bottom: 40px; ')
        
        return link_open + img_tag + link_close

    content = re.sub(
        r'(<a\s+[^>]*class="logo"[^>]*>)(.*?<img\s+src="[^"]*assets/logo-white\.webp".*?)(</a>)',
        replace_logo_link,
        content,
        flags=re.DOTALL
    )

    # 3. Text replacement
    content = content.replace("5-star hospitality approach", "premium house cleaning excellence")
    content = content.replace("meticulous and professional approach", "premium house cleaning excellence")
    
    return content

files_to_process = [
    "index.html", "about.html", "services.html", "pricing.html", "contact.html", "faqs.html", "booking.html",
    "suburbs/_suburb-template.html"
]

# Additionly process all files in suburbs folder to be thorough
suburb_files = [os.path.join("suburbs", f) for f in os.listdir(os.path.join(ROOT_DIR, "suburbs")) if f.endswith(".html")]
files_to_process.extend(suburb_files)

print("Starting global footer update...")
for rel_path in files_to_process:
    full_path = os.path.join(ROOT_DIR, rel_path)
    if os.path.exists(full_path):
        with open(full_path, 'r') as f:
            old_content = f.read()
        
        new_content = fix_footer(old_content)
        
        if old_content != new_content:
            with open(full_path, 'w') as f:
                f.write(new_content)
            # print(f"Updated {rel_path}")

print("Footer updates complete.")
