import React, { useState } from 'react'
import { List, ListItem, ListItemSecondaryAction, Card } from '@material-ui/core'

function InvoiceItemSelector({items, setItemsLeft, setItemsToPay, itemsLeft, itemsToPay}) {

    

    const addToPayable = (clickedItem) => {
        if(clickedItem.quantity > 1) {
            setItemsLeft(itemsLeft.map(item => item.name === clickedItem.name ? {...item, quantity: item.quantity - 1} : item))
        }else{
            setItemsLeft(itemsLeft.filter(item => item.name !== clickedItem.name))
        }
        if(itemsToPay.map(item => item.name).includes(clickedItem.name)) {
            setItemsToPay(itemsToPay.map(item => item.name === clickedItem.name ? {...item, quantity: item.quantity + 1} : item))
        }else{
            setItemsToPay([...itemsToPay, {...clickedItem, quantity: 1}])
        }
    }

    const addToItemsLeft = (clickedItem) => {
        if(clickedItem.quantity > 1) {
            setItemsToPay(itemsToPay.map(item => item.name === clickedItem.name ? {...item, quantity: item.quantity - 1} : item))
        }else{
            setItemsToPay(itemsToPay.filter(item => item.name !== clickedItem.name))
        }
        if(itemsLeft.map(item => item.name).includes(clickedItem.name)) {
            setItemsLeft(itemsLeft.map(item => item.name === clickedItem.name ? {...item, quantity: item.quantity + 1} : item))
        }else{
            setItemsLeft([...itemsLeft, {...clickedItem, quantity: 1}])
        }
    }

    return (
        <div style={{display: 'flex'}}>
            <Card className="m-2" style={{minWidth: 350}}>
                <List>
                    {
                        itemsLeft.map(item => {
                            return (
                                <ListItem key={'left' + item.name} onClick={() => addToPayable(item)} button>
                                    { item.name }
                                    <ListItemSecondaryAction>
                                        x{item.quantity}
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Card>
            <Card className="m-2" style={{minWidth: 350}}>
                <List>
                    {
                        itemsToPay.map(item => {
                            return (
                                <ListItem key={'pay' + item.name} onClick={() => addToItemsLeft(item)} button>
                                    { item.name }
                                    <ListItemSecondaryAction>
                                        x{item.quantity}
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Card>
        </div>
    )
}

export default InvoiceItemSelector