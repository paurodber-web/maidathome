#!/bin/bash
TEMPLATE="_suburb-template.html"

# Official List of 58 Suburbs (Excluding "Melbourne" alone)
SUBURBS=(
    "Abbotsford" "Albert-Park" "Altona" "Ascot-Vale" "Balaclava"
    "Balwyn" "Balwyn-North" "Box-Hill" "Brighton" "Brunswick"
    "Brunswick-East" "Brunswick-West" "Burnley" "Camberwell" "Carlton"
    "Carlton-North" "Coburg" "Coburg-North" "Collingwood" "Docklands"
    "East-Melbourne" "Elwood" "Essendon" "Fitzroy" "Fitzroy-North"
    "Flemington" "Footscray" "Hampton" "Hawthorn" "Hawthorn-East"
    "Keilor-East" "Kensington" "Kew" "Kew-East" "Maidstone"
    "Maribyrnong" "Melbourne-CBD" "Middle-Park" "Moonee-Ponds" "Northcote" "North-Melbourne"
    "Pascoe-Vale" "Pascoe-Vale-South" "Prahran" "Preston" "Reservoir"
    "Richmond" "Ripponlea" "Seddon" "South-Yarra" "Southbank"
    "St-Kilda" "St-Kilda-East" "Sunshine" "Thornbury" "West-Melbourne"
    "Windsor" "Yarraville"
)

# Fallback Images (Elite/Hospitality Style)
FALLBACK_IMAGES=(
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1470"
    "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80&w=1470"
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1470"
    "https://images.unsplash.com/photo-1600607687940-47a04b629571?auto=format&fit=crop&q=80&w=1470"
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1470"
    "https://images.unsplash.com/photo-1527359353448-c618ce5542e8?auto=format&fit=crop&q=80&w=1470"
)

for i in "${!SUBURBS[@]}"; do
    suburb="${SUBURBS[$i]}"
    DISPLAY_NAME=$(echo $suburb | sed 's/-/ /g')
    FILENAME=$(echo $suburb | tr '[:upper:]' '[:lower:]').html
    
    # Selection of specific content to ensure uniqueness
    case "$suburb" in
        "Docklands")
            HERO="Experience elite modern cleaning solutions tailored specifically for Docklands residents. We provide precision care for urban waterfront living, ensuring your apartment remains a pristine sanctuary amidst the city skyline."
            WHY="Modern apartments in {{SUBURB}} demand expert care for contemporary surfaces and glass. We specialize in maintaining the pristine, high-end aesthetic of your city home, letting you enjoy the views without the chore of cleaning."
            ;;
        "Southbank")
            HERO="Premier high-rise cleaning services designed for Southbank apartments. We deliver elite standards for busy city professionals who demand nothing less than perfection in their living space."
            WHY="Your high-rise home in {{SUBURB}} deserves to be a flawless sanctuary. We bring the meticulous attention to detail required for modern apartment living, ensuring every corner reflects the luxury of your location."
            ;;
        "Melbourne-CBD")
            HERO="Elite residential cleaning specifically for luxury Melbourne CBD apartments. We offer professional, hotel-grade care tailored to the fast-paced lifestyle of city-center living."
            WHY="Living in the heart of {{SUBURB}} means embracing a vibrant, fast-paced lifestyle. We provide the reliable, high-standard cleaning you need to keep your urban sanctuary pristine and welcoming after a busy day."
            ;;
        "South-Yarra")
            HERO="Sophisticated, high-end cleaning for South Yarra's luxury apartments and prestigious street addresses. We match the elegance of your suburb with our meticulous housekeeping standards."
            WHY="In a suburb defined by its style and sophistication, our {{SUBURB}} cleaning service delivers the meticulous detail required to maintain elite standards. We ensure your home is as impeccable as your lifestyle."
            ;;
        "Prahran")
            HERO="Fashionable home care for all of Prahran, from stylish modern apartments to hidden terrace gems. We provide a cleaning service that perfectly complements your vibrant local lifestyle."
            WHY="Step back into a perfectly staged sanctuary after a day exploring {{SUBURB}}. We go beyond basic cleaning to ensure every local home is refreshed, organized, and ready for pure relaxation."
            ;;
        "Brighton")
            HERO="Professional, detail-oriented cleaning for all Brighton residents, from expansive coastal homes to boutique bayside apartments. We bring a breath of fresh air to your prestigious address."
            WHY="Every household in {{SUBURB}} deserves a fresh, healthy living space that reflects the coastal beauty nearby. We bring our meticulous standards to every local home, ensuring a pristine coastal sanctuary."
            ;;
        "St-Kilda")
            HERO="Versatile, high-quality house cleaning for the St Kilda community, covering everything from historic seaside residences to contemporary urban apartments."
            WHY="Coastal environments require regular, professional care to combat salt and sand. We ensure every {{SUBURB}} home stays fresh, healthy, and perfectly maintained for you to enjoy the beachside lifestyle."
            ;;
        "Richmond")
            HERO="Energetic and thorough home care for Richmond's diverse mix of heritage cottages, townhouses, and modern warehouse conversions. We adapt to your home's unique character."
            WHY="Residents across {{SUBURB}} lead busy, dynamic lives. We provide a dependable, high-quality clean that ensures your home remains a peaceful, organized retreat amidst the urban buzz."
            ;;
        "Hawthorn")
            HERO="Superior cleaning services for all Hawthorn homes, catering to grand heritage estates and chic modern apartments alike. We treat your residence with the respect and care it deserves."
            WHY="Every resident in {{SUBURB}} deserves the best in home care. Our teams deliver a premium experience that ensures your home is always clean, healthy, and inviting for family and guests."
            ;;
        "Abbotsford")
            HERO="Meticulous cleaning for every home in {{SUBURB}}, from charm-filled riverside cottages to modern urban apartments. We ensure your home is a perfect reflection of this vibrant community."
            WHY="We understand the diverse architectural mix of {{SUBURB}}. Our team is trained to provide a high-standard clean that respects your unique local residence, leaving it spotless and refreshed."
            ;;
        *)
            # Robust fallback for all other suburbs
            HERO="Experience professional house cleaning tailored to the unique lifestyle and high standards of the {{SUBURB}} community. We transform your home into a spotless haven with our meticulous cleaning methods."
            WHY="Every resident in {{SUBURB}} deserves a home that feels like a true sanctuary. We provide the meticulous care, unwavering reliability, and attention to detail you need to live your best local life without the stress of chores."
            ;;
    esac

    # ALWAYS use local WebP image from suburbs_photos directory
    # Format: ../suburb_photos/suburb-name.webp
    IMAGE="../suburb_photos/$FILENAME"
    IMAGE="${IMAGE%.html}.webp"
    
    echo "Processing $FILENAME..."
    
    SLUG=$(echo $suburb | tr '[:upper:]' '[:lower:]')
    
    H_DESC=$(echo "$HERO" | sed "s/{{SUBURB}}/$DISPLAY_NAME/g")
    W_DESC=$(echo "$WHY" | sed "s/{{SUBURB}}/$DISPLAY_NAME/g")
    SAFE_IMAGE=$(echo "$IMAGE" | sed 's/&/\\\&/g')

    # Replace variables with unique image placeholder
    sed "s/{{SUBURB}}/$DISPLAY_NAME/g; s/{{SUBURB_DESC}}/$H_DESC/g; s/{{WHY_CHOOSE_DESC}}/$W_DESC/g; s|PLACEHOLDER_IMAGE_SRC|$SAFE_IMAGE|g; s/{{SUBURB_SLUG}}/$SLUG/g" "$TEMPLATE" > "$FILENAME"
done
