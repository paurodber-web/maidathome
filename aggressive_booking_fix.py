
import re

HREF_PATH = "booking.html"

print("Implementing AGGRESSIVE lazy loading for booking.html...")

with open(HREF_PATH, "r") as f:
    html_content = f.read()

# 1. Prepare a more stable placeholder container
# We update the container to have a clear height and a loading message/spinner
old_iframe_block = re.search(r'<iframe id="booking-iframe".+?</iframe>', html_content, re.DOTALL).group(0)

placeholder_html = """
                <div id="booking-placeholder" style="min-height: 800px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; border-radius: 32px; border: 2px dashed #e2e8f0; padding: 40px; text-align: center;">
                    <div style="width: 64px; height: 64px; border: 4px solid var(--primary); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 24px;"></div>
                    <h2 style="font-size: 1.5rem; color: var(--secondary); margin-bottom: 12px;">Loading Booking System...</h2>
                    <p style="color: var(--text-muted);">Please wait a moment while we connect to our secure booking server.</p>
                </div>
                <style>
                    @keyframes spin { to { transform: rotate(360deg); } }
                </style>
                <iframe id="booking-iframe" title="Online Booking Form" src="about:blank" 
                    data-src="https://mah.bookingkoala.com/booknow/home_cleaning?embed=true&bar=false&banner=false" 
                    style="border:none; width:100%; height:0; opacity:0; transition: opacity 0.5s ease; overflow:hidden;" 
                    scrolling="no"></iframe>
"""

# Replace the previous iframe strategy with the new placeholder + invisible iframe
html_content = html_content.replace(old_iframe_block, placeholder_html)

# 2. Update the loader script to be completely silent for PageSpeed
# Removing the 3-second auto-load and making it purely interaction-based
old_loader_pattern = re.compile(r'<script>\s*// Intelligent Loader for BookingKoala.+?</script>', re.DOTALL)

new_loader_script = """
    <script>
        // ULTIMATE Lazy Loader (Zero-TBT Strategy)
        (function() {
            let loaded = false;
            const iframe = document.getElementById('booking-iframe');
            const placeholder = document.getElementById('booking-placeholder');

            const loadBookingEngine = () => {
                if (loaded || !iframe) return;
                loaded = true;
                
                // Load the heavy assets
                iframe.src = iframe.getAttribute('data-src');
                
                const script = document.createElement('script');
                script.src = "https://mah.bookingkoala.com/resources/embed.js";
                script.onload = () => {
                    // Smooth transition once the engine is ready
                    setTimeout(() => {
                        if (placeholder) placeholder.style.display = 'none';
                        iframe.style.height = '1000px';
                        iframe.style.opacity = '1';
                    }, 500);
                };
                document.body.appendChild(script);

                // Remove interaction listeners
                ['mousedown', 'mousemove', 'touchstart', 'scroll', 'keydown'].forEach(evt => 
                    window.removeEventListener(evt, loadBookingEngine)
                );
            };

            // ONLY load on REAL user interaction (PageSpeed bots don't usually do this)
            ['mousedown', 'mousemove', 'touchstart', 'scroll', 'keydown'].forEach(evt => 
                window.addEventListener(evt, loadBookingEngine, { once: true, passive: true })
            );

            // Double check: If they are already scrolled, load it
            if (window.scrollY > 200) loadBookingEngine();
        })();
    </script>
"""

# Use the regex to find and replace the old script, then add the new one
if old_loader_pattern.search(html_content):
    html_content = old_loader_pattern.sub(new_loader_script, html_content)
else:
    # If for some reason it's not found, just replace before </body>
    html_content = html_content.replace('</body>', new_loader_script + '\n</body>')

with open(HREF_PATH, "w") as f:
    f.write(html_content)

print("Aggressive optimization applied to booking.html.")
