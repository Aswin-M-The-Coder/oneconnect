import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Home() {
  const [orgCount, setorgCount] = useState()
  const [adminCount, setAdminCount] = useState()
  const [employeeCount, setEmployeeCount] = useState()
  const [donarCount, setdonarCount] = useState()
  const [donationCount, setdonationCount] = useState()
  const [salary, setSalary] = useState()
  const [admins, setAdmins] = useState([]);

  useEffect(() => {

    axios.get('http://localhost:8081/organisationCount')
		.then(res => {
			setorgCount(res.data[0].organisation)
		}).catch(err => console.log(err));

    axios.get('http://localhost:8081/adminCount')
		.then(res => {
			setAdminCount(res.data[0].admin)
		}).catch(err => console.log(err));

    axios.get('http://localhost:8081/employeeCount')
		.then(res => {
			setEmployeeCount(res.data[0].employee)
		}).catch(err => console.log(err));

    axios.get('http://localhost:8081/donarCount')
		.then(res => {
			setdonarCount(res.data[0].donar)
		}).catch(err => console.log(err));

    axios.get('http://localhost:8081/totaldonation')
		.then(res => {
			setdonationCount(res.data[0].donation)
		}).catch(err => console.log(err));

    axios.get('http://localhost:8081/salary')
		.then(res => {
			setSalary(res.data[0].sumOfSalary)
		}).catch(err => console.log(err));

    axios.get('http://localhost:8081/admins')
        .then(res => {
          setAdmins(res.data);
        })
        .catch(err => console.log(err));
  }, [])
  return (
    <div>
      <div className='container mt-3'>
  <div className='row'>
    <div className='col-md-4 p-3'>
      <div className='px-3 pt-2 pb-3 border shadow-sm'>
        <div className='text-center pb-1'>
          <h4>Organisations</h4>
        </div>
        <hr />
        <div className=''>
          <h5>Total: {orgCount}</h5>
        </div>
      </div>
    </div>
    <div className='col-md-4 p-3'>
      <div className='px-3 pt-2 pb-3 border shadow-sm'>
        <div className='text-center pb-1'>
          <h4>Admins</h4>
        </div>
        <hr />
        <div className=''>
          <h5>Total: {adminCount}</h5>
        </div>
      </div>
    </div>
    <div className='col-md-4 p-3'>
      <div className='px-3 pt-2 pb-3 border shadow-sm'>
        <div className='text-center pb-1'>
          <h4>Employees</h4>
        </div>
        <hr />
        <div className=''>
          <h5>Total: {employeeCount}</h5>
        </div>
      </div>
    </div>
  </div>
  <div className='row'>
    <div className='col-md-4 p-3'>
      <div className='px-3 pt-2 pb-3 border shadow-sm'>
        <div className='text-center pb-1'>
          <h4>Donars</h4>
        </div>
        <hr />
        <div className=''>
          <h5>Total: {donarCount}</h5>
        </div>
      </div>
    </div>
    <div className='col-md-4 p-3'>
      <div className='px-3 pt-2 pb-3 border shadow-sm'>
        <div className='text-center pb-1'>
          <h4>Donation</h4>
        </div>
        <hr />
        <div className=''>
          <h5>Total: {donationCount}</h5>
        </div>
      </div>
    </div>
    <div className='col-md-4 p-3'>
      <div className='px-3 pt-2 pb-3 border shadow-sm'>
        <div className='text-center pb-1'>
          <h4>Salary</h4>
        </div>
        <hr />
        <div className=''>
          <h5>Total: {salary}</h5>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* List of admin  */}
      <div className='mt-4 px-5 pt-3'>
        <h3>List of Organisation Employees</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
          {admins.map((admin, index) => (
              <tr key={index}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home