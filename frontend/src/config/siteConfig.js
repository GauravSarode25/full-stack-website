// CAFE LOVE BYTE — Central Brand & Contact Configuration
import { businessConfig } from './business';

export const siteConfig = {
  brandName: businessConfig.businessName,
  tagline: businessConfig.tagline,
  slogans: {
    heroHeading1: "YOUR DATE DESERVES",
    heroHeading2: "MORE THAN JUST A CHAT.",
    heroSubheading: "Good food. Better conversations. Unforgettable vibes.",
    trustLine: "Couple-Friendly • Group-Friendly • Private Spaces",
    experienceHeading: "NOT JUST A CAFE.",
    whyHeadingLine1: "COME FOR THE FOOD.",
    whyHeadingLine2: "STAY FOR THE VIBE.",
    reservationCtaHeading: "STOP PLANNING. START EATING.",
    reservationCtaSub: "Your table is waiting. Your date probably is too.",
    contactHeading: "LET'S TALK FOOD."
  },
  contact: {
    phone: businessConfig.phone,
    phoneDisplay: businessConfig.phoneDisplay,
    email: businessConfig.email,
    address: businessConfig.address,
    googleMapsUrl: businessConfig.googleMapsUrl,
    hours: businessConfig.openingHours
  },
  social: {
    instagram: businessConfig.instagram,
    facebook: businessConfig.facebook,
    youtube: businessConfig.youtube
  }
};

export const signatureHomeMenu = [
  {
    id: "sig-1",
    name: "Cheesy Peri-Peri Paneer Tacos",
    category: "Starter",
    price: 249,
    isVeg: true,
    isChefSpecial: true,
    description: "Crispy taco shells loaded with spicy spiced peri-peri paneer cubes, melted mozzarella, crunchy slaw, and chipotle crema.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "sig-2",
    name: "Loaded Cheese Nachos",
    category: "Starter",
    price: 229,
    isVeg: true,
    isChefSpecial: false,
    description: "Crispy corn tortilla chips drowned in warm artisanal cheese sauce, jalapeño slices, fresh salsa pico, and guacamole.",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "sig-3",
    name: "Crispy Chicken Popcorn",
    category: "Starter",
    price: 279,
    isVeg: false,
    isChefSpecial: true,
    description: "Tender, bite-sized chicken breast nuggets coated in crunchy herb batter, dusted with smoked paprika and served with garlic dip.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "sig-4",
    name: "Love Byte Special Veg Burger",
    category: "Burger",
    price: 259,
    isVeg: true,
    isChefSpecial: true,
    description: "House-crafted herb vegetable & cheese patty, grilled onions, crunchy iceberg lettuce, house secret pink sauce in a toasted brioche bun.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "sig-5",
    name: "Smoky BBQ Chicken Burger",
    category: "Burger",
    price: 299,
    isVeg: false,
    isChefSpecial: false,
    description: "Succulent grilled chicken fillet basted in hickory smoked BBQ reduction, Monterey Jack cheese, pickled jalapeños, and potato crisps.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "sig-6",
    name: "Creamy Pink Sauce Pasta",
    category: "Pasta",
    price: 289,
    isVeg: true,
    isChefSpecial: true,
    description: "Penne pasta enveloped in a luxurious blend of San Marzano tomato pomodoro and mascarpone cream, finished with fresh basil and parmesan.",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281093?q=80&w=800&auto=format&fit=crop"
  }
];

export const homeBlogPreviews = [
  {
    id: "blog-1",
    slug: "5-date-ideas-that-dont-feel-like-a-first-date",
    title: "5 Date Ideas That Don't Feel Like a First Date",
    category: "Dating & Vibes",
    date: "October 2026",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
    description: "Ditch the awkward interrogation dinners. Here are 5 intimate, aesthetic ways to make your date effortless, warm, and memorable."
  },
  {
    id: "blog-2",
    slug: "late-night-food-what-should-you-actually-order",
    title: "Late-Night Food: What Should You Actually Order?",
    category: "Food Guide",
    date: "September 2026",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop",
    description: "From loaded tacos to molten chocolate pots, our head chef breaks down the ultimate late-night cravings playbook for two."
  },
  {
    id: "blog-3",
    slug: "how-to-plan-the-perfect-cafe-date",
    title: "How to Plan the Perfect Café Date",
    category: "Experiences",
    date: "September 2026",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
    description: "Timing, table selection, food sharing hacks, and ambiance tips that turn a simple coffee meetup into pure chemistry."
  }
];

export const sampleTestimonials = [
  {
    id: "test-1",
    name: "Ananya & Rohit",
    tag: "First Date",
    comment: "The candlelight booth was so private and comfortable. We spent nearly three hours talking over Pink Sauce Pasta and Cold Brews. Unbeatable vibe!",
    date: "Guest Experience"
  },
  {
    id: "test-2",
    name: "Vikram S.",
    tag: "Friend Reunion",
    comment: "Booked the corner lounge for 6 friends. The Loaded Nachos and Peri-Peri Tacos were incredible, and the playlist was spot on. Our new regular spot.",
    date: "Guest Experience"
  },
  {
    id: "test-3",
    name: "Meera Sen",
    tag: "Birthday Celebration",
    comment: "The staff prepared a personalized table setup with fairy lights for my sister's birthday. Food was fresh, piping hot, and reasonably priced.",
    date: "Guest Experience"
  }
];
