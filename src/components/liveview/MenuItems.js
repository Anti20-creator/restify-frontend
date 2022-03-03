import React, { useEffect, useState } from 'react';
import { menuItems } from '../../store/features/menuSlice'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardContent } from '@material-ui/core'
import API from '../../communication/API';
import { getSocket } from '../../communication/socket';
import { toast } from 'react-toastify';
import { addItem } from '../../store/features/invoiceSlice';
import { useParams } from 'react-router-dom'

function MenuItems({searchText}) {
    
    const dispatch = useDispatch()
    const menu = useSelector(menuItems)
    const priceUnit = 'Ft'
    const tableId = useParams().id
    const [filteredMenu, setFilteredMenu] = useState([])

    const postItem = async (item) => {
        const order = {name: item.name, quantity: 1, category: item.category, price: item.price}
        await API.post('/api/tables/order', {item: order, tableId, socketId: getSocket().id}).then((response) => {
            if (response.data.success) {
                dispatch(addItem(order))
            } else {
                toast.error('Hiba a rendelés közben!', {
                    autoClose: 1500
                })
            }
        })
    }

    useEffect(() => {
        setFilteredMenu(menu.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase())))
    }, [searchText, menu])
    
    return (
        <>
            {
                filteredMenu.map((item) => (
                    <div key={item.name} className="col-sm-4 col-md-3 col-6">
                        <Card onClick={() => {postItem(item)}} className="m-1 text-center h-100 menu-card">
                            <CardContent className="p-3 h-100 d-flex flex-column align-items-center justify-content-center">
                                <p className="fw-bold"> {item.name} </p>
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
