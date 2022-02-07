import React, { createRef, useEffect, useRef, useState } from 'react';
import interact from 'interactjs'
import Table from '../../components/editor/Table';
import ContextMenu from '../../components/editor/ContextMenu';
import { MenuItem } from '@material-ui/core';
import API from '../../communication/API';
import { useDispatch, useSelector } from 'react-redux'
import { layout, modifiedLayout, updateLayout } from '../../store/features/layoutSlice'
import OutOfSyncBar from '../../components/editor/OutOfSyncBar';
import { getSocket } from '../../communication/socket';

function Editor() {

    interact('.draggable')
        .draggable({
        //onstart: () => setContextMenuOpened(false),
        // enable inertial throwing
        inertia: false,
        // keep the element within the area of it's parent
        modifiers: [
            interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: false
            }),
            interact.modifiers.restrictEdges({
                outer: {
                    left: 0,    // the left edge must be >= 0
                }
            })
        ],
        // enable autoScroll
        autoScroll: false,

        listeners: {
            // call this function on every dragmove event
            move: dragMoveListener,
        },
        })
        


    function dragMoveListener (event) {
        const target = event.target
        // keep the dragged position in the data-x/data-y attributes
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

        // translate the element
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

        // update the position attributes
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        setTables(
            tables.map(table => 
                table.localId == target.getAttribute('local-id')
                ? {...table, coordinates: {x: target.getAttribute('data-x'), y: target.getAttribute('data-y')}, updated: true } 
                : table 
        ))
    }

    const nextId = () => {
        const ids = tables.map(table => table.localId)
        for(let i = 0; i < ids.length; ++i) {
            if (!ids.includes(i)) {
                return i
            }
        }
        return ids.length
    }
    
    const editorNode = createRef()
    
    const dispatch = useDispatch()
    const [outOfSync, setOutOfSync] = useState(false)
    const [tables, setTables] = useState([])
    const [removedTables, setRemovedTables] = useState([])
    const [updatedTables, setUpdatedTables] = useState([])

    const [contextMenuOpened, setContextMenuOpened] = useState(false)
    const [contextMenuPlace, setContextMenuPlace] = useState({x: 0, y: 0})
    const [offset, setOffset] = useState(false)
    const layoutValue = useSelector(layout)
    const modifiedLayoutValue = useSelector(modifiedLayout)

    useEffect(() => {
        if(modifiedLayoutValue !== null) {
            setOutOfSync(true)
        }
    }, [modifiedLayoutValue])

    useEffect(async () => {
        setOffset({
            x: editorNode.current.getBoundingClientRect().left,
            y: editorNode.current.getBoundingClientRect().top
        })
    
        setTables(layoutValue.map((table) => {
            return {
                databaseID: table.TableId,
                coordinates: table.coordinates,
                type: table.tableType,
                localId: table.localId,
                rounded: table.tableType === "rounded",
                size: table.size,
                rotated: table.direction == 1,
                tableCount: table.tableCount
            }
        }))
    }, [layoutValue])

    
    const openEditorMenu = (e) => {
        e.preventDefault() 
        setContextMenuOpened(true)
        setContextMenuPlace({
            x: e.pageX,
            y: e.pageY
        })
    }

    const addTable = (type) => {
        setTables([...tables, {
            rounded: type == 'rounded',
            tableCount: 1,
            type,
            rotated: false,
            coordinates: {
                x: contextMenuPlace.x - offset.x,
                y: contextMenuPlace.y - offset.y,
            },
            size: "average",
            localId: nextId(),
            new: true
        }])
        setContextMenuOpened(false)
    }

    const addPeople = (id, quantity) => {
        setTables(
            tables.map(table => 
                table.localId === id 
                ? {...table, tableCount : table.tableCount + quantity} 
                : table
        ))
        if(!tables.find(table => table.localId === id).new) {
            const table = tables.find(table => table.localId === id)
            setUpdatedTables(
                [...updatedTables.filter(table => table.localId !== id), {...table, tableCount: table.tableCount + quantity}]
            )
        }
    }

    const rotateTable = (id) => {
        setTables(
            tables.map(table => 
                table.localId === id 
                ? {...table, rotated : !table.rotated} 
                : table 
        ))
        if(!tables.find(table => table.localId === id).new) {
            setUpdatedTables(
                [updatedTables.filter(table => table.localId !== id), tables.find(table => table.localId === id)]
            )
        }
    }

    const removeTable = (id) => {
        setRemovedTables(
            [...removedTables, id]
        )
        setTables(tables.filter(table => table.databaseID !== id))
    }

    const saveTables = async () => {
        if(modifiedLayoutValue !== null) return

        const result = await API.post('api/layouts/save', {newTables: tables.filter(table => table.new).map(table => {
            return {
                coordinates: table.coordinates,
                direction: table.rotated ? 1 : 0,
                size: table.size,
                tableCount: table.tableCount,
                tableType: table.type,
                localId: table.localId
            }
        }), removedTables: removedTables, updatedTables: updatedTables.map(table => {
            return {
                coordinates: table.coordinates,
                direction: table.rotated ? 1 : 0,
                size: table.size,
                tableCount: table.tableCount,
                tableType: table.type,
                databaseID: table.databaseID,
                localId: table.localId
            }
        }).concat(tables.filter(table => !table.new && table.updated).map(table => {
            return {
                coordinates: table.coordinates,
                direction: table.rotated ? 1 : 0,
                size: table.size,
                tableCount: table.tableCount,
                tableType: table.type,
                localId: table.localId,
                databaseID: table.databaseID
            }
        })) })
        setRemovedTables([])
        setUpdatedTables([])
        getSocket().emit('layout-modified', {tables: result.data.message})
        dispatch(updateLayout(result.data.message))

        console.log(result)
    }

  return (
      <>
        <div ref={editorNode} className="overflow-hidden w-100 h-100" onContextMenu={openEditorMenu} onDragStart={() => setContextMenuOpened(false)} onClick={() => setContextMenuOpened(false)}>
            {
                tables.map((table) => {
                    const key = table.localId
                    return(
                    <Table
                        key={key}
                        id={table.localId}
                        rounded={table.rounded} 
                        tableCount={table.tableCount} 
                        type={table.type} 
                        rotated={table.rotated}
                        coordinates={table.coordinates}
                        addPeople={() => addPeople(table.localId, 1)}
                        removePeople={() => addPeople(table.localId, -1)}
                        rotateTable={() => rotateTable(table.localId)}
                        removeTable={() => removeTable(table.databaseID)}
                        size={table.size}
                        editable={true}
                        />
                )})
            }

            {contextMenuOpened && 
                <ContextMenu locationX={contextMenuPlace.x} locationY={contextMenuPlace.y}>
                    <MenuItem onClick={() => addTable('rounded')}>Körasztal</MenuItem>
                    <MenuItem onClick={() => addTable('normal')}>Normál asztal</MenuItem>
                    <MenuItem onClick={() => addTable('wide')}>Széles asztal</MenuItem>
                    <MenuItem onClick={() => saveTables()}>Mentés</MenuItem>
                </ContextMenu>}

            <OutOfSyncBar open={outOfSync} setOpen={setOutOfSync} />
        </div>
      </>
  )
}

export default Editor;
