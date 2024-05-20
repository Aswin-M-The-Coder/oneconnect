import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DonateImg from "../images/cover-img.jpg";
import { Link } from 'react-router-dom';

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:8081/getcamp');
        if (response.data.Status === "Success") {
          setCampaigns(response.data.Result);
        } else {
          setError('Failed to fetch campaigns');
        }
      } catch (error) {
        setError('Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 place-content-center">
      <div
        className="bg-cover bg-no-repeat bg-center rounded-lg hidden xl:block"
        style={{
          backgroundImage: `url(${DonateImg})`,
        }}
      ></div>
      <div className="text-center mx-auto max-w-screen-sm">
        <h1 className="text-4xl font-extrabold mb-8 dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500">Donate to Our Community</h1>
        <p className="mb-5">
          Your donation helps us to offer and serve better services.
          <br className="hidden sm:block" />
          Your contribution, however big or small, is valuable for our future.
        </p>
        {loading && <p>Loading campaigns...</p>}
        {error && <p>{error}</p>}
        <div>
          {campaigns.map(campaign => (
            <div key={campaign.id} className="mb-4 p-4 border rounded-lg">
              <h2 className="text-2xl font-bold">{campaign.title}</h2>
              <p>{campaign.description}</p>
              <p><strong>Target:</strong> ${campaign.target}</p>
              <p><strong>Organization:</strong> {campaign.organisation_name}</p>
              <Link to={`/makedonation/${campaign.id}`} style={{ background: 'blue',padding:'5px',borderRadius:'20%' }}>Donate</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
