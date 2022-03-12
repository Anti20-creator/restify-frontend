import React, { createRef, useEffect, useState } from 'react';
import interact from 'interactjs'
import Table from '../../components/editor/Table';
import ContextMenu from '../../components/editor/ContextMenu';
import { MenuItem, Menu } from '@material-ui/core';
import API from '../../communication/API';
import { useDispatch, useSelector } from 'react-redux'
import { layout, modifiedLayout, updateLayout } from '../../store/features/layoutSlice'
import OutOfSyncBar from '../../components/editor/OutOfSyncBar';
import { getSocket } from '../../communication/socket';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import EditorSettings from '../../components/editor/EditorSettings';
import { layoutWidthSelector, layoutHeightSelector } from '../../store/features/layoutSlice'
import NestedMenuItem from 'material-ui-nested-menu-item'
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
            }),
            interact.modifiers.snap({
                targets: [
                  interact.snappers.grid({ x: 5, y: 5 })
                ],
                range: Infinity,
                relativePoints: [ { x: 0, y: 0 } ]
            }),
        ],
        // enable autoScroll
        autoScroll: false,

        listeners: {
            // call this function on every dragmove event
            move: dragMoveListener
        }
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
                parseInt(table.localId) === parseInt(target.getAttribute('local-id'))
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
    const [outOfSync, setOutOfSync]                 = useState(false)
    const [tables, setTables]                       = useState([])
    const [removedTables, setRemovedTables]         = useState([])
    const [updatedTables, setUpdatedTables]         = useState([])
    const [settingsOpen, setSettingsOpen]           = useState(false)
    const [contextMenuOpened, setContextMenuOpened] = useState(false)
    const [contextMenuPlace, setContextMenuPlace]   = useState({x: 0, y: 0})
    const [offset, setOffset]                       = useState(false)
    const [backgroundImage, setBackgroundImage]     = useState('')
    const layoutValue                               = useSelector(layout)
    const modifiedLayoutValue                       = useSelector(modifiedLayout)
    const layoutHeight                              = useSelector(layoutHeightSelector)
    const layoutWidth                               = useSelector(layoutWidthSelector)

    const updateImage = async() => {
        API.get('/api/layouts/image').then(({data}) => {
            console.log(data.message)
            setBackgroundImage(data.message + `?ver=${new Date().getTime()}`)
        })
    }

    useEffect(() => {
        updateImage()
    }, [])

    useEffect(() => {
        if(modifiedLayoutValue !== null) {
            setOutOfSync(true)
        }
    }, [modifiedLayoutValue])

    useEffect(() => {
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
                direction: table.direction,
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

    const addTable = (type, size) => {
        setTables([...tables, {
            rounded: type === 'rounded',
            tableCount: 1,
            type,
            direction: 0,
            coordinates: {
                x: contextMenuPlace.x - offset.x,
                y: contextMenuPlace.y - offset.y,
            },
            size: size,
            localId: nextId(),
            new: true
        }])
        console.log(tables)
        setContextMenuOpened(false)
    }

    const addPeople = (id, quantity) => {
        const table = tables.find(table => table.localId === id)
        if((table.tableCount === 8 && quantity > 0) && table.type !== 'wide' ) {
            return
        }
        if((table.tableCount === 10 && quantity > 0) && table.type === 'wide') {
            return
        }
        if(table.tableCount === 1 && quantity < 0) {
            return
        }

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
                ? {...table, direction : (table.direction + 90) % 360} 
                : table 
        ))
        if(!tables.find(table => table.localId === id).new) {
            setUpdatedTables(
                [updatedTables.filter(table => table.localId !== id), tables.find(table => table.localId === id)]
            )
        }
    }

    const removeTable = (databaseId, id) => {
        if(databaseId) {
            setRemovedTables(
                [...removedTables, databaseId]
            )
        }
        setTables(tables.filter(table => table.localId !== id))
    }

    const saveTables = async () => {
        if(modifiedLayoutValue !== null) return

        const savingToast = toast.loading('Elrendezés frissítése...', {
            position: "bottom-center",
            progress: undefined,
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false
        });
        const result = await API.post('api/layouts/save', {newTables: tables.filter(table => table.new).map(table => {
            return {
                coordinates: table.coordinates,
                direction: table.direction,
                size: table.size,
                tableCount: table.tableCount,
                tableType: table.type,
                localId: table.localId
            }
        }), removedTables: removedTables, updatedTables: updatedTables.map(table => {
            return {
                coordinates: table.coordinates,
                direction: table.direction,
                size: table.size,
                tableCount: table.tableCount,
                tableType: table.type,
                databaseID: table.databaseID,
                localId: table.localId
            }
        }).concat(tables.filter(table => !table.new && table.updated).map(table => {
            return {
                coordinates: table.coordinates,
                direction: table.direction,
                size: table.size,
                tableCount: table.tableCount,
                tableType: table.type,
                localId: table.localId,
                databaseID: table.databaseID
            }
        }))})
        .catch(() => {
            toast.update(savingToast, { render: "Hiba a frissítés során", type: "error", isLoading: false, autoClose: 2000 })
            return
        })


        setRemovedTables([])
        setUpdatedTables([])
        getSocket().emit('layout-modified', {tables: result.data.message})
        dispatch(updateLayout(result.data.message))
        if(result && result.data.success) {
            toast.update(savingToast, { render: "Elrendezés frissítve", type: "success", isLoading: false, autoClose: 2000 })
        }

        console.log(result)
    }

  return (
      <>
        <div ref={editorNode} className="w-100 h-100" onContextMenu={openEditorMenu} onDragStart={() => setContextMenuOpened(false)} onClick={() => setContextMenuOpened(false)}>
            <div style={{width: layoutWidth, height: layoutHeight, backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
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
                                direction={table.direction}
                                coordinates={table.coordinates}
                                addPeople={() => addPeople(table.localId, 1)}
                                removePeople={() => addPeople(table.localId, -1)}
                                rotateTable={() => rotateTable(table.localId)}
                                removeTable={() => removeTable(table.databaseID, table.localId)}
                                size={table.size}
                                editable={true}
                                />
                    )})
                }
            </div>

            {contextMenuOpened && 
                <ContextMenu locationX={contextMenuPlace.x} locationY={contextMenuPlace.y}>
                    <NestedMenuItem label={'Körasztal'} parentMenuOpen={true}>
                        <MenuItem onClick={() => addTable('rounded', 'small')}>
                            Kicsi
                        </MenuItem>
                        <MenuItem onClick={() => addTable('rounded', 'average')}>
                            Közepes
                        </MenuItem>
                        <MenuItem onClick={() => addTable('rounded', 'large')}>
                            Nagy
                        </MenuItem>
                    </NestedMenuItem>
                    <NestedMenuItem label={'Normál asztal'} parentMenuOpen={true}>
                        <MenuItem onClick={() => addTable('normal', 'small')}>
                            Kicsi
                        </MenuItem>
                        <MenuItem onClick={() => addTable('normal', 'average')}>
                            Közepes
                        </MenuItem>
                        <MenuItem onClick={() => addTable('normal', 'large')}>
                            Nagy
                        </MenuItem>
                    </NestedMenuItem>
                    <NestedMenuItem label={'Széles asztal'} parentMenuOpen={true}>
                        <MenuItem onClick={() => addTable('wide', 'small')}>
                            Kicsi
                        </MenuItem>
                        <MenuItem onClick={() => addTable('wide', 'average')}>
                            Közepes
                        </MenuItem>
                        <MenuItem onClick={() => addTable('wide', 'large')}>
                            Nagy
                        </MenuItem>
                    </NestedMenuItem>
                    {/*<MenuItem onClick={() => addTable('rounded')}>Körasztal</MenuItem>
                    <MenuItem onClick={() => addTable('normal')}>Normál asztal</MenuItem>
                    <MenuItem onClick={() => addTable('wide')}>Széles asztal</MenuItem>*/}
                    <MenuItem onClick={() => setSettingsOpen(true)}>Beállítások</MenuItem>
                    <MenuItem onClick={() => saveTables()}>Mentés</MenuItem>
                </ContextMenu>}

            {settingsOpen &&
                <EditorSettings close={() => {setSettingsOpen(false); updateImage();}} initialX={layoutWidth} initialY={layoutHeight} />}

            <OutOfSyncBar open={outOfSync} setOpen={setOutOfSync} />
        </div>
      </>
  )
}

export default Editor;
