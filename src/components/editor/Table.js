import React, { useEffect, useReducer, useState } from 'react'
import { Badge, IconButton, makeStyles, Popover, Typography } from '@material-ui/core'
import './Table.css'
import { Add, Delete, Remove, RotateRight, Settings } from '@material-ui/icons'
import { useSelector } from 'react-redux'
import { tablesInUseSelector } from '../../store/features/liveSlice'

function Table({rounded, tableCount, type='normal', size='average', rotated=false, coordinates, id, removePeople, addPeople, rotateTable, editable, removeTable, inUse}) {

    const [anchorEl, setAnchorEl] = useState(null)

    const sizes = {
        'small': 80,
        'average': 100,
        'large': 120
    }
    const width = sizes[size]
    const strokeDasharray = `36, ${((width/2-2) * 2 * Math.PI - tableCount * 36) / tableCount}`

    return (
      <div className={(editable ? "draggable drag-item " : "table-display ") + (inUse ? 'in-use' : '')} style={{
          transform: "translate(" + coordinates.x + "px ," + coordinates.y + "px)"
      }} data-x={coordinates.x} data-y={coordinates.y} local-id={id}>
      {rounded ? 
        <div className={"res-table rounded " + size + " position-relative"}>
            <svg viewBox={"0 0 " + width + " " + width} className='position-absolute top-0'>
                <circle cx={width/2} cy={width/2} r={width/2-2} strokeDasharray={strokeDasharray} fill="transparent" stroke="#aeb1c1" strokeWidth={width * 0.032} />
            </svg>
            <Badge badgeContent={id+1} color="primary">
                <div className="table-border">
                    <div className="table-count">
                        <p>{ tableCount }</p>
                    </div>
                </div>
            </Badge>
        </div>
       :
          <div className={"res-table d-flex " + type + " " + size + " " + (rotated ? 'rotated' : '')}>
              <div className="d-flex flex-column justify-content-center align-items-center side-seats">
                  <div className="vertical-seat"></div>
                  <div className="vertical-seat"></div>
              </div>
              <div className="table-holder">
                <div className="d-flex justify-content-center align-items-center top-bottom-seats">
                    <div className="horizontal-seat"></div>
                    <div className="horizontal-seat"></div>
                </div>
                <Badge badgeContent={id+1} color="primary">
                    <div className="table-border">
                        <div className="table-count">
                            <p>{tableCount}</p>
                        </div>
                    </div>
                </Badge>
                <div className="d-flex justify-content-center align-items-center top-bottom-seats">
                    <div className="horizontal-seat"></div>
                    <div className="horizontal-seat"></div>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center side-seats">
                  <div className="vertical-seat"></div>
                  <div className="vertical-seat"></div>
              </div>
        </div> }
        {
            editable &&
            <>
                <div className="settings-btn-holder">
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <Settings />
                    </IconButton>
                </div>
                <Popover
                    open={anchorEl !== null}
                    onClose={() => setAnchorEl(null)}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    <div className="d-flex align-items-center settings">
                        <IconButton onClick={removePeople}>
                            <Remove />
                        </IconButton>
                        <p>{ tableCount }</p>
                        <IconButton onClick={addPeople}>
                            <Add />
                        </IconButton>
                        <IconButton onClick={rotateTable}>
                            <RotateRight />
                        </IconButton>
                        <IconButton onClick={removeTable}>
                            <Delete />
                        </IconButton>
                    </div>
                </Popover>
            </>
        }
    </div>
  )
}

export default Table;
