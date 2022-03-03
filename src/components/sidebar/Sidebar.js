import React, { useState, useEffect } from 'react'
import {LiveTv, Event, Group, MenuBook, Settings, ExitToApp, Edit, Receipt} from "@material-ui/icons";
import { Link } from 'react-router-dom'
import './Sidebar.css'
import 'animate.css'
import API from '../../communication/API'
import { useNavigate } from 'react-router-dom'

function Sidebar() {

    const navigate = useNavigate()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        API.get('/api/users/is-admin').then((result) => {
            setIsAdmin(result.data.message)
        }).catch(err => {
            setIsAdmin(false)
        })
    }, [])

    const logOut = () => {
        API.get('api/users/logout').then(() => {
            navigate('/')
            window.location.reload();
        })
    }

    return (
        <div className={"sidebar d-flex flex-column"}>
            <Link to="/">
                <div className={"d-flex sidebar-row"}>
                    <LiveTv />
                    <p className={"pl-2"}>Élő nézet</p>
                </div>
            </Link>
            <Link to="/appointments">
                <div className={"d-flex sidebar-row"}>
                    <Event />
                    <p className={"pl-2"}>Foglalások</p>
                </div>
            </Link>
            <Link to="/team">
                <div className={"d-flex sidebar-row"}>
                    <Group />
                    <p className={"pl-2"}>Csapattagok</p>
                </div>
            </Link>
            {isAdmin && <Link to="/menu">
                <div className={"d-flex sidebar-row"}>
                    <MenuBook />
                    <p className={"pl-2"}>Menü</p>
                </div>
            </Link>}
            {isAdmin && <Link to="/edit">
                <div className={"d-flex sidebar-row"}>
                    <Edit />
                    <p className={"pl-2"}>Szerkesztő</p>
                </div>
            </Link>}
            <Link to="/invoices">
                <div className={"d-flex sidebar-row"}>
                    <Receipt />
                    <p className={"pl-2"}>Számlák</p>
                </div>
            </Link>
            <Link to="/settings">
                <div className={"d-flex sidebar-row"}>
                    <Settings />
                    <p className={"pl-2"}>Beállítások</p>
                </div>
            </Link>
            <div className="d-flex sidebar-row" role="button" onClick={logOut}>
                <ExitToApp />
                <p className={"pl-2"}>Kijelentkezés</p>
            </div>
        </div>
    )
}

export default Sidebar