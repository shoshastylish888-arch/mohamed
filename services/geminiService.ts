import { GoogleGenAI, Modality } from '@google/genai';
import type { FormDataState, MannequinColor, MannequinPose, CameraAngle, PhotoSessionStyle } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

// Helper functions for prompt engineering
const getMannequinDescription = (color: MannequinColor): string => {
    const descriptions: Record<MannequinColor, string> = {
        'Gold': 'a full-body female golden mannequin with an elegant, curvy, highly reflective, polished golden surface. The mannequin has abstract, minimalist facial features.',
        'White': 'a full-body female matte white mannequin. The surface is smooth and non-reflective. The mannequin has abstract, minimalist facial features.',
        'Silver Chrome': 'a full-body female chrome mannequin with a futuristic, highly reflective, mirror-like silver surface. The mannequin has abstract, minimalist facial features.',
        'Rose Gold': 'a full-body female rose gold mannequin with a polished, reflective, warm pinkish-gold metallic surface. The mannequin has abstract, minimalist facial features.',
        'Matte Black': 'a full-body female matte black mannequin with a sophisticated, non-reflective, deep black surface. The mannequin has abstract, minimalist facial features.',
        'Translucent Glass': 'a full-body female mannequin made of flawless, clear, translucent glass, which subtly refracts the light. The mannequin has abstract, minimalist facial features.',
        'Polished Wood': 'a full-body female mannequin carved from a single piece of dark, polished wood, like mahogany, with a visible grain. The mannequin has abstract, minimalist facial features.',
    };
    return descriptions[color];
};

const getPoseDescription = (pose: MannequinPose): string => {
    const descriptions: Record<MannequinPose, string> = {
        'Standard Studio Pose': 'The mannequin is in a standard, neutral studio pose, standing straight and facing slightly off-center.',
        'Standing Power Pose': 'The mannequin is in a confident, strong standing power pose, with feet slightly apart and a commanding presence.',
        'Elegant Walking Motion': 'The mannequin is captured mid-stride in an elegant walking motion, creating a sense of dynamism and flow.',
        'Casual Leaning Pose': 'The mannequin is in a relaxed, casual pose, leaning against an unseen object, looking effortless and chic.',
        'Seated Contemplative Pose': 'The mannequin is seated elegantly on a simple stool or block, in a thoughtful, contemplative pose.',
        'Dynamic Action Pose (Jumping)': 'The mannequin is frozen in a dynamic mid-air jumping pose, conveying energy and excitement.',
        'Reclining Lounge Pose': 'The mannequin is gracefully reclining on a chaise lounge or stylish sofa, in a relaxed yet elegant manner.',
    };
    return descriptions[pose];
};

const getCameraAngleDescription = (angle: CameraAngle): string => {
    const descriptions: Record<CameraAngle, string> = {
        'Full-Body Front View': 'The camera angle is a direct, full-body front view, capturing the mannequin from head to toe. Ensure the entire head and feet are visible in the frame.',
        'Dynamic Full-Body Angles': 'The shot is taken from a dynamic full-body angle, slightly low or to the side, adding drama. Ensure the framing is wide enough to capture the entire figure from head to toe.',
        'Full-Body High Angle': 'The camera is positioned at a high angle, looking down at the full body of the mannequin, capturing it from head to toe to provide a unique perspective.',
        'Mid-Shot (Waist Up)': 'The camera is framed for a mid-shot, capturing the mannequin from the waist up to focus on the top half of the outfit.',
        'Close-up Detail Shot': 'A close-up shot focusing on a specific detail of the outfit, like the texture of the fabric, a button, or an accessory.',
        "Worm's-Eye View (Low Angle)": 'A dramatic low-angle, worm\'s-eye view looking up at the mannequin, making it appear powerful and statuesque. Capture the full figure.',
        "Dutch Angle (Tilted)": 'The camera is tilted for a Dutch angle shot, creating a sense of unease or dynamism. Frame the entire mannequin.',
    };
    return descriptions[angle];
};

