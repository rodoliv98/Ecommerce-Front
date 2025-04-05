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
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user/profile');
                setProfile({
                    fullName: response.data.findProfile.fullName,
                    birthDate: response.data.findProfile.birthDate,
                    cpf: response.data.findProfile.cpf
                });
            } catch (error) {
                console.log(error)
                if(error.response.data === 'Not found'){
                    setEmpty({
                        fullName: '',
                        birthDate: '',
                        cpf: ''
                    });
                }
            }
        };
        getData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'birthDate') {
            const formattedValue = value
                .replace(/\D/g, '') 
                .slice(0, 8) 
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{2})(\d)/, '$1/$2'); 
            setProfile(prevProfile => ({
                ...prevProfile,
                [name]: formattedValue,
            }));
        } else if (name === 'cpf') {
            const formattedCPF = value
                .replace(/\D/g, '') 
                .slice(0, 11) 
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2') 
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
            setProfile(prevProfile => ({
                ...prevProfile,
                [name]: formattedCPF,
            }));
        } else {
            setProfile(prevProfile => ({
                ...prevProfile,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
            if(empty.fullName === '' && empty.birthDate === '' && empty.cpf === ''){
                const response = await axios.post('http://localhost:3000/user/profile', profile);
                setMessage(response.data.msg);
                setEmpty('');
                return;
            }
            const response = await axios.patch('http://localhost:3000/user/profile', profile);
            setMessage(response.data.msg);
            setErrorMessage('');
        } catch(err){
            setErrorMessage(err.response.data);
        }
        
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-8">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-black">Profile Data</h1>
                    <div className="flex space-x-4">
                        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition duration-200">
                            Home
                        </Link>
                        <button onClick={() => navigate(-1)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 active:bg-gray-700 transition duration-200">
                            Previous Page
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-black font-semibold mb-2">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="fullName"
                            value={profile.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="birthDate" className="block text-black font-semibold mb-2">Birthdate:</label>
                        <input
                            type="text"
                            id="birthDate"
                            name="birthDate"
                            value={profile.birthDate}
                            onChange={handleChange}
                            placeholder="DD/MM/YYYY"
                            maxLength={10}
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf" className="block text-black font-semibold mb-2">CPF:</label>
                        <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            value={profile.cpf}
                            onChange={handleChange}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            className="w-full text-black bg-gray-200 p-2 rounded border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                    >
                        Save
                    </button>
                    {message && <p className="text-black mt-4 text-center">{message}</p>}
                    {errorMessage && <p className="text-red-950 mt-4 text-center">{errorMessage.join(', ')}</p>}
                </form>
            </div>
        </div>
    );
};

export default ProfileData;