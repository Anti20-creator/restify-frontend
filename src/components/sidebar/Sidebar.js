import React from 'react'
import {LiveTv, Event, Group, MenuBook, Settings, ExitToApp, Edit, Receipt} from "@material-ui/icons";
import { Link } from 'react-router-dom'
import './Sidebar.css'
import 'animate.css'
import API from '../../communication/API'
import { useNavigate, useLocation } from 'react-router-dom'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

function Sidebar({isAdmin}) {

    const navigate = useNavigate()
    const location = useLocation()
    const { i18n } = useTranslation()
    
    const logOut = () => {
        API.get('api/users/logout').then(() => {
            navigate('/')
            window.location.reload();
        })
    }

    return (
        <div className={"sidebar d-flex flex-column"}>
            <Link to="/">
                <div className={"d-flex sidebar-row " + (location.pathname === '/' ? 'active' : '')}>
                    <LiveTv />
                    <p className={"pl-2"}>{t('sidebar.live-view')}</p>
                </div>
            </Link>
            <Link to="/appointments">
                <div className={"d-flex sidebar-row "  + (location.pathname === '/appointments' ? 'active' : '')}>
                    <Event />
                    <p className={"pl-2"}>{t('sidebar.appointments')}</p>
                </div>
            </Link>
            <Link to="/team">
                <div className={"d-flex sidebar-row "  + (location.pathname === '/team' ? 'active' : '')}>
                    <Group />
                    <p className={"pl-2"}>{t('sidebar.team')}</p>
                </div>
            </Link>
            {isAdmin && <Link to="/menu">
                <div className={"d-flex sidebar-row "  + (location.pathname.includes('menu') ? 'active' : '')}>
                    <MenuBook />
                    <p className={"pl-2"}>{t('sidebar.menu')}</p>
                </div>
            </Link>}
            {isAdmin && <Link to="/edit">
                <div className={"d-flex sidebar-row "  + (location.pathname === '/edit' ? 'active' : '')}>
                    <Edit />
                    <p className={"pl-2"}>{t('sidebar.editor')}</p>
                </div>
            </Link>}
            <Link to="/invoices">
                <div className={"d-flex sidebar-row "  + (location.pathname === '/invoices' ? 'active' : '')}>
                    <Receipt />
                    <p className={"pl-2"}>{t('sidebar.invoices')}</p>
                </div>
            </Link>
            {isAdmin && <Link to="/settings">
                <div className={"d-flex sidebar-row "  + (location.pathname === '/settings' ? 'active' : '')}>
                    <Settings />
                    <p className={"pl-2"}>{t('sidebar.settings')}</p>
                </div>
            </Link>}
            <div className="d-flex sidebar-row " role="button" onClick={logOut}>
                <ExitToApp />
                <p className={"pl-2"}>{t('sidebar.logout')}</p>
            </div>

            <div className="language-selector">
                <p onClick={() => i18n.changeLanguage('hu')} className={i18n.language === 'hu' ? 'active': ''}>HU</p>
                <span> | </span>
                <p onClick={() => i18n.changeLanguage('en')} className={i18n.language === 'en' ? 'active': ''}>EN</p>
            </div>
        </div>
    )
}

export default Sidebar