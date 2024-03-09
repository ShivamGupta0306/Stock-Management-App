import React from 'react';
import { Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import Login from './Components/Login';
import UserForm from './Components/UserForm';
import UserList from './Components/UserList';
import EditUser from './Components/EditUser';
import Profile from './Components/Profile';
import Items from './Components/Items';
import AddItem from './Components/AddItem';
import EditItem from './Components/EditItem';
import ItemGroups from './Components/ItemGroups';
import AddItemGroup from './Components/AddItemGroup';
import EditItemGroup from './Components/EditItemGroup';
import BurgerMenu from './Components/BurgerMenu';
import CompanyList from './Components/CompanyList';
import EditCompany from './Components/EditCompany';
import AddCompany from './Components/AddCompany';
import PlantList from './Components/PlantList';
import AddPlant from './Components/AddPlant';
import EditPlant from './Components/EditPlant';
import MccList from './Components/MccList';
import AddMcc from './Components/AddMcc';
import BmcList from './Components/BmcList';
import AddBmc from './Components/AddBmc';
import EditBmc from './Components/EditBmc';
import TransactionList from './Components/Transaction_list';
import AddTransaction from './Components/AddTransaction';
import DispatchIn from './Components/Dispatch_IN';
import DispatchOut from './Components/Dispatch_OUT';
import UserRole from './Components/UserRole';
import UserMap from './Components/UserMap';
import UserRights from './Components/UserRights';
import ProblemType from './Components/ProblemType';
import AddProblem from './Components/AddProblem';
import EditProblem from './Components/EditProblem';
import Transaction_Report from './Components/Transaction_Report';
import Dashboard from './Components/Dashboard';
import Footer from './Components/Footer';

const App = () => {
  const navigate = useNavigate();
  const isHome = window.location.pathname === '/';

  const isAuthenticated = () => {
    // Replace this with your actual authentication logic
    return !!localStorage.getItem('accessToken');
  };
  
  const PrivateRoute = ({ element: Component, ...rest }) => {
    return isAuthenticated() ? <Outlet/> : <Navigate to="/" />;
  };

  return (
    <>
      {isHome ? null : <BurgerMenu/>}
      <Routes>
      <Route path="/" element={<Login />} />
      <Route exact path='/' element={<PrivateRoute/>}>
              <Route exact path='/dashboard' element={<Dashboard/>} />
              <Route exact path="/createuser" element={<UserForm />} />
              <Route exact path="/user-list" element={<UserList />} />
              <Route exact path="/edit-user/:userId" element={<EditUser />} />
              <Route exact path='/user-profile' element={<Profile/>}/>
              <Route exact path="/items-list" element={<Items />} />
              <Route exact path="/createitem" element={<AddItem />} />
              <Route exact path="/edit-item/:itemCode" element={<EditItem />} />
              <Route exact path="/item-groups" element={<ItemGroups />} />
              <Route exact path="/createitemgroup" element={<AddItemGroup />} />
              <Route exact path="/edit-group/:ItemMasterGroupCode" element={<EditItemGroup />} />
              <Route exact path="/company-list" element={<CompanyList />} />
              <Route exact path="/create-company" element={<AddCompany />} />
              <Route exact path="/edit-company/:CompanyCode" element={<EditCompany />} />
              <Route exact path="/plant-list" element={<PlantList />} />
              <Route exact path="/create-plant" element={<AddPlant />} />
              <Route exact path="/edit-plant/:Plant_Id" element={<EditPlant />} />
              <Route exact path="/mcc-list" element={<MccList />} />
              <Route exact path="/createmcc" element={<AddMcc />} />
              <Route exact path="/bmc-list" element={<BmcList />} />
              <Route exact path="/create-bmc" element={<AddBmc />} />
              <Route exact path="/edit-bmc/:Center_Code" element={<EditBmc />} />
              <Route exact path="/transaction-list" element={<TransactionList />} />
              <Route exact path="/create-transaction" element={<AddTransaction />} />
              <Route exact path='/edit-trans-state/:ProductID' element = {<AddTransaction/>} />
              <Route exact  path="/dispatch-in/:docketno" element={<DispatchIn />} />
              <Route exact path="/dispatch-out/:docketno" element={<DispatchOut />} />
              <Route exact path='/user-role' element = {<UserRole/>} />
              <Route exact path='/user-map' element = {<UserMap/>} />
              <Route exact path='/edit-map/:Id' element = {<UserMap/>} />
              <Route exact path='/user-rights' element = {<UserRights/>} />
              <Route exact path='/problem-type' element = {<ProblemType/>} />
              <Route exact path='/add-problem' element = {<AddProblem/>} />
              <Route exact path='/edit-problem/:ID' element = {<EditProblem/>} />
              <Route exact path='/transaction-report' element={<Transaction_Report/>} />
            </Route>
    </Routes>
    {isHome ? null : <Footer />}
    </>
  );
};

export default App;
