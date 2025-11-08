export type AspectRatio = '1:1' | '3:4' | '9:16' | '16:9' | '4:3';
export type MannequinColor = 'Gold' | 'White' | 'Silver Chrome' | 'Rose Gold' | 'Matte Black' | 'Translucent Glass' | 'Polished Wood';
export type PhotoSessionStyle = "Luxury Studio (Silk Curtains)" | "Modern Neon Lounge" | "Dreamy Pastel Bedroom" | "Urban Streetwear Scene" | "Minimalist Concrete Loft" | "Vintage Library Setting" | "Enchanted Forest Grove" | "Rooftop Garden (Golden Hour)" | "Sci-Fi Spaceship Interior" | "Bohemian Desert Oasis" | "Art Deco Grand Ballroom" | "Coastal Beach House" | "Japanese Zen Garden" | "Grand Royal Palace" | "Cyberpunk Alleyway" | "Underwater Coral Reef";
export type MannequinPose = "Standard Studio Pose" | "Standing Power Pose" | "Elegant Walking Motion" | "Casual Leaning Pose" | "Seated Contemplative Pose" | "Dynamic Action Pose (Jumping)" | "Reclining Lounge Pose";
export type CameraAngle = "Full-Body Front View" | "Dynamic Full-Body Angles" | "Full-Body High Angle" | "Mid-Shot (Waist Up)" | "Close-up Detail Shot" | "Worm's-Eye View (Low Angle)" | "Dutch Angle (Tilted)";
export type NeonPosition = 'behind' | 'beside' | 'above';
export type Quality = 'standard' | 'high' | 'ultra';

export interface FormDataState {
    brandName: string;
    photoSessionStyle: PhotoSessionStyle;
    mannequinColor: MannequinColor;
    mannequinPose: MannequinPose;
    cameraAngle: CameraAngle;
    outfitColor: string;
    addAccessories: string;
    aspectRatio: AspectRatio;
    neonPosition: NeonPosition;
    quality: Quality;
    numberOfImages: number;
}

export interface ImageFile {
    file: File;
    preview: string;
}

export type FormFieldType = 'text' | 'select' | 'number';

export interface FormFieldOptions {
    label: string;
    type: FormFieldType;
    options?: readonly string[];
    min?: number;
    max?: number;
}