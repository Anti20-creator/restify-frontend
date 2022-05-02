import React, { createRef, useEffect, useState } from 'react';
import interact from 'interactjs'
import Table from '../../components/editor/Table';
import ContextMenu from '../../components/editor/ContextMenu';
import { MenuItem, Fab } from '@material-ui/core';
import { Settings } from '@material-ui/icons'
import API from '../../communication/API';
import { useDispatch, useSelector } from 'react-redux'
import { layout, modifiedLayout, updateLayout, layoutWidthSelector, layoutHeightSelector } from '../../store/features/layoutSlice'
import OutOfSyncBar from '../../components/editor/OutOfSyncBar';
import { getSocket } from '../../communication/socket';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import EditorSettings from '../../components/editor/EditorSettings';
import NestedMenuItem from 'material-ui-nested-menu-item'
import useWindowSize from '../../store/useWindowSize'
import { Dialog } from '@mui/material'
import { useTranslation } from 'react-i18next';

function Editor() {

    interact('.draggable')
        .draggable({
        inertia: false,
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
        ],
        autoScroll: false,
        listeners: {
            move: dragMoveListener
        }
    })

    function dragMoveListener (event) {
        const target = event.target
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        setTables(
            tables.map(table => 
                parseInt(table.localId) === parseInt(target.getAttribute('local-id'))
                ? {...table, coordinates: {x: target.getAttribute('data-x'), y: target.getAttribute('data-y')}, updated: true } 
                : table 
        ))
    }
    
    const dispatch = useDispatch()
    const [outOfSync, setOutOfSync]                 = useState(false)
    const { width }                                 = useWindowSize()
    const { t }                                     = useTranslation()
    const layoutValue                               = useSelector(layout)
    const modifiedLayoutValue                       = useSelector(modifiedLayout)
    const layoutHeight                              = useSelector(layoutHeightSelector)
    const layoutWidth                               = useSelector(layoutWidthSelector)
    const editorNode                                = createRef()
    const [tables, setTables]                       = useState([])
    const [removedTables, setRemovedTables]         = useState([])
    const [updatedTables, setUpdatedTables]         = useState([])
    const [settingsOpen, setSettingsOpen]           = useState(false)
    const [contextMenuOpened, setContextMenuOpened] = useState(false)
    const [contextMenuPlace, setContextMenuPlace]   = useState({x: 0, y: 0})
    const [offset, setOffset]                       = useState(false)
    const [backgroundImage, setBackgroundImage]     = useState('')
    const [settingsModalOpen, setSettingsModalOpen] = useState(false)

    useEffect(() => {
        updateImage()
    }, [modifiedLayoutValue])

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

    const updateImage = async() => {
        API.get('/api/layouts/image').then(({data}) => {
            setBackgroundImage(data.message + `?ver=${new Date().getTime()}`)
        })
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
        setContextMenuOpened(false)
    }

    const addPeople = (id, quantity) => {
        const table = tables.find(table => table.localId === id)
        if((table.tableCount === 8 && quantity > 0) && table.type !== 'wide' ) {
            return
        }
        if((table.tableCount === 20 && quantity > 0) && table.type === 'wide') {
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
        if(modifiedLayoutValue !== null) {
            toast.error(t('api.cant-modify-layout'))
            return
        }

        const savingToast = toast.loading(t('api.updating-layout'), {autoClose: 2000});
        await API.post('api/layouts/save', {newTables: tables.filter(table => table.new).map(table => {
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
        }))}).then((response) => {
            toast.update(savingToast, { render: t('api.layout-updated'), type: "success", isLoading: false, autoClose: 2000 })
            getSocket().emit('layout-modified', {tables: response.data.message})
            dispatch(updateLayout(response.data.message))
            setRemovedTables([])
            setUpdatedTables([])
        })
        .catch((err) => {
            toast.update(savingToast, { render: t(`api.${err.response.data.message}`), type: "error", isLoading: false, autoClose: 2000 })
            return
        })
    }

  return (
      <>
        <div ref={editorNode} className="w-100 h-100 editor" onContextMenu={openEditorMenu} onDragStart={() => setContextMenuOpened(false)} onClick={() => setContextMenuOpened(false)}>
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
                    <NestedMenuItem onClick={() => addTable('rounded', 'average')} label={t('commons.round-table')} parentMenuOpen={true}>
                        <MenuItem onClick={() => addTable('rounded', 'small')}>
                            {t('commons.small')}
                        </MenuItem>
                        <MenuItem onClick={() => addTable('rounded', 'average')}>
                            {t('commons.average')}
                        </MenuItem>
                        <MenuItem onClick={() => addTable('rounded', 'large')}>
                            {t('commons.big')}
                        </MenuItem>
                    </NestedMenuItem>
                    <NestedMenuItem onClick={() => addTable('normal', 'average')} label={t('commons.normal-table')} parentMenuOpen={true}>
                        <MenuItem onClick={() => addTable('normal', 'small')}>
                            {t('commons.small')}
                        </MenuItem>
                        <MenuItem onClick={() => addTable('normal', 'average')}>
                            {t('commons.average')}
                        </MenuItem>
                        <MenuItem onClick={() => addTable('normal', 'large')}>
                            {t('commons.big')}
                        </MenuItem>
                    </NestedMenuItem>
                    <NestedMenuItem onClick={() => addTable('wide', 'small')} label={t('commons.wide-table')} parentMenuOpen={true}>
                        <MenuItem onClick={() => addTable('wide', 'small')}>
                            {t('commons.small')}
                        </MenuItem>
                        <MenuItem onClick={() => addTable('wide', 'average')}>
                            {t('commons.average')}
                        </MenuItem>
                        <MenuItem onClick={() => addTable('wide', 'large')}>
                            {t('commons.big')}
                        </MenuItem>
                    </NestedMenuItem>
                    <MenuItem onClick={() => setSettingsOpen(true)}>{t('commons.settings')}</MenuItem>
                    <MenuItem onClick={() => saveTables()}>{t('commons.save')}</MenuItem>
                </ContextMenu>}

            {settingsOpen &&
                <EditorSettings close={() => {setSettingsOpen(false); updateImage();}} initialX={layoutWidth} initialY={layoutHeight} />}
 
            {width <= 768 && settingsModalOpen &&
            <Dialog open={true} onClose={() => setSettingsModalOpen(false)}>
                <NestedMenuItem label={t('commons.round-table')} parentMenuOpen={true}>
                        <MenuItem onClick={() => addTable('rounded', 'small')}>
                            {t('commons.small')}
                        </MenuItem>
                        <MenuItem onClick={() => addTable('rounded', 'average')}>
                            {t('commons.average')}
                        </MenuItem>
                        <MenuItem onClick={() => addTable('rounded', 'large')}>
                            {t('commons.big')}
                        </MenuItem>
                    </NestedMenuItem>
                    <NestedMenuItem label={t('commons.normal-table')} parentMenuOpen={true}>
                        <MenuItem onClick={() => addTable('normal', 'small')}>
                            {t('commons.small')}
                        </MenuItem>
                        <MenuItem onClick={() => addTable('normal', 'average')}>
                            {t('commons.average')}
                        </MenuItem>
                        <MenuItem onClick={() => addTable('normal', 'large')}>
                            {t('commons.big')}
                        </MenuItem>
                    </NestedMenuItem>
                    <NestedMenuItem label={t('commons.wide-table')} parentMenuOpen={true}>
                        <MenuItem onClick={() => addTable('wide', 'small')}>
                            {t('commons.small')}
                        </MenuItem>
                        <MenuItem onClick={() => addTable('wide', 'average')}>
                            {t('commons.average')}
                        </MenuItem>
                        <MenuItem onClick={() => addTable('wide', 'large')}>
                            {t('commons.big')}
                        </MenuItem>
                    </NestedMenuItem>
                    <MenuItem onClick={() => setSettingsOpen(true)}>{t('commons.settings')}</MenuItem>
                    <MenuItem onClick={() => saveTables()}>{t('commons.save')}</MenuItem>
            </Dialog>}

            {width <= 768 &&
            <Fab onClick={() => setSettingsModalOpen(true)} style={{position: 'fixed', right: '0.5rem', bottom: '0.5rem'}} aria-label={"Add member"} color={"primary"}>
                <Settings />
            </Fab>}

            <OutOfSyncBar open={outOfSync} setOpen={setOutOfSync} />
        </div>
      </>
  )
}

export default Editor;
