import React, { useState, useEffect } from 'react'
import { Save } from '@material-ui/icons'
import { TableContainer, TableRow, TableCell, TableBody, TableHead, IconButton, Table,
        List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core'
import API from '../../communication/API'
import useWindowSize from '../../store/useWindowSize'
import { TablePagination } from '@material-ui/core'
import moment from 'moment-timezone'
import data from '../../communication/data.json'
import { t } from 'i18next'

function Invoices() {

    const [invoices, setInvoices] = useState([])
    const [rowData, setRowData] = useState(null)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const { width } = useWindowSize();
    
    useEffect(() => {
        moment.locale('hu')
        API.get('/api/invoices').then(({data}) => {
            setInvoices(data.message)
        })
    }, [])

    useEffect(() => {
        if(rowData) {
            download()
        }
    }, [rowData]) // eslint-disable-line react-hooks/exhaustive-deps

    const download = async() => {
        window.open(data.base_uri + '/api/invoices/download/' + rowData.invoiceName)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 25));
        setPage(0);
    };

    return (
        <div className={"w-100 m-auto invoices h-100 p-3"}>
            {width > 768 ?
            <TableContainer sx={{height: '100%'}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {t('commons.invoice-name')}
                            </TableCell>
                            <TableCell>
                                {t('commons.exhibitor')}
                            </TableCell>
                            <TableCell>
                                {t('commons.date')}
                            </TableCell>
                            <TableCell>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                    {moment(invoice.date).utcOffset(0).format('L HH:mm')}
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
                    {invoices.length > 25 && <TablePagination
                        rowsPerPageOptions={[25, 50, 75]}
                        component="div"
                        count={invoices.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />}
                </Table>
            </TableContainer>
            :
            <List>
                {invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((invoice) => (
                    <ListItem style={{borderBottom: '1px solid #ececec'}}>
                        <ListItemText primary={moment(invoice.date).utcOffset(0).format("L HH:mm")} secondary={invoice.email} />
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