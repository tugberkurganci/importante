import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import http from '../lib/http';
import http2 from '../lib/http2';

const Profile = () => {
    const auth = useSelector(state => state.auth);
    const [balance, setBalance] = useState(null);
    const [profileData, setProfileData] = useState({
        walletId: '',
        walletBalance: '',
        address: '',
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                if (auth.id !== 0) {
                    const response = await http.get(`/api/user/${auth.id}`);
                    setProfileData(response.data);
                    if (response.data.walletId) {
                        const balanceResponse = await http2.get(`/api/balance/${response.data.walletId}`);
                        const balanceString = balanceResponse.data.balance;
                        const balance = parseFloat(balanceString);
                        if (!isNaN(balance)) {
                            setBalance(balance);
                            console.log('Balance:', balance);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setBalance(0)
            }
        };

        fetchProfileData();
    }, [auth.id]);

    return (
        <div>
            <h1>Profile</h1>
            <p><strong>Wallet ID:</strong> {profileData.walletId}</p>
            <p><strong>Wallet Balance:</strong> {balance !== null ? balance : 'Loading...'}</p>
            <p><strong>Address:</strong> {profileData.walletAddress}</p>
        </div>
    );
};

export default Profile;
