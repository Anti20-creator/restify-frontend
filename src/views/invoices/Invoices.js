import React, { useState, useEffect } from 'react'
import { Save } from '@material-ui/icons'
import { TableContainer, TableRow, TableCell, TableBody, TableHead, IconButton, Table,
        List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core'
import API from '../../communication/API'
import useWindowSize from '../../store/useWindowSize'

function Invoices() {

    const [invoices, setInvoices] = useState([])
    const [rowData, setRowData] = useState(null)
    const { width } = useWindowSize();

    useEffect(() => {
        API.get('/api/invoices').then(({data}) => {
            console.log(data.message)
            setInvoices(data.message)
        })
    }, [])

    useEffect(() => {
        if(rowData) {
            console.log(rowData)
            download()
        }
    }, [rowData])

    const download = async() => {
        window.open('https://192.168.31.214:4000/api/invoices/download/' + rowData.invoiceName)
    }

    return (
        <div className={"w-100 m-auto invoices h-100 p-3"}>
            {width > 768 ?
            <TableContainer sx={{height: '100%'}}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Számla neve
                        </TableCell>
                        <TableCell>
                            Kiállító
                        </TableCell>
                        <TableCell>
                            Számla kiállításának dátuma
                        </TableCell>
                        <TableCell>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {invoices
                    .map(invoice => {
                        return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={invoice.invoiceName}>
                            <TableCell>
                                {invoice.invoiceName}
                            </TableCell>
                            <TableCell>
                                {invoice.email}
                            </TableCell>
                            <TableCell>
                                {new Date(invoice.date).toLocaleString()}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={(e) => {setRowData(invoice)} }>
                                    <Save />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            :
            <List>
                {invoices.map((invoice) => (
                    <ListItem style={{borderBottom: '1px solid #ececec'}}>
                        <ListItemText primary={invoice.date} secondary={invoice.email} />
                        <ListItemSecondaryAction>
                            <IconButton onClick={(e) => {setRowData(invoice)}} edge="end" aria-label="save">
                              <Save />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            }
        </div>
    )
}

export default Invoices