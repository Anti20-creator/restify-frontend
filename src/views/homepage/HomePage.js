import React, { useEffect, useState } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Team from '../team/Team'
import Appointments from '../appoinments/Appointments';
import Menu from '../menu/Menu'
import Editor from '../editor/Editor';
import LiveView from '../liveview/LiveView';
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress } from '@material-ui/core';
import {
    Routes,
    Route
  } from "react-router-dom";
import { TextField, Card, Button, FormControl } from '@material-ui/core'
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
import { toast } from 'react-toastify'
import { createSocket } from '../../communication/socket'
import RegisterEmployee from '../register-employee/RegisterEmployee';
import RegisterAdmin from '../register-admin/RegisterAdmin';
import Settings from '../settings/Settings'
import Invoices from '../invoices/Invoices'
import MobileNavbar from '../../components/mobile-navbar/MobileNavbar'

function HomePage() {

    const [authenticated, setAuthenticated] = useState(false)
    const [userLoading, setUserLoading] = useState(true)
    const dataLoading = useSelector(loadingState)
    const dispatch = useDispatch()
    
    useEffect(() => {
        API.get('api/users/getdata').then(result => {
            setAuthenticated(result.data.email !== null)
            dispatch(setLoading(true))
            setUserLoading(false)
        }).catch((err) => {
            setAuthenticated(false)
            dispatch(setLoading(false))
            setUserLoading(false)
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    
    useEffect(() => {
        async function pullData() {
            if(authenticated) {
                createSocket(store)

                const layout = await API.get('/api/layouts')
                dispatch(updateLayout(layout.data.message))

                const size = await API.get('/api/layouts/data')
                dispatch(updateSize(size.data.message))
    
                const menu = await API.get('/api/menu')
                dispatch(updateMenu(menu.data.message))
    
                const tables = await API.get('/api/tables')
                dispatch(updateTables(tables.data.message))
    
                const appointments = await API.get('/api/appointments')
                dispatch(updateAppointments(appointments.data.message))

                const currency = await API.get('/api/informations/currency')
                dispatch(setCurrency(currency.data.message))

                dispatch(setLoading(false))
            }
        }
        pullData()
    }, [authenticated]) // eslint-disable-line react-hooks/exhaustive-deps
    
    const login = async (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
    
        const result = await API
            .post('api/users/login', {email, password})
            .catch(err => {
                toast.error('Hibás email vagy jelszó!', {autoClose: 1200, position: 'bottom-center'})
            })
        setAuthenticated(result.status === 200)
    }

    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        API.get('/api/users/is-admin').then((result) => {
            setIsAdmin(result.data.message)
        }).catch(err => {
            setIsAdmin(false)
        })
    }, [authenticated])
  
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
                                <Route exact path="/menu" element={<Menu />} />
                                <Route exact path="/appointments" element={<Appointments />} />
                                <Route exact path="/edit" element={<Editor />} />
                                <Route exact path="/team" element={<Team />} />
                                <Route exact path="/invoices" element={<Invoices />} />
                                <Route exact path="/settings" element={<Settings />} />
                                <Route path='/table/:id' element={<TableDialog />} />
                            </Routes>
                            </div>
                        </div>
                    </div>
                </>
                :
                <>
                    <Routes>
                        <Route path='/invite/:restaurantId' element={<RegisterEmployee />} />
                        <Route path='/register' element={<RegisterAdmin />} />
                        <Route path='*' element={<div className="text-center d-flex align-items-center w-100 h-100 justify-content-center">
                        <Card className="w-50 p-5 text-center login-card">
                            <form onSubmit={login}>
                                <FormControl>
                                    <TextField name="email" type="email" placeholder="E-mail" />
                                    <TextField name="password" type="password" placeholder="Jelszó" />
                                    <Button variant="outlined" color="primary" type="submit">Bejelentkezés</Button>
                                </FormControl>
                            </form>
                        </Card>
                    </div>} />
                    </Routes>
                </>
            }
        </>
  );
}

export default HomePage;
