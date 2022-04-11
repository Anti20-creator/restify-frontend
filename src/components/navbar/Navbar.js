import { Button, Dialog, DialogActions, FormControl } from '@mui/material'
import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {

    const [modalOpen, setModalOpen] = useState(false)
    const restaurantId = useRef(null)
    const togglerRef = useRef(null)
    const navigate = useNavigate()
    
    const showJoinModal = () => {
        setModalOpen(true)
        togglerRef.current.click()
    }

    const goToInvitePage = () => {
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
                            <a className="nav-link">Belépés</a>
                        </li>
                    </Link>
                    <Link to="/register" onClick={() => togglerRef.current.click()}>
                        <li className="nav-item">
                            <a className="nav-link">Regisztráció</a>
                        </li>
                    </Link>
                    <div onClick={showJoinModal}>
                        <li className="nav-item">
                            <a className="nav-link">Csatlakozás csapathoz</a>
                        </li>
                    </div>
                    <Link to="/" onClick={() => togglerRef.current.click()}>
                        <li className="nav-item">
                            <a className="nav-link">Állományok letöltése</a>
                        </li>
                    </Link>
                </ul>
            </div>
            </nav>
            {modalOpen && 
                <Dialog open={true} onClose={() => setModalOpen(false)}>
                    <div className="px-5 py-4">
                        <FormControl>
                            <input ref={restaurantId} type="text" placeholder='Étterem azonosítója' />
                        </FormControl>
                        <DialogActions className="text-center">
                            <Button onClick={goToInvitePage} style={{flex: 'auto'}}>Tovább</Button>
                        </DialogActions>
                    </div>
                </Dialog>
            }
        </>
    )
}

export default  Navbar