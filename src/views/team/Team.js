import React, { useState, useEffect, useRef } from 'react'

import {
    Avatar, Box,
    IconButton,
    Modal, List,
    ListItem, Menu, MenuItem, Fab,
    ListItemAvatar, TextField,
    ListItemText, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button
} from "@material-ui/core";
import {SearchOutlined, GroupAdd, MoreVert, Delete, ArrowUpward, ArrowDownward} from "@material-ui/icons";
import './Team.css'
import { toast } from 'react-toastify'
import API from '../../communication/API'
import useWindowSize from '../../store/useWindowSize'

const columns = [
    { id: 'user', label: 'Felhasználó' },
    { id: 'role', label: 'Jogok'},
    {
        id: 'invited',
        label: 'Státusz',
    },
    {
        id: 'date',
        label: 'Csatlakozott',
        format: (value) => value.toLocaleISOString(),
    },
    { id: 'dots', label: ''}
];


function Team() {

    const changeRank = (promote) => {
        const rankToast = toast.loading('Felhasználói jogok módosítása...')
        API.post('/api/users/update-rank', {
            email: rowData.email,
            promote: !promote
        }).then(result => {
            setMembers(members.map(member => member.email === rowData.email ? {...member, isAdmin: !promote} : member))
            toast.update(rankToast, {render: 'Jogok frissítve!', autoClose: 1200, type: 'success', isLoading: false})
        }).catch(err => {
            toast.update(rankToast, {render: 'Hiba a frissítés során!', autoClose: 1200, type: 'error', isLoading: false})
        })
    }
    const [rowData, setRowData] = useState({})
    const [anchorEl, setAnchorEl] = useState(null)
    const [openMobileDialog, setOpenMobileDialog] = useState(false)
    const { height, width } = useWindowSize();
    const stringToColor = function(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let colour = '#';
        for (let i = 0; i < 3; i++) {
          let value = (hash >> (i * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    }

    useEffect(() => {
        API.get('/api/users/team').then(result => {
            console.log(result.data.message)
            if(result.data.success) {
                setMembers(result.data.message)
                setFilteredMembers(result.data.message)
            }else{
                toast.error('Hiba a csapat betöltése során!', {autoClose: 1500})
                setMembers([])
            }
        })
    }, [])

    const sendInvite = (e) => {
        e.preventDefault()
        const email = e.target.elements.email.value
        if(members.map(member => member.email).includes(email)) {
            toast.error('Ez a felhasználó már a csapat tagja!', {
                autoClose: 1500
            })
            return
        }
        const inviteToast = toast.loading(email + ' meghívása...')
        API.post('/api/users/send-invite', {emailTo: email}).then(result => {
            if(result.data.success) {
                members.push({
                    email,
                    isAdmin: false,
                    fullName: '',
                })
                filter()
                toast.update(inviteToast, { render: email + " meghívva!", type: "success", isLoading: false, autoClose: 2000 })
            }else{
                toast.update(inviteToast, { render: "Hiba a meghívás során!", type: "error", isLoading: false, autoClose: 2000 })
            }
        })
        setOpen(false)
    }

    const removeMember = (email) => {
        const userToast = toast.loading(email + ' eltávolítása...')
        API.delete('api/users/delete', {data: {email}}).then(result => {
            if(result.data.success) {
                setMembers(members.filter(member => member.email !== email))
                filter()
                toast.update(userToast, {render: email + ' eltávolítva!', type: "success", isLoading: false, autoClose: 1200})
            }
        }).catch(err => {
            toast.update(userToast, {render: "Hiba az eltávolítás során!", type: "error", isLoading: false, autoClose: 1200})  
        })
    }

    const dateFromObjectId = function (objectId) {
        return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    }

    const emailRef = useRef('')
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [members, setMembers] = useState([])
    const [filteredMembers, setFilteredMembers] = useState(members)

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
    }, [members])

    return (
        <div className={"w-100 m-auto team h-100 p-3"}>
            <div className="d-flex align-items-center searchbox justify-content-between px-4" style={{height: '10%'}}>
                <div className="d-flex flex-grow-1">
                    <SearchOutlined />
                    <input onKeyUp={filterUsers} type="text" className="search-input w-100" placeholder="Szűrés név vagy e-mail alapján..." />
                </div>
                {width > 768 && <div className="d-flex invite-box flex-grow-1">
                    <Button color="primary" variant="outlined" startIcon={<GroupAdd />} onClick={handleOpen}>
                        Meghívás
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
                    .map((member, idx) => {
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
                                {member.isAdmin ? 'Admin' : 'Felhasználó'}
                            </TableCell>
                            <TableCell>
                                {member.fullName ? 'Aktív' : 'Meghívott'}
                            </TableCell>
                            <TableCell>
                                {member._id ? dateFromObjectId(member._id).toLocaleString() : '' }
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
                                Lefokozás
                            </>
                            :
                            <>
                                <ArrowUpward />
                                Előléptetés
                            </> 
                        }
                    </MenuItem>
                    <MenuItem onClick={() => removeMember(rowData.email)}>
                        <Delete /> Eltávolítás
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
                                'Lefokozás'
                                :
                                'Előléptetés'
                            }
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => removeMember(rowData.email)}>
                            Eltávolítás
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
                        Felhasználó meghívása
                    </Typography>
                    <form className="text-center" onSubmit={sendInvite}>
                        <TextField name="email" label="E-mail" variant="standard" type="email" className="my-4" />
                        <br />
                        <Button variant="contained" color="primary" className="m-auto" type="submit">
                            Meghívó küldése
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