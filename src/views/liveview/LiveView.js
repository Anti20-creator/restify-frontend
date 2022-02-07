import { AppBar, Button, Dialog, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Close, SearchOutlined } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import Table from '../../components/editor/Table';
import './LiveView.css'
import API from '../../communication/API';
import { layout } from '../../store/features/layoutSlice';
import { useSelector, useDispatch } from 'react-redux';
import { menuItems } from '../../store/features/menuSlice';
import { tablesInUseSelector } from '../../store/features/liveSlice';
import BookTableModal from '../../components/liveview/BookTableModal';
import Invoice from '../../components/liveview/Invoice';
import MenuItems from '../../components/liveview/MenuItems';
import { getSocket } from '../../communication/socket';
import { setItems } from '../../store/features/invoiceSlice';

function LiveView() {

    const dispatch = useDispatch()
    const [tables, setTables] = useState([])
    const layoutValue = useSelector(layout)
    const menu = useSelector(menuItems)
    const tablesInUse = useSelector(tablesInUseSelector)
    const priceUnit = 'Ft'

    useEffect(() => {
        setTables(layoutValue.map((table) => {
            return {
                coordinates: table.coordinates,
                type: table.tableType,
                localId: table.localId,
                rounded: table.tableType === "rounded",
                size: table.size,
                rotated: table.direction == 1,
                tableCount: table.tableCount,
                TableId: table.TableId
            }
        }))
    }, [layoutValue, menu])
    const [liveTableId, setLiveTableId] = useState(-1)
    const [bookTableModalOpen, setBookTableModalOpen] = useState(false)
    const [selectedTable, setSelectedTable] = useState(-1)

    const handleTableClick = (id) => {
        setSelectedTable(id)
        if(tablesInUse.includes(id)) {
            // Table is booked
            setLiveTableId(id)
        }else{
            // Table is not booked
            setBookTableModalOpen(true)
        }
    }

    const bookTable = () => {
        console.log(selectedTable)
        API.post('api/tables/book', {tableId: selectedTable})
    }


  return (
      <>
        {
            tables.map((table) => (
                <div key={table.localId} onClick={() => handleTableClick(table.TableId)}>
                    <Table
                        id={table.localId}
                        rounded={table.rounded} 
                        tableCount={table.tableCount} 
                        type={table.type} 
                        rotated={table.rotated}
                        coordinates={table.coordinates}
                        editable={false}
                        inUse={tablesInUse.includes(table.TableId)}
                        />
                </div>
            ))
        }
        <Dialog fullScreen open={liveTableId !== -1} onClose={() => { setLiveTableId(-1); getSocket().emit('leave-table', {tableId: selectedTable}); dispatch(setItems([])) }}>
            <AppBar style={{position: 'relative'}}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => { setLiveTableId(-1); getSocket().emit('leave-table', {tableId: selectedTable}) }} aria-label="close">
                        <Close />
                    </IconButton>
                    <Typography variant="h6">
                        Asztal #{liveTableId}
                    </Typography>
                    <Button color="inherit" onClick={() => { setLiveTableId(-1); getSocket().emit('leave-table', {tableId: selectedTable}) }}>
                        Bezárás
                    </Button>
                </Toolbar>
            </AppBar>
            
            <div className="col-12 d-flex table-view">
                <div className="col-8 items text-center">
                    <div className="searchbox">
                        <div className="d-flex align-items-center flex-grow-1">
                            <SearchOutlined />
                            <input type="text" className="search-input w-100" placeholder="Ételek keresése" />
                        </div>
                    </div>
                    <div className="col-12 items-holder">
                        <div className="row mx-auto">
                            <MenuItems tableId={selectedTable} />
                        </div>
                    </div>
                </div>
                <div className="col-4 checkout">
                    <Invoice tableId={selectedTable} localId={liveTableId} />
                </div>
            </div>
        </Dialog>
        <BookTableModal open={bookTableModalOpen} onClose={() => setBookTableModalOpen(false)}
            bookTable={() => bookTable()} />
      </>
  )
}

export default LiveView;
