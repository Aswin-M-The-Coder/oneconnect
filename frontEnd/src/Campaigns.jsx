import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Campaigns() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/getcamp')
      .then(res => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        } else {
          alert("Error");
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/deletecamp/${id}`)
      .then(res => {
        if (res.data.Status === "Success") {
          window.location.reload(true);
        } else {
          alert("Error");
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Campaign List</h3>
      </div>
      <Link to="/AddDonation" className='btn btn-success'>Add Campaign</Link>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Description</th>
              <th>Target</th>
              <th>Collecteed Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => {
              return (
                employee.title && // Check if name exists
                <tr key={index}>
                  <td>{employee.title}</td>
                  <td>{employee.description}</td>
                  <td>{employee.target}</td>
                  <td>{employee.reached}</td>
                  <td>
                    <Link to={`/campaignedit/${employee.id}`} className='btn btn-primary btn-sm me-2'>edit</Link>
                    <button onClick={e => handleDelete(employee.id)} className='btn btn-sm btn-danger'>delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Campaigns;
