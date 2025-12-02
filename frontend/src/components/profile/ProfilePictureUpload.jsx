import { useState, useRef } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ProfilePictureUpload = ({ currentPicture, onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentPicture);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image/(jpeg|jpg|png)')) {
            toast.error('Please select a JPG or PNG image');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size must be less than 2MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload
        await uploadImage(file);
    };

    const uploadImage = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('profile_picture', file);

        try {
            const response = await api.post('/profile/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Profile picture updated!');
            if (onUploadSuccess) {
                onUploadSuccess(response.data.url);
            }
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Failed to upload image');
            setPreview(currentPicture); // Revert preview
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async () => {
        if (!confirm('Remove profile picture?')) return;

        setUploading(true);
        try {
            await api.delete('/profile/picture');
            setPreview(null);
            toast.success('Profile picture removed');
            if (onUploadSuccess) {
                onUploadSuccess(null);
            }
        } catch (error) {
            console.error('Remove failed', error);
            toast.error('Failed to remove image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                {preview ? (
                    <img
                        src={preview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-primary/20">
                        ?
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                )}

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
                >
                    <Camera size={20} />
                </button>

                {preview && (
                    <button
                        onClick={handleRemove}
                        disabled={uploading}
                        className="absolute top-0 right-0 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 shadow-lg"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileSelect}
                className="hidden"
            />

            <p className="text-xs text-muted-foreground text-center">
                Click camera icon to upload<br />
                JPG or PNG, max 2MB
            </p>
        </div>
    );
};

export default ProfilePictureUpload;
