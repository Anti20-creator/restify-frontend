import React, {  useRef } from 'react'
import './MobileNavbar.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import API from '../../communication/API'
import { t } from 'i18next'

function MobileNavbar({isAdmin}) {

	const navigate = useNavigate()
	const toggler  = useRef()

	const logOut = () => {
        API.get('api/users/logout').then(() => {
            navigate('/')
            window.location.reload();
        })
    }

	return(
		<>
		<nav className="navbar navbar-expand-md bg-dark navbar-dark mobile-navbar">
		  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
		  <a className="navbar-brand">Restify</a>

		  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
		    <span ref={toggler} className="navbar-toggler-icon"></span>
		  </button>

		  <div className="collapse navbar-collapse" id="collapsibleNavbar">
		    <ul className="navbar-nav">
		    	<Link onClick={() => toggler.current.click()} to="/">
		    		<li className="nav-item">
		        		<p className="nav-link">{t('sidebar.live-view')}</p>
		      		</li>
	            </Link>
	            <Link onClick={() => toggler.current.click()} to="/appointments">
	                <li className="nav-item">
		        		<p className="nav-link">{t('sidebar.appointments')}</p>
		      		</li>
	            </Link>
	            <Link onClick={() => toggler.current.click()} to="/team">
	            	<li className="nav-item">
		        		<p className="nav-link">{t('sidebar.team')}</p>
		      		</li>
	            </Link>
	            {isAdmin && <Link onClick={() => toggler.current.click()} to="/menu">
	            	<li className="nav-item">
		        		<p className="nav-link">{t('sidebar.menu')}</p>
		      		</li>
	            </Link>}
	            {isAdmin && <Link onClick={() => toggler.current.click()} to="/edit">
	            	<li className="nav-item">
		        		<p className="nav-link">{t('sidebar.editor')}</p>
		      		</li>
	            </Link>}
	            <Link onClick={() => toggler.current.click()} to="/invoices">
	            	<li className="nav-item">
		        		<p className="nav-link">{t('sidebar.invoices')}</p>
		      		</li>
	            </Link>
	            {isAdmin && <Link onClick={() => toggler.current.click()} to="/settings">
	            	<li className="nav-item">
		        		<p className="nav-link">{t('sidebar.settings')}</p>
		      		</li>
	            </Link>}
	            <div onClick={() => { toggler.current.click(); logOut() }}>
	            	<li className="nav-item">
		        		<p className="nav-link">{t('sidebar.logout')}</p>
		      		</li>
	            </div>
		    </ul>
		  </div>
		</nav>
		
		</>
	)
}

export default MobileNavbar