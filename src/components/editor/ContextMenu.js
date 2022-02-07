import { Menu } from '@material-ui/core';
import React from 'react';
import './ContextMenu.css'

function ContextMenu({locationX, locationY, children}) {
  return (
        <Menu
        keepMounted
        open={true}
        anchorReference="anchorPosition"
        anchorPosition={
        locationY !== null && locationX !== null
            ? { top: locationY, left: locationX }
            : undefined
        }
        >
            {children}
        </Menu>
  )
}

export default ContextMenu;
