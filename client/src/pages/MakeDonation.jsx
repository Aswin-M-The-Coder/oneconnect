import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MakeDonation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ID, setID] = useState('');

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/getcamps/${id}`);
        if (response.data.Status === "Success") {
          setCampaign(response.data.Result[0]); // Assuming only one campaign is returned
          setID(response.data.Result[0].id)
        } else {
          setError('Failed to fetch campaign details');
        }
      } catch (error) {
        setError('Failed to fetch campaign details');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  const handleDonationSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8081/donateall/${id}`, { amount,ID });
      if (response.data.Status === "Success") {
        navigate('/payment/success');
      } else {
        navigate('/payment/canceled');
      }
    } catch (error) {
      navigate('/payment/canceled');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-screen-sm mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Donate to {campaign?.title}</h1>
      <p><strong>Description:</strong> {campaign?.description}</p>
      <p><strong>Target:</strong> ₹{campaign?.target}</p>
      <p><strong>Organization:</strong> {campaign?.organisation_name}</p>
      <form onSubmit={handleDonationSubmit} className="mt-4">
        <label className="block mb-2">
          Donation Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full text-black"
            required
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2 rounded">Donate</button>
      </form>
    </div>
  );
};

export default MakeDonation;
