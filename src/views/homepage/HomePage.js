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
import { updateLayout } from '../../store/features/layoutSlice'
import { updateMenu } from '../../store/features/menuSlice'
import { updateTables } from '../../store/features/liveSlice';

function HomePage() {

    const [authenticated, setAuthenticated] = useState(false)
    const [userLoading, setUserLoading] = useState(true)
    const dataLoading = useSelector(loadingState)
    const dispatch = useDispatch()
    
    useEffect(async () => {
        await API.get('api/users/getdata').then(result => {
            setAuthenticated(result.data.email !== null)
            dispatch(setLoading(true))
            setUserLoading(false)
        }).catch((err) => {
            setAuthenticated(false)
            dispatch(setLoading(false))
            setUserLoading(false)
        })
    }, [])
    
    useEffect(async () => {
        if(authenticated) {
            const layout = await API.get('/api/layouts')
            dispatch(updateLayout(layout.data.message))

            const menu = await API.get('/api/menu')
            dispatch(updateMenu(menu.data.message))

            const tables = await API.get('/api/tables')
            dispatch(updateTables(tables.data.message))

            dispatch(setLoading(false))
        }
    }, [authenticated])
    
    const login = async (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
    
        const result = await API.post('api/users/login', {email, password})
        setAuthenticated(result.status === 200)
    }
  
    return (
        <>
            {
                (userLoading || dataLoading) ?
                <CircularProgress />
                :
                authenticated ? 
                <div className={"d-flex h-100"}>
                    <Sidebar />
                    <div className={"w-100 d-flex align-items-center"} style={{backgroundColor: "#f5f6fa"}}>
                        <div className={"m-auto position-relative"} style={{backgroundColor: "white", width: '95%', height: '95%', overflowY: 'auto'}}>
                        <Routes>
                            <Route exact path="/" element={<LiveView />} />
                            <Route exact path="/menu" element={<Menu />} />
                            <Route exact path="/appointments" element={<Appointments />} />
                            <Route exact path="/settings" element={<Editor />} />
                            <Route exact path="/team" element={<Team />} />
                        </Routes>
                        </div>
                    </div>
                </div>
                :
                <div className="text-center d-flex align-items-center w-100 h-100 justify-content-center">
                    <Card className="w-50 p-5 text-center">
                        <form onSubmit={login}>
                            <FormControl>
                                <TextField name="email" type="email" placeholder="E-mail" />
                                <TextField name="password" type="password" placeholder="Jelszó" />
                                <Button variant="outlined" color="primary" type="submit">Bejelentkezés</Button>
                            </FormControl>
                        </form>
                    </Card>
                </div>
            }
        </>
  );
}

export default HomePage;
