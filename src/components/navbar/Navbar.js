import React from 'react'
import {Avatar, Badge} from "@material-ui/core";
import {Notifications} from "@material-ui/icons";
import './Navbar.css'

function Navbar() {
    return(
        <div className={"navbar"}>
            <div>
                <img className={"logo"} src={"https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/7a3ec529632909.55fc107b84b8c.png"} />
            </div>

            <div className={"d-flex align-items-center notifications"}>
                <div className={"notification-badge-holder"}>
                    <Badge badgeContent={1} color="primary">
                        <Notifications />
                    </Badge>
                </div>
                <Avatar />
                <p className={"m-0"}> Amtmann Kristóf </p>
            </div>
        </div>
    )
}

export default  Navbar