import React from 'react'
import {LiveTv, Event, Group, MenuBook, Settings} from "@material-ui/icons";
import { Link } from 'react-router-dom'
import './Sidebar.css'
import API from '../../communication/API'

function Sidebar() {

    const logOut = async () => {
        await API.get('api/users/logout')
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
            <Link to="/menu">
                <div className={"d-flex sidebar-row"}>
                    <MenuBook />
                    <p className={"pl-2"}>Menü</p>
                </div>
            </Link>
            <Link to="/settings">
                <div className={"d-flex sidebar-row"}>
                    <Settings />
                    <p className={"pl-2"}>Beállítások</p>
                </div>
            </Link>
            <div className="d-flex sidebar-row" role="button" onClick={logOut}>
                Kijelentkezés
            </div>
        </div>
    )
}

export default Sidebar