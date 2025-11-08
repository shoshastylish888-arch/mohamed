import React, { useState, useCallback } from 'react';
import type { FormDataState, ImageFile } from './types';
import { generateFashionShoot } from './services/geminiService';
import { FORM_OPTIONS } from './constants';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import FormField from './components/FormField';
import SubmitButton from './components/SubmitButton';
import GeneratedImage from './components/GeneratedImage';

const App: React.FC = () => {
    const [formData, setFormData] = useState<FormDataState>({
        brandName: 'Vega',
        photoSessionStyle: 'Luxury Studio (Silk Curtains)',
        mannequinColor: 'Gold',
        mannequinPose: 'Standard Studio Pose',
        cameraAngle: 'Full-Body Front View',
        outfitColor: '',
        addAccessories: '',
        aspectRatio: '3:4',
        neonPosition: 'behind',
        quality: 'high',
        numberOfImages: 2,
    });
    const [referenceImages, setReferenceImages] = useState<ImageFile[]>([]);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'numberOfImages' ? parseInt(value, 10) : value,
        }));
    }, []);

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
            const newImages = files
                // FIX: Add explicit type annotation for `file` to resolve type inference issues.
                .filter((file: File) => allowedTypes.includes(file.type))
                .map((file: File) => ({
                    file,
                    preview: URL.createObjectURL(file),
                }));
            setReferenceImages(prev => [...prev, ...newImages]);
            if (newImages.length !== files.length) {
              setError("Some files were not supported. Only PNG, JPG, and WEBP are allowed.");
            } else {
              setError(null);
            }
        }
    }, []);

    const handleRemoveImage = useCallback((index: number) => {
        setReferenceImages(prev => prev.filter((_, i) => i !== index));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (referenceImages.length === 0) {
            setError('Please upload at least one reference outfit image.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const imageFiles = referenceImages.map(img => img.file);
            const result = await generateFashionShoot(formData, imageFiles);
            setGeneratedImages(result);
        // FIX: Refactor catch block to be more explicit and prevent potential parsing/scoping issues.
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred during image generation.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const aspectRatioClass = {
      '1:1': 'aspect-square',
      '3:4': 'aspect-[3/4]',
      '4:3': 'aspect-[4/3]',
      '9:16': 'aspect-[9/16]',
      '16:9': 'aspect-[16/9]',
    }[formData.aspectRatio] || 'aspect-square';

    const gridColsClass = {
      '1:1': 'grid-cols-2 md:grid-cols-2',
      '3:4': 'grid-cols-2 md:grid-cols-2',
      '9:16': 'grid-cols-2 md:grid-cols-2',
      '4:3': 'grid-cols-1 md:grid-cols-2',
      '16:9': 'grid-cols-1 md:grid-cols-2',
    }[formData.aspectRatio] || 'grid-cols-2';

    return (
        <div className="flex flex-col lg:flex-row h-full font-sans bg-gray-50 text-gray-900">
            {/* Left Panel */}
            <aside className="w-full lg:w-1/3 xl:w-1/4 lg:h-screen lg:overflow-y-auto p-6 bg-white border-r border-gray-200">
                <div className="space-y-8 pb-24 lg:pb-8">
                    <Header />
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <ImageUploader
                            images={referenceImages}
                            onUpload={handleImageUpload}
                            onRemove={handleRemoveImage}
                        />

                        {Object.entries(FORM_OPTIONS).map(([key, options]) => (
                            <FormField
                                key={key}
                                name={key}
                                label={options.label}
                                type={options.type}
                                value={formData[key as keyof FormDataState]}
                                onChange={handleFormChange}
                                options={options.options}
                                min={options.min}
                                max={options.max}
                            />
                        ))}
                        
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                        <SubmitButton isLoading={isLoading} disabled={referenceImages.length === 0} />
                    </form>
                </div>
            </aside>

            {/* Right Panel */}
            <main className="flex-1 p-6 lg:p-10 flex items-center justify-center bg-gray-100/50">
                {isLoading && (
                    <div className={`w-full max-w-5xl grid ${gridColsClass} gap-6`}>
                        {Array.from({ length: formData.numberOfImages }).map((_, i) => (
                           <GeneratedImage key={i} isLoading={true} aspectRatio={formData.aspectRatio} />
                        ))}
                    </div>
                )}
                
                {!isLoading && generatedImages.length > 0 && (
                    <div className={`w-full max-w-5xl grid ${gridColsClass} gap-6`}>
                         {generatedImages.map((src, i) => (
                           <GeneratedImage key={i} src={src} aspectRatio={formData.aspectRatio} isLoading={false} />
                        ))}
                    </div>
                )}

                {!isLoading && generatedImages.length === 0 && (
                    <div className="w-full max-w-3xl h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl bg-white">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-700">Your Photoshoot Awaits</h2>
                            <p className="text-gray-500 mt-2">Upload an outfit and configure your session to begin.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;