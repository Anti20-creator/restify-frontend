import React, {useState} from 'react'

import {
    Avatar, Box,
    Checkbox,
    Modal,
    ListItem, Snackbar,
    ListItemAvatar, TextField,
    ListItemText, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, FormControl
} from "@material-ui/core";
import {SearchOutlined, GroupAdd} from "@material-ui/icons";
import './Team.css'
import MuiAlert from '@material-ui/lab/Alert'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const columns = [
    { id: 'checkbox', label: ''},
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
];

function Team() {

    const [checked, setChecked] = useState([0]);
    const stringToColor = function(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var i = 0; i < 3; i++) {
          var value = (hash >> (i * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    }

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const sendInvite = (e) => {
        e.preventDefault()
        const email = e.target.elements.email.value
        if(members.includes(email) || email.length < 4) {
            setSeverity('error')
            setAlertMessage('Error while trying to invite!')
            setOpenSnackbar(true)
            return
        }
        setSeverity('success')
        setAlertMessage(email + ' invited!')
        setOpenSnackbar(true)
        setOpen(false)
    }

    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const closeAlert = () => setOpenSnackbar(false);
    const [severity, setSeverity] = useState('success')
    const [alertMessage, setAlertMessage] = useState('')

    const members = [
        {
            name: 'Felix',
            email: 'felix@miro.com',
            role: 'Tag'
        },{
            name: 'Jane',
            email: 'jane@miro.com',
            role: 'Admin'
        },
        {
            name: 'Miro',
            email: 'mirouser@miro.com',
            role: 'Tag'
        },
        {
            name: 'Felix',
            email: 'felix@miro.com',
            role: 'Tag'
        },{
            name: 'Jane',
            email: 'jane@miro.com',
            role: 'Admin'
        },
        {
            name: 'Miro',
            email: 'mirouser@miro.com',
            role: 'Tag'
        },
        {
            name: 'Felix',
            email: 'felix@miro.com',
            role: 'Tag'
        },{
            name: 'Jane',
            email: 'jane@miro.com',
            role: 'Admin'
        },
        {
            name: 'Miro',
            email: 'mirouser@miro.com',
            role: 'Tag'
        },
        {
            name: 'Miro',
            email: 'mirouser@miro.com',
            role: 'Tag'
        },
        {
            name: 'Felix',
            email: 'felix@miro.com',
            role: 'Tag'
        },{
            name: 'Jane',
            email: 'jane@miro.com',
            role: 'Admin'
        },
        {
            name: 'Miro',
            email: 'mirouser@miro.com',
            role: 'Tag'
        },
    ]
    const [filteredMembers, setFilteredMembers] = useState(members)

    const filterUsers = (e) => {
        setFilteredMembers(members.filter(member => member.email.toLowerCase().includes(e.target.value.toLowerCase()) || member.name.toLowerCase().includes(e.target.value.toLowerCase())))
    }

    return (
        <div className={"w-100 m-auto team h-100 p-3"}>
            <div className="d-flex align-items-center searchbox justify-content-between px-4" style={{height: '10%'}}>
                <div className="d-flex flex-grow-1">
                    <SearchOutlined />
                    <input onKeyUp={filterUsers} type="text" className="search-input w-100" placeholder="Szűrés név vagy e-mail alapján..." />
                </div>
                <div className="d-flex invite-box flex-grow-1">
                    <Button color="primary" variant="outlined" startIcon={<GroupAdd />} onClick={handleOpen}>
                        Meghívás
                    </Button>
                </div>
            </div>
            <TableContainer sx={{height: '100%'}}>
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
                        const labelId = `checkbox-list-secondary-label-${member.email}`;
                        return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={Math.random() * 100000}>
                            <TableCell>
                                <Checkbox
                                    onClick={handleToggle(member.email)}
                                    edge="start"
                                    checked={checked.indexOf(member.email) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                    />
                            </TableCell>
                            <TableCell>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar style={{backgroundColor: stringToColor(member.email)}}>
                                            { member.name.charAt(0) }
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={member.name} secondary={member.email} />
                                </ListItem>
                            </TableCell>
                            <TableCell>
                                {member.role}
                            </TableCell>
                            <TableCell>
                                Meghívva
                            </TableCell>
                            <TableCell>
                                {new Date().toISOString().slice(0, 10)}
                            </TableCell>

                        </TableRow>
                        );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
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
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={closeAlert}>
                <Alert onClose={closeAlert} severity={severity} sx={{ width: '100%' }}>
                    { alertMessage }
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Team