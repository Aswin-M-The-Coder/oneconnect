import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Donar() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/getEmployeedonar')
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
    axios.delete(`http://localhost:8081/deletedonar/${id}`)
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
        <h3>Donation History</h3>
      </div>
      {/* <Link to="/create" className='btn btn-success'>Add Donar</Link> */}
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Organisation</th>
              <th>Donated For</th>
              <th>Donated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => {
              return (
                employee.name && // Check if name exists
                <tr key={index}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.organisation}</td>
                  <td>{employee.donationtitle}</td>
                  <td>{employee.donated}</td>
                  <td>
                    {/* <Link to={`/employeeEdit/${employee.user_id}`} className='btn btn-primary btn-sm me-2'>edit</Link> */}
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

export default Donar;
