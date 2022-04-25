import { Button, Dialog } from '@mui/material'
import { TextField } from '@material-ui/core'
import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { t } from 'i18next'

function Navbar() {

    const [modalOpen, setModalOpen] = useState(false)
    const restaurantId = useRef(null)
    const togglerRef = useRef(null)
    const navigate = useNavigate()
    
    const showJoinModal = () => {
        setModalOpen(true)
        togglerRef.current.click()
    }

    const goToInvitePage = (e) => {
        e.preventDefault()

        setModalOpen(false)
        navigate('invite/' + restaurantId.current.value)
        restaurantId.current.value = ''
    }

    return(
        <>
            <nav className="navbar navbar-expand-md bg-light navbar-light desktop-navbar">
            <a className="navbar-brand">Restify</a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span ref={togglerRef} className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="collapsibleNavbar">
                <ul className="navbar-nav me-auto">
                    <Link to="/" onClick={() => togglerRef.current.click()}>
                        <li className="nav-item">
                            <p className="nav-link m-0">{t('sidebar.login')}</p>
                        </li>
                    </Link>
                    <Link to="/register" onClick={() => togglerRef.current.click()}>
                        <li className="nav-item">
                            <p className="nav-link m-0">{t('sidebar.register')}</p>
                        </li>
                    </Link>
                    <div role="button" onClick={showJoinModal}>
                        <li className="nav-item">
                            <p className="nav-link m-0">{t('sidebar.join-to-team')}</p>
                        </li>
                    </div>
                    <Link to="/" onClick={() => togglerRef.current.click()}>
                        <li className="nav-item">
                            <p className="nav-link m-0">{t('sidebar.download-assets')}</p>
                        </li>
                    </Link>
                </ul>
            </div>
            </nav>
            {modalOpen && 
                <Dialog open={true} onClose={() => setModalOpen(false)}>
                    <div className="px-5 py-4">
                        <form className="text-center" onSubmit={goToInvitePage}>
                            <TextField inputRef={restaurantId} type="text" placeholder='Étterem azonosítója' />
                            <br />
                            <Button onClick={goToInvitePage} style={{flex: 'auto'}}>{t('commons.next')}</Button>
                        </form>
                    </div>
                </Dialog>
            }
        </>
    )
}

export default  Navbar