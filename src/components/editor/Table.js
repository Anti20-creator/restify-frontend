import React, { useState, useEffect } from 'react'
import { Badge, IconButton, Popover } from '@material-ui/core'
import './Table.css'
import { Add, Delete, Remove, RotateRight, Settings } from '@material-ui/icons'

function Table({rounded, tableCount, type='normal', size='average', direction, coordinates, id, removePeople, addPeople, rotateTable, editable, removeTable, inUse}) {

    const sizes = {
        'small': 80,
        'average': 100,
        'large': 120
    }

    const width = sizes[size]
    
    const strokeDasharray = !(tableCount > 6 && type === 'rounded') ? `36, ${((width/2-2) * 2 * Math.PI - tableCount * 36) / tableCount}` : `25, ${((width/2-2) * 2 * Math.PI - tableCount * 25) / tableCount}`
    const [anchorEl, setAnchorEl] = useState(null)
    const [borderCounts, setBorderCounts] = useState([0, 0, 0, 0])

    useEffect(() => {
        const newBorderCounts = [0, 0, 0, 0]
        for(let i = 0; i < Math.min(tableCount, 8); ++i) {
            newBorderCounts[(i + (direction / 90)) % 4] += 1
        }
        for(let i = 8; i < tableCount; i++) {
            if(i === 14) {
                newBorderCounts[(0 + (direction / 90)) % 4] += 1
            }
            else if(i === 15) {
                newBorderCounts[(2 + (direction / 90)) % 4] += 1
            }else {
                newBorderCounts[((i * 2 + 1) + (direction / 90)) % 4] += 1
            }
        }

        setBorderCounts(newBorderCounts)
    }, [tableCount, direction])

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
          <div className={"res-table d-flex " + type + " " + size + " " + (direction === 90 || direction === 270 ? 'rotated' : '') + " " + (tableCount > 10 ? 'wider' : '') + " " + (tableCount > 12 ? 'extra-wide' : '')}>
              <div className="d-flex flex-column justify-content-center align-items-center side-seats">
                    {
                        Array.from(Array(borderCounts[0])).map((_, idx) => {
                            return(
                              <div key={`vertical-left#${idx}`} className="vertical-seat"></div>
                            )
                        })
                    }
              </div>
              <div className="table-holder">
                <div className="d-flex justify-content-center align-items-center top-bottom-seats">
                    {
                        Array.from(Array(borderCounts[1])).map((_, idx) => {
                            return(
                              <div key={`horizontal-top#${idx}`} className="horizontal-seat"></div>
                            )
                        })
                    }
                </div>
                <Badge badgeContent={id+1} color="primary">
                    <div className="table-border">
                        <div className="table-count">
                            <p>{tableCount}</p>
                        </div>
                    </div>
                </Badge>
                <div className="d-flex justify-content-center align-items-center top-bottom-seats">
                    {
                        Array.from(Array(borderCounts[3])).map((_, idx) => {
                            return(
                              <div key={`horizontal-bottom#${idx}`} className="horizontal-seat"></div>
                            )
                        })
                    }
                </div>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center side-seats">
                  {
                        Array.from(Array(borderCounts[2])).map((_, idx) => {
                            return(
                              <div key={`vertical-right#${idx}`} className="vertical-seat"></div>
                            )
                        })
                    }
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
                        <IconButton disabled={tableCount === 1} onClick={removePeople}>
                            <Remove />
                        </IconButton>
                        <p>{ tableCount }</p>
                        <IconButton disabled={(type === 'wide' && tableCount === 20) || (type !== 'wide' && tableCount === 8)} onClick={addPeople}>
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
