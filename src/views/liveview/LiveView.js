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

function LiveView() {

    const [tables, setTables] = useState([])
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
                rotated: table.direction === 1,
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
            navigate('/table/' + id)
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
                        size={table.size}
                        inUse={tablesInUse.includes(table.TableId)}
                        />
                </div>
            ))
        }
        <BookTableModal open={bookTableModalOpen} onClose={() => setBookTableModalOpen(false)}
            bookTable={() => bookTable()} />
      </>
  )
}

export default LiveView;
