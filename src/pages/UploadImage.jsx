import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '/intercepter/intercepter.js'

const UploadImage = () => {
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const redirectUser = useNavigate();

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                await api.get('/api/v1/admin');
            } catch (error) {
                if (error.response?.status === 401) {
                    redirectUser('/login');
                }
            }
        };

        checkAdminAccess();
    }, []);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setMessage('Por favor, selecione uma imagem para enviar.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        setIsUploading(true);
        setMessage('');
        try {
            await api.post('/api/v1/admin/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Image uploaded successfully!');
        } catch (error) {
            setMessage('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-8"> {/* Centered form */}
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
                <h1 className="text-3xl font-bold text-black mb-6 text-center">Upload Product Image</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="image" className="block text-black font-semibold mb-2">Select Image:</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
                {message && <p className="text-black mt-4 text-center">{message}</p>}
            </div>
        </div>
    );
};

export default UploadImage;
