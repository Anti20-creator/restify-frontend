import React, {useState} from 'react'
import { Box, Button, Card, CardContent, FormControl, MenuItem, Modal, Select, TextField, Typography, IconButton } from '@material-ui/core'
import './Menu.css'
import { ArrowBack, Edit } from '@material-ui/icons'
import { menuState, addCategory, addItem } from '../../store/features/menuSlice'
import { useSelector } from 'react-redux'
import API from '../../communication/API'
import { useDispatch } from 'react-redux'
import EditCategory from '../../components/menu/EditCategory'
import EditItem from '../../components/menu/EditItem'

function Menu() {

    const dispatch = useDispatch()
    const [item, setItem] = useState('')
    const [editCategory, setEditCategory] = useState('')
    const [addModalOpen, setModalOpen] = useState(false)
    const [category, setCategory] = useState('')
    const [categoryIcon, setCategoryIcon] = useState('')
    const priceUnit = 'Ft'

    const icons = [
        'Noodles',
        'Bread',
        'Steak',
        'Cupcake',
        'Fish Food'
    ]

    const addCategoryForm = (e) => {
        e.preventDefault()
        const category = e.target.elements.category.value
        const icon = e.target.elements.icon.value
        if(!icon || !category) {
            // Nincs elég adat
            return
        }
        if(Object.keys(menu.icons).includes(category)) {
            // Már van ilyen kategória
            return
        }
        
        API.post('/api/menu/add-category', {category, categoryIcon: icon}).then(result => {
            if(result.status === 201) {
                dispatch(addCategory({category, categoryIcon: icon}))
            }
        })

        setModalOpen(false)
    }

    const addItemForm = (e) => {
        e.preventDefault()
        const name = e.target.elements.food.value
        const price = e.target.elements.price.value
        const amount = e.target.elements.amount.value
        const unit = e.target.elements.unit.value
        API.post('/api/menu/add-item', {name, category, price, amount, unit}).then(result => {
            if(result.status === 201) {
                dispatch(addItem({name, category, price, amount, unit}))
            }
        })
        setModalOpen(false)
    }
    const menu = useSelector(menuState)

    const formIconChange = (e) => {
        setCategoryIcon(e.target.value)
    }

    return (
        <div className="menu container-fluid overflow-auto">
            <div className="col-12">
                {
                    category === '' ?
                    <div className="categories-holder row align-items-center mx-auto">
                        <div className="col-sm-5 col-md-3 col-6">
                            <Card onClick={() => setModalOpen(true)} className="m-3 text-center menu-card category-card">
                                <CardContent className="p-3 d-flex flex-column align-items-center justify-content-center h-100">
                                    <img alt="Category icon" src={'/assets/menu-icons/Pie.svg'} />
                                    <p className="fw-bold m-0 mt-3">Új kategória</p>
                                </CardContent>
                            </Card>
                        </div>
                        {
                            Object.keys(menu.icons).map((key) => (
                                <div key={key} className="col-sm-5 col-md-3 col-6 position-relative">
                                    <div className="position-absolute" style={{right: '10%', top: '10%', zIndex: '100'}}>
                                        <IconButton onClick={() => setEditCategory(key)}>
                                            <Edit />
                                        </IconButton>
                                    </div>
                                    <Card onClick={() => { setCategory(key) }} className="m-3 text-center menu-card category-card">
                                        <CardContent className="p-3 d-flex flex-column align-items-center justify-content-center h-100">
                                            <img alt="Category icon" src={'/assets/menu-icons/' + menu.icons[key] + '.svg'} />
                                            <p className="fw-bold mt-3">{key}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))
                        }
                    </div> 
                    :
                    <>
                        <IconButton onClick={() => setCategory('') }>
                            <ArrowBack />
                        </IconButton>
                        <div className="items-holder row align-items-center mx-auto">
                            <div className="col-sm-4 col-md-3 col-6">
                                <Card onClick={() => setModalOpen(true)} className="m-1 text-center menu-card">
                                    <CardContent className="p-3">
                                        <p className="mt-3">&nbsp;</p>
                                        <p>&nbsp;</p>
                                        <p style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} className="fw-bold">Új étel</p>
                                    </CardContent>
                                </Card>
                            </div>
                            {
                                Object.keys(menu.items[category]).map((key) => (
                                    <div key={key} className="col-sm-4 col-md-3 col-6">
                                        <Card onClick={() => {setItem(key) }} className="m-1 text-center h-100 menu-card">
                                            <CardContent className="p-3 h-100 d-flex flex-column align-items-center justify-content-center">
                                                <p className="fw-bold">{key}</p>
                                                <p className="fw-light">{menu.items[category][key].price} {priceUnit}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))
                            }
                        </div> 
                    </>

                }
            </div>
            <Modal
            open={addModalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
                <Box>
                    {
                        category === '' ?
                        <>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Új kategória létrehozása
                            </Typography>
                            <form className="text-center" onSubmit={addCategoryForm}>
                                <TextField name="category" label="Kategória neve" variant="standard" type="text" className="my-2" />
                                <FormControl>
                                    <Select
                                    value={categoryIcon}
                                    onChange={formIconChange}
                                    displayEmpty
                                    name="icon"
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        <MenuItem value="">
                                            <em>-</em>
                                        </MenuItem>
                                        {
                                            icons.map((icon) => (
                                                <MenuItem key={icon} value={icon}>{icon}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <br />
                                <Button variant="contained" color="primary" className="m-auto mt-2" type="submit">
                                    Hozzáad
                                </Button>
                            </form>
                        </>
                        :
                        <>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Új elem hozzáadása
                            </Typography>
                            <form className="text-center" onSubmit={addItemForm}>
                                <TextField name="food" label="Elem neve" variant="standard" type="text" className="my-2" />
                                <TextField name="price" label="Ár" variant="standard" type="number" className="my-2" />
                                <TextField name="amount" label="Mennyiség" variant="standard" type="number" className="my-2" />
                                <TextField name="unit" label="Egység" variant="standard" type="text" className="my-2" />
                                <br />
                                <Button variant="contained" color="primary" className="m-auto mt-2" type="submit">
                                    Hozzáad
                                </Button>
                            </form>
                        </>
                    }
                </Box>
            </Modal>
            <EditCategory open={editCategory !== ''} setOpen={setEditCategory} category={editCategory} />
            <EditItem open={item !== ''} setOpen={setItem} itemName={item} category={category} />
        </div>
    )
}

export default Menu