const getStyleDescription = (style: PhotoSessionStyle): string => {
    const descriptions: Record<PhotoSessionStyle, string> = {
        "Luxury Studio (Silk Curtains)": "The background is a luxury studio setting with opulent, flowing silk curtains in a deep, rich color. The lighting is soft and diffused, creating an atmosphere of elegance and high fashion.",
        "Modern Neon Lounge": "The setting is a moody, modern lounge at night, illuminated by vibrant neon lights in colors like pink, blue, and purple. There are sleek, minimalist furniture pieces in the background.",
        "Dreamy Pastel Bedroom": "The background is a beautifully styled, dreamy bedroom with a soft pastel color palette. Think plush textiles, soft lighting from a window, and delicate decor.",
        "Urban Streetwear Scene": "The scene is a gritty, urban street with graffiti-covered brick walls, concrete textures, and dramatic, hard-edged shadows from the city lights or sun.",
        "Minimalist Concrete Loft": "The background is a minimalist industrial loft with raw concrete walls, large windows, and sparse, modern furnishings. The lighting is clean and architectural.",
        "Vintage Library Setting": "The setting is a classic, cozy library with dark wood bookshelves filled with old books, a leather armchair, and warm, atmospheric lighting.",
        "Enchanted Forest Grove": "The scene is a magical, enchanted forest grove at twilight. Bioluminescent plants cast a soft glow, with ancient, mossy trees and a mystical ambiance.",
        "Rooftop Garden (Golden Hour)": "The setting is a lush rooftop garden in a bustling city during the golden hour. The warm, soft sunlight filters through plants, with a blurred cityscape in the background.",
        "Sci-Fi Spaceship Interior": "The background is the sleek, sterile, and futuristic interior of a spaceship, with minimalist white panels, holographic displays, and cool-toned LED lighting.",
        "Bohemian Desert Oasis": "The scene is a bohemian-style oasis in a vast desert, with macrame hangings, patterned rugs, large cacti, and a warm, sun-drenched color palette.",
        "Art Deco Grand Ballroom": "The setting is the interior of a lavish 1920s Art Deco grand ballroom, featuring geometric patterns, gold accents, crystal chandeliers, and a polished dance floor.",
        "Coastal Beach House": "The background is the bright, airy interior of a modern coastal beach house, with white shiplap walls, light wood floors, and a view of the ocean through large windows.",
        "Japanese Zen Garden": "The scene is a serene Japanese zen garden with raked white sand, carefully placed mossy rocks, bamboo elements, and a tranquil, minimalist atmosphere.",
        "Grand Royal Palace": "The setting is an opulent room within a grand royal palace, featuring baroque details, velvet drapes, gilded furniture, and a sense of historic luxury.",
        "Cyberpunk Alleyway": "The scene is a dark, rain-slicked alleyway in a futuristic cyberpunk city, illuminated by glowing neon signs, advertisements, and atmospheric steam.",
        "Underwater Coral Reef": "The background is a vibrant, surreal underwater coral reef. Rays of light filter through the water, illuminating colorful corals and sea life, creating a dreamlike effect.",
    };
    return descriptions[style];
};

const generatePrompt = (formData: FormDataState): string => {
    const mannequinDescription = getMannequinDescription(formData.mannequinColor);
    const poseDescription = getPoseDescription(formData.mannequinPose);
    const cameraAngleDescription = getCameraAngleDescription(formData.cameraAngle);
    const styleDescription = getStyleDescription(formData.photoSessionStyle);

    let prompt = `Create a hyperrealistic, professional fashion studio photograph for a Vogue-style editorial.
    
    **Primary Subject:** The central focus is ${mannequinDescription}. The mannequin must be wearing the exact outfit from the provided reference image. The replication of the outfit's design, shape, texture, and details must be 100% accurate.
    
    **Outfit Details:**
    - If a new outfit color is specified, change the outfit to '${formData.outfitColor}'. Otherwise, maintain the original colors from the reference image.
    ${formData.outfitColor ? `- The new primary color for the outfit is: ${formData.outfitColor}.` : ''}
    ${formData.addAccessories ? `- Add the following accessories to the outfit in a tasteful, high-fashion manner: ${formData.addAccessories}.` : ''}

    **Pose and Staging:**
    - ${poseDescription}

    **Photography Style:**
    - ${cameraAngleDescription}
    - **Crucial Framing Instruction:** For any 'Full-Body' shot, the framing must be wide enough to include the mannequin's entire head and feet. DO NOT CROP THE HEAD OR FEET.
    - The lighting should be professional-grade studio lighting that enhances the details and texture of the fabric and the mannequin's surface.
    - The photograph should have a very shallow depth of field, making the background softly blurred and keeping the mannequin and outfit sharply in focus.
    - The overall quality should be ultra-high resolution, sharp, and detailed, suitable for a print magazine cover.
    
    **Background & Environment:**
    - ${styleDescription}
    ${formData.brandName ? `- A subtle, glowing neon sign of the brand name "${formData.brandName}" is positioned tastefully ${formData.neonPosition} the mannequin in the background.` : ''}

    **Negative Prompts:**
    - Do NOT include any real humans, faces, or skin.
    - Avoid any text, logos, or watermarks unless specified.
    - Ensure there are no distorted or extra limbs on the mannequin.
    - The final image must be clean, professional, and free of artifacts.
    `;
    
    if (formData.quality === 'high' || formData.quality === 'ultra') {
        prompt += '\n- Emphasize photorealistic textures, intricate fabric details, and flawless lighting. Cinematic quality.';
    }
    if (formData.quality === 'ultra') {
        prompt += '\n- 8K resolution, hyper-detailed, award-winning photography.';
    }

    return prompt;
}

export const generateFashionShoot = async (
    formData: FormDataState,
    imageFiles: File[]
): Promise<string[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = generatePrompt(formData);
    
    const imageParts = await Promise.all(
      imageFiles.map(async (file) => {
        const base64Data = await fileToBase64(file);
        return {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        };
      })
    );

    const contents = {
        parts: [
            ...imageParts,
            { text: prompt },
        ],
    };

    const generationPromises = Array.from({ length: formData.numberOfImages }).map(() =>
        ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: contents,
            config: {
                responseModalities: [Modality.IMAGE],
            },
        })
    );

    const responses = await Promise.all(generationPromises);

    const generatedImages: string[] = [];
    for (const response of responses) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                generatedImages.push(imageUrl);
            }
        }
    }

    if (generatedImages.length === 0) {
        throw new Error("Image generation failed. The model may have blocked the request. Try adjusting your prompt or images.");
    }

    return generatedImages;
};