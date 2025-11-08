import type { FormDataState, FormFieldOptions } from './types';

const PHOTO_SESSION_STYLES = ["Luxury Studio (Silk Curtains)", "Modern Neon Lounge", "Dreamy Pastel Bedroom", "Urban Streetwear Scene", "Minimalist Concrete Loft", "Vintage Library Setting", "Enchanted Forest Grove", "Rooftop Garden (Golden Hour)", "Sci-Fi Spaceship Interior", "Bohemian Desert Oasis", "Art Deco Grand Ballroom", "Coastal Beach House", "Japanese Zen Garden", "Grand Royal Palace", "Cyberpunk Alleyway", "Underwater Coral Reef"] as const;
const MANNEQUIN_COLORS = ["Gold", "White", "Silver Chrome", "Rose Gold", "Matte Black", "Translucent Glass", "Polished Wood"] as const;
const MANNEQUIN_POSES = ["Standard Studio Pose", "Standing Power Pose", "Elegant Walking Motion", "Casual Leaning Pose", "Seated Contemplative Pose", "Dynamic Action Pose (Jumping)", "Reclining Lounge Pose"] as const;
const CAMERA_ANGLES = ["Full-Body Front View", "Dynamic Full-Body Angles", "Full-Body High Angle", "Mid-Shot (Waist Up)", "Close-up Detail Shot", "Worm's-Eye View (Low Angle)", "Dutch Angle (Tilted)"] as const;
const ASPECT_RATIOS = ["1:1", "3:4", "9:16", "16:9", "4:3"] as const;
const NEON_POSITIONS = ["behind", "beside", "above"] as const;
const QUALITIES = ["standard", "high", "ultra"] as const;

export const FORM_OPTIONS: Record<keyof FormDataState, FormFieldOptions> = {
    brandName: { label: 'Brand Name', type: 'text' },
    photoSessionStyle: { label: 'Photo Session Style', type: 'select', options: PHOTO_SESSION_STYLES },
    mannequinColor: { label: 'Mannequin Color', type: 'select', options: MANNEQUIN_COLORS },
    mannequinPose: { label: 'Mannequin Pose', type: 'select', options: MANNEQUIN_POSES },
    cameraAngle: { label: 'Camera Angle', type: 'select', options: CAMERA_ANGLES },
    outfitColor: { label: 'Outfit Color (Optional)', type: 'text' },
    addAccessories: { label: 'Add Accessories (Optional)', type: 'text' },
    aspectRatio: { label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIOS },
    neonPosition: { label: 'Neon Position', type: 'select', options: NEON_POSITIONS },
    quality: { label: 'Quality', type: 'select', options: QUALITIES },
    numberOfImages: { label: 'Number of Images', type: 'number', min: 1, max: 4 },
};