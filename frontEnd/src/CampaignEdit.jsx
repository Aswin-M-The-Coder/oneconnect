import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditCampaign() {
  const [data, setData] = useState({
    title: '',
    description: '',
    target: '',
    reached: '',
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8081/getcamps/${id}`)
      .then(res => {
        const result = res.data.Result[0];
        setData({
          title: result.title,
          description: result.description,
          target: result.target,
          reached: result.reached,
        });
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.put(`http://localhost:8081/updatecamp/${id}`, data)
      .then(res => {
        if (res.data.Status === "Success") {
          navigate('/employee');
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <div className='d-flex flex-column align-items-center pt-4'>
      <h2>Update Campaign</h2>
      <form className="row g-3 w-50" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="inputTitle" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="inputTitle"
            placeholder='Enter Title'
            autoComplete='off'
            onChange={e => setData({ ...data, title: e.target.value })}
            value={data.title}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputDescription" className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            id="inputDescription"
            placeholder='Enter Description'
            autoComplete='off'
            onChange={e => setData({ ...data, description: e.target.value })}
            value={data.description}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputTarget" className="form-label">Target</label>
          <input
            type="text"
            className="form-control"
            id="inputTarget"
            placeholder="Enter Target"
            autoComplete='off'
            onChange={e => setData({ ...data, target: e.target.value })}
            value={data.target}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputReached" className="form-label">Reached</label>
          <input
            type="text"
            className="form-control"
            id="inputReached"
            placeholder="Enter Reached Amount"
            autoComplete='off'
            onChange={e => setData({ ...data, reached: e.target.value })}
            value={data.reached}
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Update</button>
        </div>
      </form>
    </div>
  );
}

export default EditCampaign;
