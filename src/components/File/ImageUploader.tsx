import React, { useState, useEffect } from 'react';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';

interface ImageUploaderProps {
    initialImage?: string;
    onImageChange?: (data: { file: string; fileName: string }) => void;
    isReadOnly?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ initialImage, onImageChange, isReadOnly }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);
    const [imageError, setImageError] = useState<boolean>(false);

    useEffect(() => {
        if (initialImage) {
            setImagePreview(initialImage);
            setImageError(false);
        }
    }, [initialImage]);

    const ImageUploadEmptyTemplate: React.FC = () => (
        <div className="flex align-items-center flex-column">
            <i className="pi pi-image mt-4 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
            <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                No se ha colocado una imagen
            </span>
        </div>
    );

    const customUpload = (event: FileUploadHandlerEvent) => {
        const file = event.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                setImagePreview(URL.createObjectURL(file));
                setImageError(false);

                if (onImageChange) {
                    onImageChange({ file: base64String, fileName: file.name });
                }
                event.options.clear();
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const img = new Image();
        img.src = imagePreview || '';
        img.onload = () => setImageError(false);
        img.onerror = () => {
            setImageError(true);
            setImagePreview(null);
        };
    }, [imagePreview]);

    return (
        <div>
            {!isReadOnly && <FileUpload name="image[]" accept="image/jpeg,image/jpg,image/png" customUpload uploadHandler={customUpload} auto mode="basic" />}
            <div className="image-viewer" style={{ marginTop: '10px', textAlign: 'center', height: '30vh', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {imageError ? (
                    <span style={{ color: 'grey' }}>La imagen no se encuentra disponible por el momento</span>
                ) : imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                    <ImageUploadEmptyTemplate />
                )}
            </div>
        </div>
    );
};

export default ImageUploader;