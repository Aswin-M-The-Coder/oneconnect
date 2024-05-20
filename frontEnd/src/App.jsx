import React from 'react'
import Login from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import Employee from './Employee'
import EmployeeOrg from './EmployeeOrg'
import Donar from './Donar'
import Home from './Home'
import AddEmployee from './AddEmployee'
import AddOrg from './AddOrg'
import AddDonation from './AddDonation'
import EditEmployee from './EditEmployee'
import Start from './Start'
import EmployeeDetail from './EmployeeDetail'
import EmployeeLogin from './EmployeeLogin'
import EmployeeEdit from './EditEmployee'
import EditOrg from './EditOrg'
import Campaigns from './Campaigns'
import EditCampaign from './CampaignEdit'


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Dashboard />}>
        <Route path='' element={<Home />}></Route>
        <Route path='/employee' element={<Employee />}></Route>
        <Route path='/employeeOrg' element={<EmployeeOrg />}></Route>
        <Route path='/employeedonar' element={<Donar />}></Route>
        <Route path='/create' element={<AddEmployee />}></Route>
        <Route path='/createOrg' element={<AddOrg />}></Route>
        <Route path='/AddDonation' element={<AddDonation />}></Route>
        <Route path='/Campaign' element={<Campaigns />}></Route>
        <Route path='/employeeEdit/:id' element={<EditEmployee />}></Route>
        <Route path='/OrgEdit/:id' element={<EditOrg />}></Route>
        <Route path='/campaignedit/:id' element={<EditCampaign />}></Route>
      </Route>
      <Route path='/EditEmployee/:id' element={<EmployeeEdit />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/start' element={<Start />}></Route>
      <Route path='/employeeLogin' element={<EmployeeLogin />}></Route>
      <Route path='/employeedetail/:id' element={<EmployeeDetail />}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App