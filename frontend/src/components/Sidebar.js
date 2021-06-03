/* eslint-disable no-unused-vars */
import React from 'react'
import RedeemIcon from '@material-ui/icons/Redeem';
import PeopleIcon from '@material-ui/icons/People';
import HomeIcon from '@material-ui/icons/Home';
import BuildIcon from '@material-ui/icons/Build';
import DescriptionIcon from '@material-ui/icons/Description';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <p>Dashboard</p>
                <hr />
            </div>
            <div className="sidebar__menu">
                <Link to="/"><HomeIcon />Inicio</Link>
                <Link to="/productlist"> <RedeemIcon />Productos</Link>
                <Link to="/orderlist"><DescriptionIcon />Ordenes</Link>
                <Link to="/userlist"><PeopleIcon />Usuarios</Link>
                <Link to="statitics"><SettingsIcon />Estadisticas</Link>
                <hr />
                <Link to="/config"><BuildIcon />configuracion</Link>
            </div>
        </div>
    )
}

export default Sidebar
