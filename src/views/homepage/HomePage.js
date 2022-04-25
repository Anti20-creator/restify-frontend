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
import Navbar from '../../components/navbar/Navbar';
import AppointmentRemoval from '../appointment-removal/AppointmentRemoval';
import { t } from 'i18next'

function HomePage() {

    const dispatch = useDispatch()
    const dataLoading = useSelector(loadingState)
    const [isAdmin, setIsAdmin] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)
    const [userLoading, setUserLoading] = useState(true)
    
    useEffect(() => {
        API.get('api/users/is-admin').then(result => {
            setIsAdmin(result.data.message)
            setAuthenticated(true)
            dispatch(setLoading(true))
            setUserLoading(false)
        }).catch((err) => {
            setIsAdmin(false)
            setAuthenticated(false)
            dispatch(setLoading(false))
            setUserLoading(false)
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
    
    const login = async (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
    
        const result = await API
            .post('api/users/login', {email, password})
            .catch(err => {
                toast.error(t(`api.${err.response.data.message}`), {autoClose: 1200, position: 'bottom-center'})
            })
        setAuthenticated(result.status === 200)
    }

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
                    <Navbar />
                    <Routes>
                        <Route exact path='/remove-appointment/:restaurantId' element={<AppointmentRemoval />} />
                        <Route exact path='/register' element={<RegisterAdmin />} />
                        <Route exact path='/invite/:restaurantId' element={<RegisterEmployee />} />
                        <Route path='*' element={<div className="text-center d-flex align-items-center w-100 h-100 justify-content-center">
                        <Card className="w-50 p-5 text-center login-card">
                            <form onSubmit={login}>
                                <FormControl>
                                    <TextField name="email" type="email" placeholder={t('commons.email')} />
                                    <TextField name="password" type="password" placeholder={t('commons.password')} />
                                    <Button variant="outlined" color="primary" type="submit">{t('sidebar.login')}</Button>
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
