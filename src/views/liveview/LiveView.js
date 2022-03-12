import React, { useEffect, useState } from 'react';
import Table from '../../components/editor/Table';
import './LiveView.css'
import API from '../../communication/API';
import { layout } from '../../store/features/layoutSlice';
import { useSelector } from 'react-redux';
import { menuItems } from '../../store/features/menuSlice';
import { tablesInUseSelector } from '../../store/features/liveSlice';
import BookTableModal from '../../components/liveview/BookTableModal';
import { useNavigate } from 'react-router-dom';
import { layoutWidthSelector, layoutHeightSelector } from '../../store/features/layoutSlice'
import useWindowSize from '../../store/useWindowSize'
import { Visibility } from '@material-ui/icons'
import { Fab, List, ListItem, ListItemText, Divider } from '@material-ui/core'

function LiveView() {

    const [tables, setTables] = useState([])
    const [mobileView, setMobileView] = useState(false)
    const { width } = useWindowSize()
    const layoutValue = useSelector(layout)
    const menu = useSelector(menuItems)
    const tablesInUse = useSelector(tablesInUseSelector)
    const navigate = useNavigate()

    useEffect(() => {
        setTables(layoutValue.map((table) => {
            return {
                coordinates: table.coordinates,
                type: table.tableType,
                localId: table.localId,
                rounded: table.tableType === "rounded",
                size: table.size,
                direction: table.direction,
                tableCount: table.tableCount,
                TableId: table.TableId
            }
        }))
    }, [layoutValue, menu])
    const [liveTableId, setLiveTableId] = useState(-1)
    const [bookTableModalOpen, setBookTableModalOpen] = useState(false)
    const [selectedTable, setSelectedTable] = useState(-1)
    const [backgroundImage, setBackgroundImage]     = useState('')
    const layoutWidth                               = useSelector(layoutWidthSelector)
    const layoutHeight                              = useSelector(layoutHeightSelector)

    const handleTableClick = (id) => {
        setSelectedTable(id)
        if(tablesInUse.includes(id)) {
            // Table is booked
            setLiveTableId(id)
            navigate('/table/' + id)
        }else{
            // Table is not booked
            setBookTableModalOpen(true)
        }
    }

    const updateImage = async() => {
        API.get('/api/layouts/image').then(({data}) => {
            console.log(data.message)
            setBackgroundImage(data.message + `?ver=${new Date().getTime()}`)
        })
    }

    useEffect(() => {
        updateImage()
    }, [])

    const bookTable = () => {
        console.log(selectedTable)
        API.post('api/tables/book', {tableId: selectedTable})
    }


  return (
      <>
        <div style={{width: !mobileView ?  layoutWidth : '', 
                        height: !mobileView ?  layoutHeight : '', 
                        backgroundImage: !mobileView ?  `url(${backgroundImage})` : '', 
                        backgroundSize: 'cover', 
                        backgroundRepeat: 'no-repeat', 
                        backgroundPosition: 'center'}}>
        {
            !mobileView ?
            tables.map((table) => (
                <div key={table.localId} onClick={() => handleTableClick(table.TableId)}>
                    <Table
                        id={table.localId}
                        rounded={table.rounded} 
                        tableCount={table.tableCount} 
                        type={table.type} 
                        direction={table.direction}
                        coordinates={table.coordinates}
                        editable={false}
                        size={table.size}
                        inUse={tablesInUse.includes(table.TableId)}
                        />
                </div>
            ))
            :
            <List>
                <Divider />
                {
                    tables.map((table) => (
                        <>
                            <ListItem onClick={() => handleTableClick(table.TableId)}>
                                <ListItemText>
                                    Asztal #{ table.localId + 1 }
                                </ListItemText>
                            </ListItem>
                            <Divider />
                        </>
                    ))
                }   
            </List>
        }
        </div>
        {width <= 768 && <Fab onClick={() => setMobileView(!mobileView)} style={{position: 'fixed', right: '0.5rem', bottom: '0.5rem'}} aria-label={"Add member"} color={"primary"}>
            <Visibility />
        </Fab>}
        <BookTableModal open={bookTableModalOpen} onClose={() => setBookTableModalOpen(false)}
            bookTable={() => bookTable()} />
      </>
  )
}

export default LiveView;
