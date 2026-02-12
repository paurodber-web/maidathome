#!/bin/bash
TEMPLATE="suburb-template.html"

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
            HERO="Modern cleaning solutions for Docklands residents. Precision care for urban waterfront living."
            WHY="Modern apartments in {{SUBURB}} demand expert care for contemporary surfaces. We specialize in maintaining the pristine look of your city home."
            IMAGE="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1470"
            ;;
        "Southbank")
            HERO="Premier high-rise cleaning for all Southbank apartments. Elite standards for city professionals."
            WHY="Your high-rise home in {{SUBURB}} deserves to be a sanctuary. We bring the meticulous attention to detail required for modern apartment living."
            IMAGE="https://images.unsplash.com/photo-1502672260266-1c1ef2d9568e?auto=format&fit=crop&q=80&w=1470"
            ;;
        "Melbourne-CBD")
            HERO="Elite residential cleaning for Melbourne CBD apartments. Professional care for city-center living."
            WHY="Living in the heart of {{SUBURB}} means a fast-paced lifestyle. We provide the reliable, high-standard cleaning you need to keep your urban sanctuary pristine."
            IMAGE="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&q=80&w=1470"
            ;;
        "South-Yarra")
            HERO="Sophisticated cleaning for South Yarra's luxury apartments and prestigious street addresses."
            WHY="In a suburb defined by its style, our {{SUBURB}} cleaning service delivers the meticulous detail required to maintain elite standards in any local home."
            IMAGE="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1470"
            ;;
        "Prahran")
            HERO="Fashionable home care for all of Prahran, from stylish apartments to hidden terrace gems."
            WHY="Step back into a perfectly staged sanctuary after a day in {{SUBURB}}. We go beyond cleaning to ensure every local home is ready for relaxation."
            IMAGE="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1470"
            ;;
        "Brighton")
            HERO="Professional cleaning for all Brighton residents, from coastal homes to boutique bayside apartments."
            WHY="Every household in {{SUBURB}} deserves a fresh, healthy living space. We bring our meticulous standards to every local home, ensuring a pristine coastal sanctuary."
            IMAGE="https://images.unsplash.com/photo-1512411995805-4c01d4a0fc86?auto=format&fit=crop&q=80&w=1471"
            ;;
        "St-Kilda")
            HERO="Versatile house cleaning for the St Kilda community, from seaside residences to urban apartments."
            WHY="Coastal environments need regular professional care. We ensure every {{SUBURB}} home stays fresh, healthy, and perfectly maintained for all residents."
            IMAGE="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1470"
            ;;
        "Richmond")
            HERO="Energetic home care for Richmond's diverse mix of cottages, townhouses, and modern apartments."
            WHY="Residents across {{SUBURB}} lead busy lives. We provide a dependable clean that ensures your home remains a peaceful retreat amidst the urban buzz."
            IMAGE="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1470"
            ;;
        "Hawthorn")
            HERO="Superior cleaning for all Hawthorn homes, from grand estates to chic modern apartments."
            WHY="Every resident in {{SUBURB}} deserves the best. Our teams deliver a 5-star experience that ensures your home is always clean, healthy, and inviting."
            IMAGE="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80&w=1470"
            ;;
        "Abbotsford")
            HERO="Meticulous cleaning for every home in {{SUBURB}}, from riverside cottages to modern urban apartments."
            WHY="We understand the diverse architectural mix of {{SUBURB}}. Our team is trained to provide a high-standard clean that respects your unique local residence."
            IMAGE="https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=1470"
            ;;
        *)
            # Robust fallback for all other suburbs
            HERO="Professional house cleaning tailored to the unique lifestyle and elite standards of the {{SUBURB}} community."
            WHY="Every resident in {{SUBURB}} deserves a home that feels like a sanctuary. We provide the meticulous care and reliability you need to live your best local life."
            # Use local WebP image from suburb_photos directory
            IMAGE="../suburb_photos/$FILENAME"
            # Replace extension to ensure it's .webp
            IMAGE="${IMAGE%.html}.webp"
            ;;
    esac
    
    echo "Processing $FILENAME..."
    
    SLUG=$(echo $suburb | tr '[:upper:]' '[:lower:]')
    
    H_DESC=$(echo "$HERO" | sed "s/{{SUBURB}}/$DISPLAY_NAME/g")
    W_DESC=$(echo "$WHY" | sed "s/{{SUBURB}}/$DISPLAY_NAME/g")
    SAFE_IMAGE=$(echo "$IMAGE" | sed 's/&/\\\&/g')

    # Replace variables including the simple image placeholder and slug
    sed "s/{{SUBURB}}/$DISPLAY_NAME/g; s/{{SUBURB_DESC}}/$H_DESC/g; s/{{WHY_CHOOSE_DESC}}/$W_DESC/g; s|{{SUBURB_IMAGE}}|$SAFE_IMAGE|g; s/{{SUBURB_SLUG}}/$SLUG/g" "$TEMPLATE" > "$FILENAME"
done
