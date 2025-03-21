import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ProfileData = () => {
    const [profile, setProfile] = useState({
        fullName: '',
        birthDate: '',
        cpf: ''
    });
    const [empty, setEmpty] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get('https://e-commerce-api-akwz.onrender.com/user/profile');
                if(response.data.findProfile.fullName === '' &&
                   response.data.findProfile.birthDate === '' &&
                   response.data.findProfile.cpf === ''){
                    setEmpty({
                        fullName: response.data.findProfile.fullName,
                        birthDate: response.data.findProfile.birthDate,
                        cpf: response.data.findProfile.cpf
                    });
                }
                setProfile({
                    fullName: response.data.findProfile.fullName,
                    birthDate: response.data.findProfile.birthDate,
                    cpf: response.data.findProfile.cpf
                });
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };
        getData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
            if(empty.fullName === '' && empty.birthDate === '' && empty.cpf === ''){
                const response = await axios.post('https://e-commerce-api-akwz.onrender.com/user/profile', profile);
                setMessage(response.data.msg);
                return;
            }
            const response = await axios.patch('https://e-commerce-api-akwz.onrender.com/user/profile', profile);
            setMessage(response.data.msg);
        } catch(err){
            setMessage(err.response.data);
        }
        
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Profile Data</h1>
                <div className="flex space-x-4">
                    <Link to="/" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700">
                        Home
                    </Link>
                    <button onClick={() => navigate(-1)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 active:bg-gray-700">
                        Previous Page
                    </button>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label htmlFor='name' className="block text-white mb-2">Name:</label>
                    <input
                        type="text"
                        id='name'
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor='birthDate' className="block text-white mb-2">Birthdate:</label>
                    <input
                        type="text"
                        id='birthDate'
                        name="birthDate"
                        value={profile.birthDate}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor='cpf' className="block text-white mb-2">CPF:</label>
                    <input
                        type="text"
                        id='cpf'
                        name="cpf"
                        value={profile.cpf}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 active:bg-blue-700">
                        Save
                    </button>
                    {message && <p className="text-white">{message}</p>}
                </div>
            </form>
        </div>
    );
};

export default ProfileData;