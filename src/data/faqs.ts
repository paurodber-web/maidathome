export interface FAQItem {
  question: string;
  answer: string;
}

export function getDynamicFaqs(suburbName: string, slug: string): FAQItem[] {
  // Generate a simple deterministic hash from the slug to choose variations
  const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const faqs: FAQItem[] = [];

  // FAQ 1: Do I need to be home?
  if (hash % 3 === 0) {
    faqs.push({
      question: `Do I need to be home during the clean in ${suburbName}?`,
      answer: `Not at all. Most of our clients in ${suburbName} are out or at work when we clean. You can securely leave a key, share a lockbox code, or coordinate entry. We'll send a notification when we arrive and a confirmation once your home is clean.`
    });
  } else if (hash % 3 === 1) {
    faqs.push({
      question: `Should I stay home while you clean my ${suburbName} property?`,
      answer: `No, it's completely optional. Many homeowners in ${suburbName} prefer to go about their day or head out. You can leave keys with a neighbour, in a lockbox, or just let us in beforehand. We'll message you when we begin and when we finish.`
    });
  } else {
    faqs.push({
      question: `Do I have to be present during the cleaning service in ${suburbName}?`,
      answer: `Nope! Most of our recurring clients in the ${suburbName} area choose to be away. You can arrange access via lockbox, key drop, or check-in. Our vetted crew will keep you updated via text upon arrival and completion.`
    });
  }

  // FAQ 2: Do you bring your own supplies?
  if (hash % 2 === 0) {
    faqs.push({
      question: `Do you bring your own cleaning supplies to ${suburbName}?`,
      answer: `Yes, we do. Our team comes fully equipped with all professional gear and eco-safe, non-toxic products to clean your ${suburbName} home. If you have specific surfaces requiring specialized care, feel free to request it at booking.`
    });
  } else {
    faqs.push({
      question: `Are cleaning products and equipment provided for ${suburbName} bookings?`,
      answer: `Absolutely. We supply everything needed for the service at your ${suburbName} residence, including high-grade vacuums, mops, and family-safe, eco-friendly products. You can also specify any preferred products during booking.`
    });
  }

  // FAQ 3: Same cleaner?
  if (hash % 3 === 0) {
    faqs.push({
      question: `Can I get the same cleaner for my ${suburbName} home every time?`,
      answer: `Absolutely. We highly recommend consistency and do our best to assign the same cleaner to your recurring bookings in ${suburbName}. Familiarity with your home's layout ensures a more efficient and personalized clean.`
    });
  } else if (hash % 3 === 1) {
    faqs.push({
      question: `Will the same professional clean my house in ${suburbName} each visit?`,
      answer: `Yes, consistency is key! For regular schedules in ${suburbName}, we assign the same dedicated professional to your property. This allows them to understand your preferences and provide the exact results you look for.`
    });
  } else {
    faqs.push({
      question: `Is it possible to request the same cleaner in ${suburbName}?`,
      answer: `Yes, indeed. We make it a priority to send the same team member for every recurring service at your ${suburbName} home. Building trust and knowing your preferences makes for a much better service.`
    });
  }

  // FAQ 4: How do recurring discounts work?
  if (hash % 2 === 0) {
    faqs.push({
      question: `How do recurring discounts work for ${suburbName} residents?`,
      answer: `Weekly bookings receive 15% off, and fortnightly cleans get 10% off. These discounts are calculated and applied automatically at checkout when you choose your frequency — no promotional codes required.`
    });
  } else {
    faqs.push({
      question: `What recurring discounts are available in ${suburbName}?`,
      answer: `We offer 15% off for weekly schedules and 10% off for fortnightly cleaning services in the ${suburbName} region. These discounts apply automatically to your rate when booking recurring visits.`
    });
  }

  // FAQ 5: Satisfaction guarantee / issues
  if (hash % 3 === 0) {
    faqs.push({
      question: `What if something is missed during my clean in ${suburbName}?`,
      answer: `Your satisfaction is our focus. If any area of your ${suburbName} home isn't cleaned to your standards, let us know within 24 hours and we'll send a team back to resolve it at no extra cost.`
    });
  } else if (hash % 3 === 1) {
    faqs.push({
      question: `What is your satisfaction guarantee for ${suburbName} clients?`,
      answer: `We stand behind our work. If you're not fully satisfied with a clean in ${suburbName}, notify us within 24 hours. We'll return to reclean the missed areas free of charge — no hassle.`
    });
  } else {
    faqs.push({
      question: `What happens if I'm not happy with the service in ${suburbName}?`,
      answer: `We want you to love your clean! If something was missed or not up to standard in your ${suburbName} property, reach out within 24 hours and we will return to fix it completely free of charge.`
    });
  }

  // FAQ 6: End of Lease
  if (hash % 2 === 0) {
    faqs.push({
      question: `What's included in the ${suburbName} end of lease cleaning?`,
      answer: `We follow a comprehensive checklist aligned with the REIV standards. It covers detailed cleaning of the oven, rangehood, kitchen cabinets, bathrooms, walls (spot clean), window tracks, and flooring in your ${suburbName} rental.`
    });
  } else {
    faqs.push({
      question: `What does the bond cleaning service in ${suburbName} cover?`,
      answer: `Our end-of-lease service covers all essentials required by landlord and agent checklists, including deep cleaning the oven, bathrooms, cupboards, inside windows, skirtings, and hard floors across the ${suburbName} property.`
    });
  }

  // FAQ 7: Cancel / pause
  if (hash % 3 === 0) {
    faqs.push({
      question: `How do I cancel or pause a recurring booking in ${suburbName}?`,
      answer: `You can pause or cancel your ${suburbName} service at any time with 24 hours notice. There are no lock-in contracts or fees; we want to keep earning your business through quality results.`
    });
  } else if (hash % 3 === 1) {
    faqs.push({
      question: `Is there a contract to pause/cancel services in ${suburbName}?`,
      answer: `No contract at all. If you need to skip a clean or pause your recurring schedule in ${suburbName}, simply let us know 24 hours in advance and we'll adjust the schedule without penalty.`
    });
  } else {
    faqs.push({
      question: `Can I pause my house cleaning schedule in ${suburbName} when traveling?`,
      answer: `Certainly. You have total flexibility. You can cancel, skip, or pause any bookings for your ${suburbName} home with 24 hours notice. We never lock you into long-term commitments.`
    });
  }

  return faqs;
}
