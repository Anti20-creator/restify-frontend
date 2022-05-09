import React, { useState, useEffect, useRef } from 'react'
import {
    Avatar, Box,
    IconButton,
    Modal, List,
    ListItem, Menu, MenuItem, Fab,
    ListItemAvatar, TextField,
    ListItemText, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button
} from "@material-ui/core"
import {SearchOutlined, GroupAdd, MoreVert, Delete, ArrowUpward, ArrowDownward} from "@material-ui/icons"
import { toast } from 'react-toastify'
import './Team.css'
import API from '../../communication/API'
import useWindowSize from '../../store/useWindowSize'
import { useTranslation } from 'react-i18next'
import moment from 'moment-timezone'
import { stringToColor } from '../../utils/stringToColor'
import { t } from 'i18next'

function Team() {
    
    const columns = [
        { id: 'user', label: t('commons.user') },
        { id: 'role', label: t('commons.rights')},
        {
            id: 'invited',
            label: t('commons.status'),
        },
        {
            id: 'date',
            label: t('commons.joined'),
        },
        { id: 'dots', label: ''}
    ];

    const { width } = useWindowSize();
    const { i18n } = useTranslation()
    const emailRef = useRef('')
    const [rowData, setRowData] = useState({})
    const [anchorEl, setAnchorEl] = useState(null)
    const [openMobileDialog, setOpenMobileDialog] = useState(false)
    const [open, setOpen] = useState(false)
    const [members, setMembers] = useState([])
    const [filteredMembers, setFilteredMembers] = useState(members)
    
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    useEffect(() => {
        API.get('/api/users/team').then(result => {
            if(result.data.success) {
                setMembers(result.data.message)
                setFilteredMembers(result.data.message)
            }else{
                toast.error(t('api.team-loading-error'), {autoClose: 1500})
                setMembers([])
            }
        })
    }, [])
    
    const changeRank = (promote) => {
        const rankToast = toast.loading(t('api.updating-ranks'))
        API.post('/api/users/update-rank', {
            email: rowData.email,
            promote: !promote
        }).then(result => {
            setOpenMobileDialog(false)
            setMembers(members.map(member => member.email === rowData.email ? {...member, isAdmin: !promote} : member))
            toast.update(rankToast, {render: t(`api.${result.data.message}`), autoClose: 1200, type: 'success', isLoading: false})
        }).catch(err => {
            toast.update(rankToast, {render: t(`api.${err.response.data.message}`), autoClose: 1200, type: 'error', isLoading: false})
        })
    }

    const sendInvite = (e) => {
        e.preventDefault()
        const email = e.target.elements.email.value
        
        if(!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            toast.error(t('api.invalid-email'), {
                autoClose: 1500
            })
            return
        }
        
        if(members.map(member => member.email).includes(email)) {
            toast.error(t('api.team-already-exists'), {
                autoClose: 1500
            })
            return
        }

        const inviteToast = toast.loading(t('api.inviting-user'))
        API.post('/api/users/send-invite', {emailTo: email, lang: i18n.language}).then(result => {
            members.push({
                email,
                isAdmin: false,
                fullName: '',
            })
            filter()
            setOpen(false)
            toast.update(inviteToast, { render: t(`api.${result.data.message}`), type: "success", isLoading: false, autoClose: 2000 })
        }).catch(err => {    
            toast.update(inviteToast, { render: t(`api.${err.response.data.message}`), type: "error", isLoading: false, autoClose: 2000 })
        })
    }

    const removeMember = (email) => {
        const userToast = toast.loading(t('api.loading-removing-user'))
        API.delete('api/users/delete', {data: {email}}).then(result => {
            setMembers(members.filter(member => member.email !== email))
            filter()
            toast.update(userToast, {render: t(`api.${result.data.message}`), type: "success", isLoading: false, autoClose: 1200})
        }).catch(err => {
            toast.update(userToast, {render: t(`api.${err.response.data.message}`), type: "error", isLoading: false, autoClose: 1200})  
        })
    }

    const dateFromObjectId = function (objectId) {
        return (parseInt(objectId.substring(0, 8), 16) * 1000)
    }

    const filter = () => {
        setFilteredMembers(members.filter(member => member.email.toLowerCase().includes(emailRef.current.toLowerCase()) || 
        (member.fullName && member.fullName.toLowerCase().includes(emailRef.current.toLowerCase()))))
    }

    const filterUsers = (e) => {
        emailRef.current = e.target.value
        filter()
    }

    useEffect(() => {
        filter()
    }, [members]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={"w-100 m-auto team h-100 p-3"}>
            <div className="d-flex align-items-center searchbox justify-content-between px-4" style={{height: '10%'}}>
                <div className="d-flex flex-grow-1">
                    <SearchOutlined />
                    <input onKeyUp={filterUsers} type="text" className="search-input w-100" placeholder={t('commons.filter-by')} />
                </div>
                {width > 768 && <div className="d-flex invite-box flex-grow-1">
                    <Button color="primary" variant="outlined" startIcon={<GroupAdd />} onClick={handleOpen}>
                        {t('commons.invite')}
                    </Button>
                </div>}
            </div>
            {width > 768 && <TableContainer sx={{height: '100%'}}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        >
                        {column.label}
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredMembers
                    .map((member) => {
                        return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={member.email}>
                            <TableCell>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar style={{backgroundColor: stringToColor(member.email)}}>
                                            { member.fullName ? member.fullName.charAt(0) : member.email.charAt(0) }
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={member.fullName} secondary={member.email} />
                                </ListItem>
                            </TableCell>
                            <TableCell>
                                {member.isAdmin ? t('commons.admin') : t('commons.user')}
                            </TableCell>
                            <TableCell>
                                {member.fullName ? t('commons.active') : t('commons.invited')}
                            </TableCell>
                            <TableCell>
                                {member._id ? moment(dateFromObjectId(member._id)).format("L HH:mm") : '' }
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={(e) => {setRowData(member); setAnchorEl(e.currentTarget)} }>
                                    <MoreVert />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        );
                    })}
                </TableBody>
                </Table>
                <Menu
                    trans={false}
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={anchorEl !== null}
                    onClose={() => setAnchorEl(null)}
                    onClick={() => setAnchorEl(null)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                >
                    <MenuItem onClick={() => changeRank('isAdmin' in rowData && rowData.isAdmin)}>
                        {'isAdmin' in rowData && rowData.isAdmin ? 
                            <>
                                <ArrowDownward /> 
                                {t('commons.down-rank')}
                            </>
                            :
                            <>
                                <ArrowUpward />
                                {t('commons.up-rank')}
                            </> 
                        }
                    </MenuItem>
                    <MenuItem onClick={() => removeMember(rowData.email)}>
                        <Delete /> {t('commons.remove')}
                    </MenuItem>
                </Menu>
            </TableContainer>}
            {width <= 768 &&
                <List>
                    {
                        filteredMembers.map((member) => (
                            <ListItem onClick={() => {setRowData(member); setOpenMobileDialog(true) }} style={{borderBottom: '1px solid #ececec'}} key={member.email}>
                                <ListItemAvatar>
                                    <Avatar style={{backgroundColor: stringToColor(member.email)}}>
                                        { member.fullName ? member.fullName.charAt(0) : member.email.charAt(0) }
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={member.fullName} secondary={member.email} />
                            </ListItem>
                        ))
                    }
                </List>
            }
            <Modal
            open={openMobileDialog}
            onClose={() => setOpenMobileDialog(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="team-dialog"
            >
                <Box>
                    <h5><span className="fw-bold">Email:</span> <span>{rowData.email}</span></h5>
                    {rowData.fullName && <h5><span className="fw-bold">Név:</span> <span>{rowData.fullName}</span></h5>}
                    {rowData._id && <h5><span className="fw-bold">Rang:</span> <span>{rowData.isAdmin ? 'Admin' : 'Felhasználó'}</span></h5>}

                    <div className="d-flex text-center w-100 justify-content-between pt-3">
                        <Button variant="outlined" color="primary" onClick={() => changeRank('isAdmin' in rowData && rowData.isAdmin)}>
                            {'isAdmin' in rowData && rowData.isAdmin ? 
                                t('commons.down-rank')
                                :
                                t('commons.up-rank')
                            }
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => removeMember(rowData.email)}>
                            {t('commons.remove')}
                        </Button>
                    </div>
                </Box>
            </Modal>


            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="team-dialog"
            >
                <Box>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('commons.invite-user')}
                    </Typography>
                    <form className="text-center" onSubmit={sendInvite}>
                        <TextField name="email" label="E-mail" variant="standard" type="email" className="my-4" />
                        <br />
                        <Button variant="contained" color="primary" className="m-auto" type="submit">
                            {t('commons.send-invite')}
                        </Button>
                    </form>
                </Box>
            </Modal>

            {width <= 768 &&
            <Fab onClick={handleOpen} style={{position: 'fixed', right: '0.5rem', bottom: '0.5rem'}} aria-label={"Add member"} color={"primary"}>
                <GroupAdd />
            </Fab>}
        </div>
    )
}

export default Team