import React, { useEffect, useState } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Team from '../team/Team'
import Appointments from '../appointments/Appointments';
import Menu from '../menu/Menu'
import Editor from '../editor/Editor';
import LiveView from '../liveview/LiveView';
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress } from '@material-ui/core';
import {
    Routes,
    Route
  } from "react-router-dom";
import './HomePage.css'
import { setLoading, loadingState } from '../../store/features/loadingSlice';
import API from '../../communication/API';
import { updateLayout, updateSize } from '../../store/features/layoutSlice'
import { updateMenu } from '../../store/features/menuSlice'
import { updateTables } from '../../store/features/liveSlice';
import { setCurrency } from '../../store/features/temporarySlice'
import TableDialog from '../../components/liveview/TableDialog';
import { updateAppointments } from '../../store/features/appointmentsSlice';
import { store } from '../../store/store'
import { createSocket } from '../../communication/socket'
import RegisterEmployee from '../register-employee/RegisterEmployee';
import RegisterAdmin from '../register-admin/RegisterAdmin';
import Settings from '../settings/Settings'
import Invoices from '../invoices/Invoices'
import MobileNavbar from '../../components/mobile-navbar/MobileNavbar'
import Navbar from '../../components/navbar/Navbar';
import AppointmentRemoval from '../appointment-removal/AppointmentRemoval';
import Login from '../login/Login';

function HomePage() {

    const dispatch = useDispatch()
    const dataLoading = useSelector(loadingState)
    const [isAdmin, setIsAdmin] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)
    const [userLoading, setUserLoading] = useState(true)
    
    useEffect(() => {
        API.get('api/users/is-admin').then(result => {
            setUserLoading(false)
            setAuthenticated(true)
            setIsAdmin(result.data.message)
            dispatch(setLoading(true))
        }).catch((err) => {
            setAuthenticated(false)
            setUserLoading(false)
            setIsAdmin(false)
            dispatch(setLoading(false))
        })
    }, [authenticated]) // eslint-disable-line react-hooks/exhaustive-deps
    
    useEffect(() => {
        async function pullData() {
            if(authenticated) {
                createSocket(store)

                await API.get('/api/layouts').then(({data}) => {
                    dispatch(updateLayout(data.message))
                })

                await API.get('/api/layouts/data').then(({data}) => {
                    dispatch(updateSize(data.message))
                })
    
                await API.get('/api/menu').then(({data}) => {
                    dispatch(updateMenu(data.message))
                })
    
                await API.get('/api/tables').then(({data}) => {
                    dispatch(updateTables(data.message))
                })
    
                await API.get('/api/appointments').then(({data}) => {
                    dispatch(updateAppointments(data.message))
                })

                await API.get('/api/informations/currency').then(({data}) => {
                    dispatch(setCurrency(data.message))
                })

                dispatch(setLoading(false))
            }
        }
        pullData()
    }, [authenticated]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {
                (userLoading || dataLoading) ?
                <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                    <CircularProgress />
                </div>
                :
                authenticated ? 
                <>
                    <MobileNavbar isAdmin={isAdmin} />
                    <div className={"d-flex h-100 content-wrapper"}>
                        <Sidebar isAdmin={isAdmin} />
                        <div className={"w-100 h-100 d-flex align-items-center page-holder"} style={{backgroundColor: "#f5f6fa"}}>
                            <div className={"m-auto position-relative page-inside"} style={{backgroundColor: "white"}}>
                            <Routes>
                                <Route path="/" element={<LiveView />} />
                                {isAdmin && <Route exact path="/menu" element={<Menu />} /> }
                                <Route exact path="/appointments" element={<Appointments />} />
                                {isAdmin && <Route exact path="/edit" element={<Editor />} /> }
                                <Route exact path="/team" element={<Team />} />
                                <Route exact path="/invoices" element={<Invoices />} />
                                {isAdmin && <Route exact path="/settings" element={<Settings />} /> }
                                <Route path='/table/:id' element={<TableDialog />} />
                            </Routes>
                            </div>
                        </div>
                    </div>
                </>
                :
                <>
                    <Navbar />
                    <Routes>
                        <Route exact path='/remove-appointment/:appointmentId' element={<AppointmentRemoval />} />
                        <Route exact path='/register' element={<RegisterAdmin />} />
                        <Route exact path='/invite/:restaurantId' element={<RegisterEmployee />} />
                        <Route path='*' element={<Login setAuthenticated={setAuthenticated} setUserLoading={setUserLoading} />} />
                    </Routes>
                </>
            }
        </>
  );
}

export default HomePage;
