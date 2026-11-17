export const navigation = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Membership", to: "/membership" },
  { label: "Trainers", to: "/trainers" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

export const programs = [
  {
    number: "01",
    title: "Strength training",
    category: "Build a base",
    image: "/images/gym/strength-training.jpg",
    description:
      "A considered approach to resistance training, built around sound movement and steady progress.",
  },
  {
    number: "02",
    title: "Personal training",
    category: "One-to-one",
    image: "/images/gym/personal-training-coaching.jpg",
    description:
      "Focused coaching with room to shape each session around your goals and experience.",
  },
  {
    number: "03",
    title: "Weight management",
    category: "Move with intent",
    image: "/images/gym/weight-management.jpg",
    description:
      "Build steady habits with a balanced mix of movement, strength, and cardio. Ask Levy about available coaching options.",
  },
  {
    number: "04",
    title: "Muscle building",
    category: "Strength & form",
    image: "/images/gym/muscle-building.jpg",
    description:
      "Progressive resistance work focused on technique, consistency, and your individual pace.",
  },
  {
    number: "05",
    title: "Cardio fitness",
    category: "Find your rhythm",
    image: "/images/gym/cardio-training.jpg",
    description:
      "Build stamina through purposeful movement, self-paced sessions, and a routine that grows with your fitness.",
  },
  {
    number: "06",
    title: "Functional training",
    category: "Move well",
    image: "/images/gym/functional-training.jpg",
    description:
      "Train useful movement patterns with scalable exercises and an emphasis on control.",
  },
];

export const galleryItems = [
  {
    title: "The strength floor",
    category: "Training",
    image: "/images/gallery/strength-training.jpg",
    alt: "Athlete training with a barbell in a gym",
  },
  {
    title: "A place to reset",
    category: "Spaces",
    image: "/images/gallery/gym-interior.jpg",
    alt: "Bright, well-equipped gym interior",
  },
  {
    title: "Details that matter",
    category: "Equipment",
    image: "/images/gallery/equipment.jpg",
    alt: "Close-up of gym weights and equipment",
  },
  {
    title: "Room to train",
    category: "Spaces",
    image: "/images/gallery/cardio.jpg",
    alt: "Rows of cardio equipment in a fitness center",
  },
  {
    title: "Build your engine",
    category: "Training",
    image: "/images/gallery/weights-detail.jpg",
    alt: "Weight-training equipment ready for a workout",
  },
  {
    title: "Find your flow",
    category: "Training",
    image: "/images/gallery/group-fitness.jpg",
    alt: "People moving through a group fitness session",
  },
];

export const trainerPlaceholders = [
  {
    image: "/images/trainers/trainer-one.jpg",
    alt: "Fitness coach standing in a gym",
    title: "Strength & Conditioning Coach",
    specialization: "Strength, lifting technique, progressive training",
    experience: "6 years (sample)",
  },
  {
    image: "/images/trainers/trainer-two.jpg",
    alt: "Coach guiding a member through a gym exercise",
    title: "Personal Training Coach",
    specialization: "One-to-one coaching, beginner foundations",
    experience: "5 years (sample)",
  },
  {
    image: "/images/trainers/trainer-three.jpg",
    alt: "Athlete standing among strength-training equipment",
    title: "Functional Training Coach",
    specialization: "Conditioning, mobility, functional movement",
    experience: "4 years (sample)",
  },
];

export const homeProgramImages: Record<string, string> = {
  "01": "/images/home/program-strength.jpg",
  "02": "/images/home/program-personal-training.jpg",
  "03": "/images/home/program-weight-management.jpg",
};

export const homeGalleryItems = [
  {
    title: "The strength floor",
    image: "/images/home/gallery-strength.jpg",
    alt: "Athlete pressing a barbell in a gym",
  },
  {
    title: "A place to reset",
    image: "/images/home/gallery-cardio.jpg",
    alt: "Cardio equipment by the windows of a gym",
  },
  {
    title: "Details that matter",
    image: "/images/home/gallery-details.jpg",
    alt: "Barbell and weight plates arranged for training",
  },
];

export const membershipPlans = [
  {
    number: "01",
    duration: "1 Month",
    price: "₹2,000",
    registrationNote: "",
    featured: false,
  },
  {
    number: "02",
    duration: "3 Months",
    price: "₹4,000",
    registrationNote: "+ ₹500 reg. fee",
    featured: false,
  },
  {
    number: "03",
    duration: "6 Months",
    price: "₹6,000",
    registrationNote: "+ ₹500 reg. fee",
    featured: true,
  },
  {
    number: "04",
    duration: "9 Months",
    price: "₹8,000",
    registrationNote: "+ ₹500 reg. fee",
    featured: false,
  },
  {
    number: "05",
    duration: "12 Months",
    price: "₹10,000",
    registrationNote: "",
    featured: false,
  },
];
