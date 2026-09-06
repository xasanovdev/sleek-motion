export const projects = [
  {
    slug: "soma",
    name: "Soma",
    line: "A fresh take on feeling good.",
    category: "Branding",
    year: "2026",
    disciplines: ["Strategy", "Brand identity", "Packaging"],
    theme: "soma",
    description:
      "Good energy, without the noise. We imagined a new generation of botanical drinks and built a bright, unapologetically optimistic identity around the small rituals that make a day better.",
    challenge:
      "Make a feel-good drink stand out in a category full of complicated promises.",
    approach:
      "A punchy wordmark, sun-ripened colors, and a packaging system that puts flavor first. Every detail brings the same uncomplicated optimism to life.",
  },
  {
    slug: "otherwhere",
    name: "Otherwhere",
    line: "Places for a different pace.",
    category: "Digital",
    year: "2026",
    disciplines: ["Art direction", "Website", "Development"],
    theme: "otherwhere",
    description:
      "A considered digital home for a collection of extraordinary places. We paired architectural photography with a quiet editorial system that gives each destination room to breathe.",
    challenge:
      "Turn the feeling of arriving somewhere special into an intuitive digital experience.",
    approach:
      "An image-led website, thoughtful destination navigation, and a flexible content system that makes every stay feel like its own story.",
  },
  {
    slug: "offscript",
    name: "Offscript",
    line: "Culture doesn’t follow a script.",
    category: "Branding",
    year: "2025",
    disciplines: ["Positioning", "Identity", "Art direction"],
    theme: "offscript",
    description:
      "An independent culture festival needed an identity as restless as its audience. We made a visual language built to move, mix, and make a little trouble.",
    challenge:
      "Bring music, film, and design together without sanding away their differences.",
    approach:
      "A typographic identity that stretches across posters, passes, and screens. Acid yellow and deep violet keep it unmistakable in any format.",
  },
  {
    slug: "folio",
    name: "Folio",
    line: "A little clarity. A lot of possibility.",
    category: "Digital",
    year: "2025",
    disciplines: ["Brand identity", "Product design", "Development"],
    theme: "folio",
    description:
      "A calmer workspace for people with a lot of ideas. We connected brand, product, and code to make a creative planning tool feel immediately familiar.",
    challenge:
      "Help small creative teams find their next step without adding another layer of admin.",
    approach:
      "A warm identity, a focused interface, and a responsive component system. Clear hierarchy and friendly interactions keep the work moving.",
  },
] as const;

export type Project = (typeof projects)[number];

export const services = [
  {
    title: "Strategy & positioning",
    text: "Find your point of difference. We get close to your business, your audience, and your ambitions to define a direction worth following.",
    items: "Brand discovery · Positioning · Naming · Brand voice",
  },
  {
    title: "Branding & identity",
    text: "Make the inside visible. We create distinctive identities with the flexibility to grow, from the first impression to the smallest everyday detail.",
    items: "Visual identity · Art direction · Packaging · Brand guidelines",
  },
  {
    title: "Websites & experiences",
    text: "Bring your brand into the browser. We design intuitive, expressive digital experiences that help people understand, explore, and take the next step.",
    items: "UX & UI design · E-commerce · Digital design systems · Prototyping",
  },
  {
    title: "Development & motion",
    text: "Make it work as beautifully as it looks. We bring design to life through considered engineering, accessible interactions, and motion with a purpose.",
    items:
      "Creative development · CMS integration · WebGL · Interaction design",
  },
];
