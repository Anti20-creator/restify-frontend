import React from 'react';
import { menuItems } from '../../store/features/menuSlice'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardContent } from '@material-ui/core'
import { addItem } from '../../store/features/invoiceSlice'
import API from '../../communication/API';

function MenuItems({tableId}) {
    
    const menu = useSelector(menuItems)
    const dispatch = useDispatch()
    const priceUnit = 'Ft'

    const postItem = async (item) => {
        // TODO: SECURITY RISK!! Frontend cannot send price!!!
        await API.post('/api/tables/order', {item: {name: item.name, quantity: 1, category: item.category, price: item.price}, tableId})
    }
    
    return (
        <>
            {
                menu.map((item) => (
                    <div key={item.name} className="col-sm-4 col-md-3 col-6">
                        <Card onClick={() => {postItem(item)}} className="m-1 text-center h-100 menu-card">
                            <CardContent className="p-3 h-100 d-flex flex-column align-items-center justify-content-center">
                                <p className="fw-bold"> {item.name} </p>
                                <p className="fw-light">{item.price} {priceUnit}</p>
                            </CardContent>
                        </Card>
                    </div>
                ))
            }
        </>
    )
}

export default MenuItems;
