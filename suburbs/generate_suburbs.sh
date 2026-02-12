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
            HERO="Professional cleaning services for Docklands apartments. Keep your home spotless and comfortable with our trusted local team."
            WHY="We specialize in apartment cleaning, ensuring your home is always tidy and welcoming. Spend more time enjoying the waterfront and less time cleaning."
            ;;
        "Southbank")
            HERO="Top-quality cleaning for Southbank residents. From regular maintenance to deep cleans, we help you keep your apartment looking its best."
            WHY="We understand the needs of high-rise living. Our reliable cleaners ensure your home is consistently clean, giving you one less thing to worry about."
            ;;
        "Melbourne-CBD")
            HERO="Reliable and professional apartment cleaning for Melbourne CBD residents. We handle the cleaning so you can make the most of city living."
            WHY="Living in the city is busy enough without worrying about housework. Our team provides efficient, thorough cleaning that keeps your apartment fresh and organized."
            ;;
        "South-Yarra")
            HERO="Detailed home cleaning for South Yarra. We offer a dependable service that keeps your home fresh, tidy, and perfectly maintained."
            WHY="Whether you're in an apartment or a house, our team delivers a consistent, high-quality clean that fits around your schedule and lifestyle."
            ;;
        "Prahran")
             HERO="Great home cleaning for Prahran residents. We provide a reliable service that perfectly complements your busy local lifestyle."
            WHY="Come home to a perfectly clean space after a long day. We go beyond basic cleaning to ensure your home is refreshed and ready for you to relax."
            ;;
        "Brighton")
            HERO="Professional, detail-oriented cleaning for all Brighton homes. We help you maintain a beautiful, fresh living space without the effort."
            WHY="Every home in {{SUBURB}} deserves to be clean and welcoming. We bring our high standards to every job, ensuring your home is always at its best."
            ;;
        "St-Kilda")
            HERO="Versatile, high-quality house cleaning for the St Kilda community. We cover everything from apartments to larger family homes."
            WHY="We ensure every {{SUBURB}} home stays fresh, healthy, and perfectly maintained, giving you more time to enjoy the beachside lifestyle."
            ;;
        "Richmond")
            HERO="Thorough home care for Richmond's diverse mix of homes. Whether it's a cottage or an apartment, we adapt to your needs."
            WHY="Residents in {{SUBURB}} lead busy lives. We provide a dependable clean that ensures your home remains a peaceful, organized retreat."
            ;;
        *)
            # Robust fallback for all other suburbs
            HERO="Professional house cleaning services in {{SUBURB}}. We take care of the chores so you can come home to a clean, relaxing space."
            WHY="Our local team is dedicated to providing a reliable, thorough clean every time. Enjoy a spotless home and more free time to do what you love in {{SUBURB}}."
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
