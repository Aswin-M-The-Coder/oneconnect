import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddDonation() {
	const [data, setData] = useState({
		title: '',
		name: '',
		description: '',
		target: ''
	})
	const navigate = useNavigate()

	const handleSubmit = (event) => {
		event.preventDefault();
		// const formdata = new FormData();
		// formdata.append("name", data.name);
		// formdata.append("email", data.email);
		// formdata.append("password", data.password);
		// formdata.append("address", data.address);
		// formdata.append("salary", data.salary);
		axios.post('http://localhost:8081/createdonar', data)
		.then(res => {
			navigate('/employee')
		})
		.catch(err => console.log(err));
		// console.log(formdata)
	}
	return (
		<div className='d-flex flex-column align-items-center pt-4'>
			<h2>Launch Donation</h2>
			<form class="row g-3 w-50" onSubmit={handleSubmit}>
			<div class="col-12">
					<label for="inputName" class="form-label">Title</label>
					<input type="text" class="form-control" id="inputName" placeholder='Enter Title' autoComplete='off'
					onChange={e => {
						setData({...data, title: e.target.value});
						console.log(data);
					}}/>
				</div>
				<div class="col-12">
					<label for="inputEmail4" class="form-label">Organisation Name</label>
					<input type="text" class="form-control" id="inputEmail4" placeholder='Enter Name' autoComplete='off'
					onChange={e => setData({...data, name: e.target.value})}/>
				</div>
				<div class="col-12">
					<label for="inputPassword4" class="form-label">Donation Description</label>
					<input type="text" class="form-control" id="inputPassword4" placeholder='Enter description'
					 onChange={e => setData({...data, description: e.target.value})}/>
				</div>
				<div class="col-12">
					<label for="inputSalary" class="form-label">Target Amount</label>
					<input type="number" class="form-control" id="inputSalary" placeholder="Enter Amount" autoComplete='off'
					onChange={e => setData({...data, target: e.target.value})}/>
				</div>
				{/* <div class="col-12 mb-3">
					<label class="form-label" for="inputGroupFile01">Select Image</label>
					<input type="file" class="form-control" id="inputGroupFile01"
					onChange={e => setData({...data, image: e.target.files[0]})}/>
				</div> */}
				<div class="col-12">
					<button type="submit" class="btn btn-primary">Create</button>
				</div>
			</form>
		</div>

	)
}

export default AddDonation