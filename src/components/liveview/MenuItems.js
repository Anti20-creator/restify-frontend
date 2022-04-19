import React, { useEffect, useState } from 'react';
import { menuItems } from '../../store/features/menuSlice'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardContent } from '@material-ui/core'
import API from '../../communication/API';
import { getSocket } from '../../communication/socket';
import { toast } from 'react-toastify';
import { addItem } from '../../store/features/invoiceSlice';
import { getCurrency } from '../../store/features/temporarySlice';
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function MenuItems({searchText}) {
    
    const tableId = useParams().id
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const menu = useSelector(menuItems)
    const priceUnit = useSelector(getCurrency)
    const [filteredMenu, setFilteredMenu] = useState([])

    useEffect(() => {
        setFilteredMenu(menu.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase())))
    }, [searchText, menu])

    const postItem = async (item) => {
        const order = {name: item.name, quantity: 1, category: item.category, price: item.price}
        await API.post('/api/tables/order', {item: order, tableId, socketId: getSocket().id}).then((response) => {
            dispatch(addItem(order))
            toast.info(t(`api.${response.data.message}`), {autoClose: 1000});
        }).catch(err => {
            toast.error(t(`api.${err.response.data.message}`), {
                autoClose: 1500
            })
        })
    }
    
    return (
        <>
            {
                filteredMenu.sort((a, b) => a.name > b.name ? 1 : -1).map((item) => (
                    <div key={item.name} className="col-md-4 col-lg-3">
                        <Card style={{backgroundColor: '#D9DBBC'}} onClick={() => {postItem(item)}} className="m-1 text-center h-100 menu-card">
                            <CardContent className="p-3 h-100 d-flex flex-column align-items-center justify-content-center">
                                <p className="fw-bold"> {item.name.slice(0, 50)} {item.name.length > 50 ? '...' : ''} </p>
                                <p className="fw-light">{item.price} {priceUnit} {item.amount > 1 && `/ ${item.amount} ${item.unit}`} </p>
                            </CardContent>
                        </Card>
                    </div>
                ))
            }
        </>
    )
}

export default MenuItems;
