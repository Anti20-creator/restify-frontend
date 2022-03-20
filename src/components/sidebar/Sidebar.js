import React, { useState, useEffect } from 'react'
import {LiveTv, Event, Group, MenuBook, Settings, ExitToApp, Edit, Receipt} from "@material-ui/icons";
import { Link } from 'react-router-dom'
import './Sidebar.css'
import 'animate.css'
import API from '../../communication/API'
import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar({isAdmin}) {

    const navigate = useNavigate()
    const location = useLocation()
    const [active, setActive] = useState('')
    
    const logOut = () => {
        API.get('api/users/logout').then(() => {
            navigate('/')
            window.location.reload();
        })
    }
    useEffect(() => {
        console.log(location.pathname)
    }, [location])

    return (
        <div className={"sidebar d-flex flex-column"}>
            <Link to="/">
                <div className={"d-flex sidebar-row " + (location.pathname === '/' ? 'active' : '')}>
                    <LiveTv />
                    <p className={"pl-2"}>Élő nézet</p>
                </div>
            </Link>
            <Link to="/appointments">
                <div className={"d-flex sidebar-row "  + (location.pathname === '/appointments' ? 'active' : '')}>
                    <Event />
                    <p className={"pl-2"}>Foglalások</p>
                </div>
            </Link>
            <Link to="/team">
                <div className={"d-flex sidebar-row "  + (location.pathname === '/team' ? 'active' : '')}>
                    <Group />
                    <p className={"pl-2"}>Csapattagok</p>
                </div>
            </Link>
            {isAdmin && <Link to="/menu">
                <div className={"d-flex sidebar-row "  + (location.pathname.includes('menu') ? 'active' : '')}>
                    <MenuBook />
                    <p className={"pl-2"}>Menü</p>
                </div>
            </Link>}
            {isAdmin && <Link to="/edit">
                <div className={"d-flex sidebar-row "  + (location.pathname === '/edit' ? 'active' : '')}>
                    <Edit />
                    <p className={"pl-2"}>Szerkesztő</p>
                </div>
            </Link>}
            <Link to="/invoices">
                <div className={"d-flex sidebar-row "  + (location.pathname === '/invoices' ? 'active' : '')}>
                    <Receipt />
                    <p className={"pl-2"}>Számlák</p>
                </div>
            </Link>
            <Link to="/settings">
                <div className={"d-flex sidebar-row "  + (location.pathname === '/settings' ? 'active' : '')}>
                    <Settings />
                    <p className={"pl-2"}>Beállítások</p>
                </div>
            </Link>
            <div className="d-flex sidebar-row " role="button" onClick={logOut}>
                <ExitToApp />
                <p className={"pl-2"}>Kijelentkezés</p>
            </div>
        </div>
    )
}

export default Sidebar