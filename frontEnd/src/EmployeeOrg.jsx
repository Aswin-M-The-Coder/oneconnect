import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function EmployeeOrg() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/getOrg')
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
    axios.delete(`http://localhost:8081/deleteorg/${id}`)
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
        <h3>Organisation List</h3>
      </div>
      <Link to="/createOrg" className='btn btn-success'>Add Organisation</Link>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Organisation Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Collecteed Amount</th>
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
                  <td>{employee.address}</td>
                  <td>{employee.donation}</td>
                  <td>
                    <Link to={`/OrgEdit/${employee.id}`} className='btn btn-primary btn-sm me-2'>edit</Link>
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

export default EmployeeOrg;
