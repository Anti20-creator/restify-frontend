/* eslint-disable jest/valid-title */
import data from '../../../src/communication/data.json'
const {faker} = require('@faker-js/faker')
const FRONTEND_URL = 'http://localhost:3000'

Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

const getNextMonday = () => {
  const dateCopy = new Date(new Date().getTime())
  const nextMonday = new Date(dateCopy.setDate(dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7)))
  return nextMonday
}
const adminEmail = faker.unique(() => faker.internet.email())
const invitedEmail = faker.unique(() => faker.internet.email())
const deletedEmail = faker.unique(() => faker.internet.email())
const appointmentDate = getNextMonday()
let globalRestaurantId = null

describe('Delete cookies', () => {
  it('', () => {
    cy.visit(data.base_uri)
    cy.setCookie('Refresh-token', '')
    cy.setCookie('Authorization', '')
  })
})
  
Cypress.Cookies.defaults({
  preserve: ['Refresh-token', 'Authorization']
})

describe('Register a new user', () => {

  it('Registering the user - failed attempt - empty password', () => {
    cy.visit(FRONTEND_URL + '/register')

    const name = faker.name.findName()
    const company = faker.company.companyName()
    cy.get('input').eq(0).type(name)
    cy.get('input').eq(1).type(company)
    cy.get('input').eq(2).type(adminEmail)

    cy.get('form button').last().click()
    cy.wait(1500)

    cy.get('input').eq(0).should('have.value', name)
    cy.get('input').eq(1).should('have.value', company)
    cy.get('input').eq(2).should('have.value', adminEmail)
    cy.get('input').eq(3).should('have.value', "")
  })

  it('Registering the user - failed attempt - no password', () => {
    
    const name = faker.name.findName()
    const company = faker.company.companyName()

    cy.get('input').eq(0).clear().type(name)
    cy.get('input').eq(1).clear().type(company)
    cy.get('input').eq(2).clear().type(adminEmail)
    cy.get('input').eq(3).clear().type("123")

    cy.get('form button').last().click()
    cy.wait(800)

    cy.get('input').eq(0).should('have.value', name)
    cy.get('input').eq(1).should('have.value', company)
    cy.get('input').eq(2).should('have.value', adminEmail)
    cy.get('input').eq(3).should('have.value', "123")
  })

  it('Registering the user', () => {
    cy.visit(FRONTEND_URL + '/register')

    cy.get('input').eq(0).clear().type(faker.name.findName())
    cy.get('input').eq(1).clear().type(faker.company.companyName())
    cy.get('input').eq(2).clear().type(adminEmail)
    cy.get('input').eq(3).clear().type("123456")

    cy.get('form button').last().click()
    cy.wait(800)
    cy.url().should('eq', FRONTEND_URL + '/')

  })
})

describe('Testing logging in', () => {

  it('Logging in - bad email', () => {
    cy.get('input').should('have.length', 2)

    cy.get('input[type="email"]').type('a' + adminEmail)
    cy.get('input[type="password"]').type("123456")
    cy.get('form button').last().click()
    
    cy.get('.sidebar-row').should('have.length', 0)
    
    cy.get('input[type="email"]').should('have.value', 'a' + adminEmail)
    cy.get('input[type="password"]').should('have.value', "123456")

    cy.wait(1500)
  })

  it('Logging in - bad password', () => {
    cy.get('input').should('have.length', 2)

    cy.get('input[type="email"]').clear().type(adminEmail)
    cy.get('input[type="password"]').clear().type("1234567")
    cy.get('form button').last().click()
    
    cy.get('.sidebar-row').should('have.length', 0)
    
    cy.get('input[type="email"]').should('have.value', adminEmail)
    cy.get('input[type="password"]').should('have.value', "1234567")

    cy.wait(1500)
  })

  it('Logging in', () => {
    cy.get('input').should('have.length', 2)

    cy.get('input[type="email"]').clear().type(adminEmail)
    cy.get('input[type="password"]').clear().type("123456")
    cy.get('form button').last().click()
    
    cy.wait(4500)

    cy.get('.sidebar-row').should('have.length', 8)

    cy.wait(2500)
  })

})

describe('Test settings page', () => {

  it('Go to settings page', () => {

    cy.visit(FRONTEND_URL + '/settings')

    cy.wait(2500)

  })

  it('Add informations and modify opening times - bad opening times', () => {

    cy.wait(4000)

    cy.get('input').eq(0).should('have.value', "")
    cy.get('input').eq(1).should('have.value', "")
    cy.get('input').eq(2).should('have.value', "")
    cy.get('input').eq(3).should('have.value', "")
    cy.get('input').eq(4).should('have.value', "")

    cy.get('input').eq(0).type(faker.address.city())
    cy.get('input').eq(1).type(faker.address.zipCode())
    cy.get('input').eq(2).type(faker.address.streetAddress())
    cy.get('input').eq(3).type(faker.datatype.number({min: 1000000, max: 100000000}))
    cy.get('input').eq(4).type(faker.phone.phoneNumber())

    cy.get('input').eq(5).clear().type("08:00-04:00")
    cy.get('input').eq(6).clear().type("03:00-22:00")
    cy.get('input').eq(7).clear().type("09:00-22:00")
    cy.get('input').eq(8).clear().type("00:00-00:00")
    cy.get('input').eq(9).clear().type("09:00-22:00")
    cy.get('input').eq(10).clear().type("05:00-02:00")
    cy.get('input').eq(11).clear().type("09:00-22:00")

    cy.get('button').last().click()

    cy.wait(4500)
    cy.reload()
    cy.wait(5000)
    cy.get('input').eq(0).should('have.value', "")
    cy.get('input').eq(1).should('have.value', "")
    cy.get('input').eq(2).should('have.value', "")
    cy.get('input').eq(3).should('have.value', "")
    cy.get('input').eq(4).should('have.value', "")

  })

  it('Add informations and modify opening times', () => {

    cy.wait(4000)

    const city = faker.address.city()
    const zipCode = faker.address.zipCode()
    const address = faker.address.streetAddress()
    const taxNumber = faker.datatype.number({min: 1000000, max: 100000000})
    const phoneNumber = faker.phone.phoneNumber()

    cy.get('input').eq(0).type(city)
    cy.get('input').eq(1).type(zipCode)
    cy.get('input').eq(2).type(address)
    cy.get('input').eq(3).type(taxNumber)
    cy.get('input').eq(4).type(phoneNumber)

    cy.get('input').eq(5).clear().type("08:00-19:00")
    cy.get('input').eq(6).clear().type("09:00-22:00")
    cy.get('input').eq(7).clear().type("09:00-22:00")
    cy.get('input').eq(8).clear().type("00:00-00:00")
    cy.get('input').eq(9).clear().type("09:00-22:00")
    cy.get('input').eq(10).clear().type("05:00-02:00")
    cy.get('input').eq(11).clear().type("09:00-22:00")

    cy.get('button').last().click()

    cy.wait(2500)
    cy.reload()
    cy.wait(3500)
    cy.get('input').eq(0).should('have.value', city)
    cy.get('input').eq(1).should('have.value', zipCode)
    cy.get('input').eq(2).should('have.value', address)
    cy.get('input').eq(3).should('have.value', taxNumber)
    cy.get('input').eq(4).should('have.value', phoneNumber)

    cy.get('input').eq(5).should('have.value', "08:00-19:00")
    cy.get('input').eq(6).should('have.value', "09:00-22:00")
    cy.get('input').eq(7).should('have.value', "09:00-22:00")
    cy.get('input').eq(8).should('have.value', "00:00-00:00")
    cy.get('input').eq(9).should('have.value', "09:00-22:00")
    cy.get('input').eq(10).should('have.value', "05:00-02:00")
    cy.get('input').eq(11).should('have.value', "09:00-22:00")

  })

})

describe('Test editor', () => {

  it('Go to editor page', () => {
  
    cy.visit(FRONTEND_URL + '/edit')
    cy.wait(1200)
    
  })

  it('Add normal table with 8 capacity', () => {

    cy.get('.editor').rightclick(100, 100)
    cy.get('div[role="presentation"] .MuiList-root > div').eq(1).click()
    cy.get('.editor .draggable').last().find('button').first().click()

    for(let i = 0; i < 7; ++i) {
      cy.get('div[role="presentation"] button').eq(1).click()
    }
    cy.get('div[role="presentation"]').click(0, 0)

  })

  it('Add normal wide table with 5 capacity', () => {
    cy.get('.editor').rightclick(400, 200)
    cy.get('div[role="presentation"] .MuiList-root > div').eq(2).click()
    cy.get('.editor .draggable').last().find('button').first().click()
  
    for(let i = 0; i < 4; ++i) {
      cy.get('div[role="presentation"] button').eq(1).click()
    }
    
    cy.get('div[role="presentation"]').click(0, 0)
  })
  
  it('Add one more table, rotate it, then delete it', () => {
    cy.get('.editor').rightclick(600, 600)
    cy.get('div[role="presentation"] .MuiList-root > div').eq(1).click()
    cy.get('.editor .draggable').last().find('button').first().click()
  
    cy.get('div[role="presentation"] button').eq(2).click()
    cy.wait(300)
    cy.get('div[role="presentation"] button').eq(2).click()
    cy.wait(300)

    cy.get('div[role="presentation"] button').eq(3).click()
    cy.wait(300)
  })

  it('Add rounded table with 6 capacity', () => {

    cy.get('.editor').rightclick(600, 300)
    cy.get('div[role="presentation"] .MuiList-root > div').eq(0).click()
    cy.get('.editor .draggable').last().find('button').first().click()

    for(let i = 0; i < 5; ++i) {
      cy.get('div[role="presentation"] button').eq(1).click()
    }
    cy.get('div[role="presentation"]').click(0, 0)
    
  })
  
  it('Save the layout', () => {
    cy.get('.editor').rightclick(0, 0)
    cy.get('div[role="presentation"] ul li').last().click()
    cy.wait(2000)

    cy.reload()
    cy.wait(1200)

    cy.get('.draggable').should('have.length', 3)
  })
  
  it('Add new rounded table with 3 capacity', () => {

    cy.get('.editor').rightclick(100, 500)
    cy.get('div[role="presentation"] .MuiList-root > div').eq(1).click()
    cy.get('.editor .draggable').last().find('button').first().click()

    for(let i = 0; i < 2; ++i) {
      cy.get('div[role="presentation"] button').eq(1).click()
    }
    cy.get('div[role="presentation"] button').eq(2).click()
    cy.wait(300)
    cy.get('div[role="presentation"]').click(0, 0)
    
  })

  it('Modify table capacity to 8', () => {

    cy.get('.editor .draggable').eq(1).find('button').first().click()

    for(let i = 0; i < 3; ++i) {
      cy.get('div[role="presentation"] button').eq(1).click()
    }
    cy.get('div[role="presentation"]').click(0, 0)
  })

  it('Save the layout', () => {
    cy.get('.editor').rightclick(0, 0)
    cy.get('div[role="presentation"] ul li').last().click()
    cy.wait(2000)

    cy.reload()
    cy.wait(1200)

    cy.get('.draggable').should('have.length', 4)
  })
})

describe('Test Menu page', () => {

  it('Visit menu page', () => {
    cy.visit(FRONTEND_URL + '/menu')
  })

  it('Check if only one category card are appearing', () => {
    cy.get('.menu .MuiCardContent-root').should('have.length', 1)
  })
  
  it('Adding new category', () => {
    cy.get('.menu .MuiCardContent-root').eq(0).click()
    cy.get('input').first().type("Főételek")
    cy.get('.MuiFormControl-root').last().click(5, 5)
    cy.get('div[role="presentation"] ul > li').eq(3).click()
    cy.get('button').last().click()
    cy.wait(1500)
    cy.get('.menu .MuiCardContent-root').should('have.length', 2)
  })

  it('Adding new item to first category', () => {
    cy.get('.menu .MuiCardContent-root').eq(1).click()

    const foodNames = []

    for(let i = 0; i < 5; ++i) {
      const newFood = faker.unique(() => faker.random.words(3))
      foodNames.push(newFood)

      cy.get('.menu .MuiCardContent-root').first().click()
      cy.get('input').eq(0).type(newFood)
      cy.get('input').eq(1).type(faker.datatype.number({min: 15, max: 28}) * 100)
      cy.get('input').eq(2).type("1")
      cy.get('input').eq(3).type("db")
      cy.get('.menu-dialog button').first().click()

      cy.wait(2500)
      cy.get('.menu .MuiCardContent-root').should('have.length', i+2)
    }

    cy.get('.menu .MuiCardContent-root').first().click()
    cy.get('input').eq(0).type(faker.random.arrayElement(foodNames))
    cy.get('input').eq(1).type(faker.datatype.number({min: 15, max: 28}) * 100)
    cy.get('input').eq(2).type("1")
    cy.get('input').eq(3).type("db")
    cy.get('.menu-dialog button').first().click()

    cy.wait(2500)

    cy.get('div[role="presentation"]').click(0, 0)
    cy.wait(1000)
    cy.get('.menu .MuiCardContent-root').should('have.length', 6)
  })

  it('Adding items - failed attempts', () => {

    cy.get('.menu .MuiCardContent-root').first().click()
    cy.get('input').eq(1).type(faker.datatype.number({min: 15, max: 28}) * 100)
    cy.get('input').eq(2).type("1")
    cy.get('input').eq(3).type("db")
    
    cy.get('.menu-dialog button').first().click()
    cy.wait(700)
    
    cy.get('div[role="presentation"]').should('have.length', 1)
    cy.get('input').eq(2).should('have.value', "1")
    cy.get('input').eq(3).should('have.value', "db")
    
    cy.get('input').eq(0).type(faker.random.words(3))
    cy.get('input').eq(1).clear().type(faker.datatype.number({min: 15, max: 28}) * 100)
    cy.get('input').eq(2).clear()
    
    cy.get('.menu-dialog button').first().click()
    cy.wait(700)
    
    cy.get('div[role="presentation"]').should('have.length', 1)
    cy.get('input').eq(3).should('have.value', "db")
    cy.get('input').eq(3).should('have.value', "db")

    cy.get('div[role="presentation"]').click(0, 0)
    cy.wait(300)

  })

  it('Modifying an item', () => {

    cy.get('.menu .MuiCardContent-root').eq(1).click()
    const newPrice = faker.datatype.number({min: 15, max: 28}) * 100
    cy.get('input').eq(1).clear().type(newPrice)
    cy.get('div[role="presentation"] button').first().click()

    cy.wait(1800)

    cy.get('.menu .MuiCardContent-root').eq(1).find('p').last().contains(newPrice.toString())
  })

  it('Modifying category', () => {

    cy.get('.menu .MuiButtonBase-root').eq(0).click()
    
    const newName = "Főételek - módosítva"

    cy.get('.categories-holder > div').eq(1).find('.MuiButtonBase-root').click()

    cy.get('input').eq(0).clear().type(newName)
    cy.get('div[role="presentation"] button').first().click()

    cy.wait(1500)

    cy.get('.menu .MuiCardContent-root').eq(1).find('p').last().should('have.text', newName)
  })

})

describe('Test live view page', () => {

  it('Go to Restify home page', () => {
    cy.visit(FRONTEND_URL)
  })

  it('Find a table which is not in use', () => {

    cy.wait(1500)

    cy.get('.table-display:not(.in-use)').first().click()
    cy.get('.MuiDialogActions-root .MuiButtonBase-root').first().click()
    
    cy.get('.table-display.in-use').should('have.length', 1)
    cy.get('.table-display:not(.in-use)').should('have.length', 3)
  })

  it('Make orders', () => {

    cy.wait(1000)
    cy.get('.table-display.in-use').first().click()
    cy.wait(1000)

    for(let i = 0; i < 5; ++i) {
      cy.get('.MuiCardContent-root').eq(i).click()
      cy.wait(3500)
    }

    cy.get('.checkout .MuiList-root > div').should('have.length', 5)
  })

  it('Paying the bill', () => {
    
    cy.wait(2000)
    cy.get('.pay-button-holder button').first().click()
    cy.get('.MuiDialogContent-root button').first().click()

    cy.wait(2000)

    cy.get('.MuiDialogActions-root button').first().click()

    cy.wait(2500)
    cy.get('.table-display:not(.in-use)').should('have.length', 4)

  })

  it('Disclaim table', () => {
    
    cy.wait(500)
    cy.get('.table-display:not(.in-use)').first().click()

    cy.get('.MuiDialogActions-root .MuiButtonBase-root').first().click()
    cy.wait(300)
    cy.get('.table-display.in-use').first().click()
    cy.wait(200)


    cy.get('.MuiCardContent-root').eq(0).click()
    cy.wait(1500)

    cy.get('.MuiToolbar-root button').eq(1).click()
    cy.wait(2500)

    cy.get('.MuiCardContent-root').should('have.length', 5)
    cy.get('.checkout .MuiList-root > div').eq(0).find('button').eq(0).click()
    cy.wait(2500)

    cy.get('.MuiToolbar-root button').eq(1).click()
    cy.wait(2500)

  })

  it('Make orders #2 - complex', () => {

    cy.wait(1500)

    cy.get('.table-display:not(.in-use)').last().click()
    cy.get('.MuiDialogActions-root .MuiButtonBase-root').first().click()

    cy.wait(500)


    cy.get('.table-display.in-use').first().click()
    cy.wait(1000)

    for(let i = 0; i < 5; ++i) {
      cy.get('.MuiCardContent-root').eq(i).click()
      cy.wait(3000)
    }
    cy.get('.checkout .MuiList-root > div').should('have.length', 5)

    
    cy.get('.checkout .MuiList-root > div').eq(0).find('button').eq(0).click()
    cy.wait(3000)

    for(let i = 0; i < 5; ++i) {
      cy.get('.checkout .MuiList-root > div').eq(1).find('button').eq(2).click()
      cy.wait(3000)
    }
    cy.wait(2000)
    cy.get('.checkout .MuiList-root > div').eq(1).find('div').last().should('have.text', '6')

    cy.get('.checkout .MuiList-root > div').eq(2).find('button').eq(1).click()
    cy.wait(3000)

    cy.get('.checkout .MuiList-root > div').should('have.length', 3)

  })

  it('Paying the bill #2', () => {

    cy.get('.pay-button-holder button').first().click()
    cy.get('.MuiDialogContent-root button').eq(1).click()

    cy.wait(1000)

    cy.get('div[role="presentation"]').last().find("input").first().type("2")
    cy.get('div[role="presentation"]').last().find('button').first().click()

    cy.wait(1800)

    cy.get('.MuiDialogActions-root button').first().click()

  })

  it('Make orders #3', () => {

    cy.wait(1500)

    cy.get('.table-display:not(.in-use)').last().click()
    cy.get('.MuiDialogActions-root .MuiButtonBase-root').first().click()

    cy.wait(500)


    cy.get('.table-display.in-use').first().click()
    cy.wait(1000)

    for(let i = 0; i < 5; ++i) {
      cy.get('.MuiCardContent-root').eq(i).click()
      cy.wait(3000)
    }
    cy.get('.checkout .MuiList-root > div').should('have.length', 5)

  })

  it('Paying the bill #3', () => {

    cy.get('.pay-button-holder button').first().click()
    cy.get('.MuiDialogContent-root button').eq(2).click()
    
    cy.wait(1000)

    cy.get('div[role="presentation"]').last().find('.MuiList-root').first().find('li').first().click()
    cy.wait(500)
    cy.get('div[role="presentation"]').last().find('.MuiList-root').first().find('li').first().click()
    cy.wait(500)

    cy.get('div[role="presentation"]').last().find("button").first().click()

    cy.wait(1800)
    
    cy.get('.MuiDialogActions-root button').first().click()
    cy.wait(1800)
    
    cy.get('.checkout .MuiList-root > div').should('have.length', 3)
    cy.get('.pay-button-holder button').first().click()
    cy.get('.MuiDialogContent-root button').eq(0).click()
    cy.wait(1800)
    cy.get('.MuiDialogActions-root button').first().click()
    cy.wait(1800)
  })

})

describe('Test team page', () => {

  it('Go to team page', () => {
    cy.visit(FRONTEND_URL + '/team')
  })

  it('Invite new member', () => {

    cy.get('.team table tbody tr').should('have.length', 1)
    cy.get('.team .invite-box button').first().click()
    cy.intercept('POST', data.base_uri + '/api/users/send-invite').as('invite')
    cy.get('.MuiBox-root input').type(invitedEmail)
    cy.get('.MuiBox-root button').first().click()

    cy.wait('@invite')
    cy.wait(1200)
    cy.get('.team table tbody tr').should('have.length', 2)
    
  })
  
  it('Invite the member again', () => {
    
    cy.get('.team table tbody tr').should('have.length', 2)
    cy.get('.team .invite-box button').first().click()
    cy.get('.MuiBox-root input').type(invitedEmail)
    cy.get('.MuiBox-root button').first().click()
    cy.wait(1500)
    
    cy.get('div[role="presentation"]').should('have.length', 1)
    cy.get('div[role="presentation"]').click(0, 0)

    cy.get('.team table tbody tr').should('have.length', 2)

  })

  it('Invite new member and delete account', () => {

    cy.get('.team table tbody tr').should('have.length', 2)
    cy.get('.team .invite-box button').first().click()
    cy.intercept('POST', data.base_uri + '/api/users/send-invite').as('invite')
    cy.get('.MuiBox-root input').type(deletedEmail)
    cy.get('.MuiBox-root button').first().click()

    cy.wait('@invite')
    cy.get('.team table tbody tr').should('have.length', 3)
    
    cy.wait(1500)

    cy.get('.team table tbody tr').last().find(".MuiButtonBase-root").click()
    cy.get('div[role="presentation"]').last().find(".MuiList-root .MuiButtonBase-root").last().click()
    
    cy.wait(1800)
    cy.get('.team table tbody tr').should('have.length', 2)
    
  })

})

describe('Make appointments with API', () => {

  it('Make appointments', () => {

    cy.request('GET', data.base_uri + '/api/users/restaurant-id').then((response) => {

      const restaurantId = response.body.message
      globalRestaurantId = restaurantId
      cy.request('GET', data.base_uri + '/api/layouts').then((response) => {
        const tableIds = response.body.message.map(table => table.TableId)

        const date = appointmentDate
        date.setHours(15, 0, 0, 0)

        for(const tableId of tableIds) {

          cy.request('POST', data.base_uri + '/api/appointments/book', {
            restaurantId: restaurantId,
            tableId: tableId,
            date: date.toString(),
            peopleCount: 2,
            email: faker.internet.email(),
            lang: 'en'
          })
          
          cy.wait(1200)
        }
        
        date.setHours(16, 0, 0, 0)
        cy.request('POST', data.base_uri + '/api/appointments/book', {
          restaurantId: restaurantId,
          tableId: 'any',
          date: date.toString(),
          peopleCount: 2,
          email: faker.internet.email(),
          lang: 'en'
        })
        
      })

    })
  })

})

describe('Test appointments', () => {

  it('Go to appointments', () => {
    cy.visit(FRONTEND_URL + '/appointments')
  })

  it('Accept and decline booking', () => {
    
    cy.get('.MuiTabs-root button').last().click()
    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 5)

    for(let i = 0; i < 2; ++i) {
      cy.get('.MuiTableContainer-root tbody tr').first().find('button').first().click()
      cy.wait(500)
      cy.get('div[role="presentation"] button').first().click()
      cy.wait(1500)
    }
    
    for(let i = 0; i < 2; ++i) {
      cy.get('.MuiTableContainer-root tbody tr').first().find('button').last().click()
      cy.wait(500)
      cy.get('div[role="presentation"] button').first().click()
      cy.wait(1500)
    }

    cy.get('.MuiTableContainer-root tbody tr').first().find('button').first().click()
    cy.wait(500)
    cy.get('div[role="presentation"]').last().find('.MuiSelect-root').first().click(30, 30)
    cy.get('div[role="presentation"] ul li').last().click()
    cy.get('div[role="presentation"] button').first().click()
    cy.wait(1500)
    cy.get('div[role="presentation"] button').first().click()
    cy.wait(1500)

    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 0)

  })

  it('Look up for bookings and delete the first one', () => {

    cy.get('.MuiTabs-root button').first().click()

    const month = appointmentDate.getMonth() < 9 ? '0' + parseInt(appointmentDate.getMonth() + 1) : appointmentDate.getMonth() + 1
    const day = appointmentDate.getDate() < 10 ? '0' + appointmentDate.getDate() : appointmentDate.getDate()
    cy.get('#date-picker-inline').clear().type(month + day + appointmentDate.getFullYear())

    cy.wait(400)

    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 3)
    
    cy.get('.MuiTableContainer-root tbody tr').find('button').first().click()
    cy.get('div[role="presentation"] button').first().click()
    cy.wait(2000)
    
    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 2)

  })

  it('Booking by modal', () => {

    const month = appointmentDate.getMonth() < 9 ? '0' + parseInt(appointmentDate.getMonth() + 1) : appointmentDate.getMonth() + 1
    const day = appointmentDate.getDate() < 10 ? '0' + appointmentDate.getDate() : appointmentDate.getDate()
    cy.get('.invite-box button').click()
    cy.get('div[role="presentation"] input').eq(0).type("amtmannkristof@gmail.com")
    cy.get('div[role="presentation"] input').eq(1).type(month + day + appointmentDate.getFullYear() + faker.datatype.number({min: 10, max: 15}) + faker.random.arrayElement(['00', 15, 30, 45]))
    cy.get('div[role="presentation"] input').eq(2).type(2)
    cy.get('div[role="presentation"] .MuiFormControl-root').last().click(30, 30)
    cy.get('div[role="presentation"] ul li').last().click()
    cy.get('div[role="presentation"] button').last().click()
    
    cy.wait(1000)

    cy.get('div[role="presentation"]').last().find('button').first().click()

    cy.wait(1200)

    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 3)
    
  })

  it('Booking by modal - failed attempt', () => {

    const month = appointmentDate.getMonth() < 9 ? '0' + parseInt(appointmentDate.getMonth() + 1) : appointmentDate.getMonth() + 1
    const day = appointmentDate.getDate() < 10 ? '0' + appointmentDate.getDate() : appointmentDate.getDate()
    cy.get('.invite-box button').click()
    cy.get('div[role="presentation"] input').eq(1).type(month + day + appointmentDate.getFullYear() + faker.datatype.number({min: 10, max: 15}) + faker.random.arrayElement(['00', 15, 30, 45]))
    cy.get('div[role="presentation"] input').eq(2).type(2)
    cy.get('div[role="presentation"] .MuiFormControl-root').last().click(30, 30)
    cy.get('div[role="presentation"] ul li').last().click()
    cy.get('div[role="presentation"] button').last().click()
    
    cy.wait(1000)

    cy.get('div[role="presentation"]').should('have.length', 1)
    cy.wait(300)
    cy.get('div[role="presentation"]').click(0, 0)

    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 3)

  })

})

describe('Test invoices page', () => {

  it('Go to invoices page', () => {

    cy.visit(FRONTEND_URL + '/invoices')
    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 4)

  })

})

describe('Logout', () => {
  it('Logging out', () => {
    cy.get('.sidebar-row').last().click()
    cy.wait(5000)
  })
})

describe('Registering employee', () => {
  it('Register employee - failed attempt', () => {

    cy.visit(FRONTEND_URL + '/invite/' + globalRestaurantId)

    const name = faker.name.findName()

    cy.get('input').eq(0).type(name)
    cy.get('input').eq(1).type('a' + invitedEmail)
    cy.get('input').eq(2).type("123456")
    cy.get('input').eq(3).type("123456")
    
    cy.get('button').last().click()
    cy.wait(2000)
    
    cy.get('input').eq(0).should('have.value', name)
    cy.get('input').eq(1).should('have.value', 'a' + invitedEmail)
    cy.get('input').eq(2).should('have.value', "123456")
    cy.get('input').eq(3).should('have.value', "123456")

  })

  it('Register employee', () => {

    cy.get('input').eq(0).clear().type(faker.name.findName())
    cy.get('input').eq(1).clear().type(invitedEmail)
    cy.get('input').eq(2).clear().type("123456")
    cy.get('input').eq(3).clear().type("123456")

    cy.get('button').last().click()

    cy.wait(2000)

    cy.url().should('eq', FRONTEND_URL + '/')

  })

  it('Logging him/her in', () => {

    cy.get('input').eq(0).type(invitedEmail)
    cy.get('input').eq(1).type("123456")

    cy.get('button').last().click()

    cy.wait(1200)

    cy.get('.sidebar-row').should('have.length', 5)

  })

  it('Check no invoice and logout', () => {
    cy.visit(FRONTEND_URL + '/invoices')

    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 0)

    cy.wait(1200)

    cy.get('.sidebar-row').last().click()
    cy.wait(4000)
  })

})

describe('Mobile tests - live view', () => {

  beforeEach(() => {
    cy.viewport('iphone-8')
    cy.wait(500)
  })

  it('Change viewport and log in as admin', () => {

    cy.get('input[type="email"]').type(adminEmail)
    cy.get('input[type="password"]').type("123456")
    cy.get('button').last().click()
    cy.wait(2000)

  })

  it('Live view tests - Book table', () => {

    cy.wait(1500)

    cy.get('.MuiFab-root').first().click()
    cy.get('.MuiList-root li').should('have.length', 4)

    cy.get('.MuiList-root li').first().click()
    cy.get('div[role="presentation"] button').first().click()
    cy.wait(1000)
    
  })
  
  it('Live view tests - Order food', () => {
    
    cy.get('.MuiList-root li').first().click()
    
    for(let i = 0; i < 5; ++i) {
      cy.get('.MuiCardContent-root').eq(i).click()
      cy.wait(2000)
    }
    
    cy.wait(7000)
    cy.get('.MuiFab-root').first().click()
    cy.wait(1800)
    cy.get('.checkout .MuiList-root > div').should('have.length', 5)
    
    cy.get('.checkout .MuiList-root > div').first().find('button').first().click()
    cy.wait(3000)
    cy.get('.checkout .MuiList-root > div').first().find('button').eq(1).click()
    cy.wait(3000)
    cy.get('.checkout .MuiList-root > div').should('have.length', 3)
    
    cy.get('.checkout .MuiList-root > div').first().find('button').eq(2).click()
    cy.get('.checkout .MuiList-root > div').first().find('button').eq(2).click()

    cy.get('.pay-button-holder button').click()
    cy.get('div[role="presentation"]').last().find('button').eq(1).click()
    cy.get('div[role="presentation"]').last().find('input').type("2")
    cy.get('div[role="presentation"]').last().find('button').first().click()
    cy.wait(2000)
    cy.get('div[role="presentation"]').last().find('button').last().click()
  })
})

describe('Mobile tests - appointments', () => {

  beforeEach(() => {
    cy.viewport('iphone-8')
    cy.wait(500)
  })

  it('Create bookings', () => {

    cy.request('GET', data.base_uri + '/api/users/restaurant-id').then((response) => {

      const restaurantId = response.body.message
      globalRestaurantId = restaurantId
      cy.request('GET', data.base_uri + '/api/layouts').then((response) => {
        const tableIds = response.body.message.map(table => table.TableId)

        for(const tableId of tableIds) {

          const date = appointmentDate
          date.setHours(15, 0, 0, 0)

          cy.log(date.toString())

          cy.request('POST', data.base_uri + '/api/appointments/book', {
            restaurantId: restaurantId,
            tableId: tableId,
            date: date.toString(),
            peopleCount: 2,
            email: faker.internet.email(),
            lang: 'en'
          })

          cy.wait(700)
        }
      })
    })
  })

  it('Go to appointments page', () => {
    cy.visit(FRONTEND_URL + '/appointments')
  })

  it('Find previously made appointments', () => {

    const month = appointmentDate.getMonth() < 9 ? '0' + parseInt(appointmentDate.getMonth() + 1) : appointmentDate.getMonth() + 1
    const day = appointmentDate.getDate() < 10 ? '0' + appointmentDate.getDate() : appointmentDate.getDate()
    cy.get('#date-picker-inline').clear().type(month + day + appointmentDate.getFullYear())

    cy.wait(400)

    cy.get('.MuiList-root > .MuiListItem-root').should('have.length', 3)

  })

  it('Make new appointment', () => {
    cy.get('.MuiFab-root').click()

    cy.get('div[role="presentation"] input').eq(0).type(faker.internet.email())

    const month = appointmentDate.getMonth() < 9 ? '0' + parseInt(appointmentDate.getMonth() + 1) : appointmentDate.getMonth() + 1
    const day = appointmentDate.getDate() < 10 ? '0' + appointmentDate.getDate() : appointmentDate.getDate()
    cy.get('div[role="presentation"] input').eq(1).type(month + day + appointmentDate.getFullYear() + faker.datatype.number({min: 10, max: 15}) + faker.random.arrayElement(['00', 15, 30, 45]))
    cy.get('div[role="presentation"] input').eq(2).type(2)
    cy.get('div[role="presentation"] .MuiFormControl-root').last().click(30, 30)
    cy.get('div[role="presentation"] ul li').first().click()
    cy.get('div[role="presentation"] button').last().click()
    
    cy.wait(1000)

    cy.get('div[role="presentation"]').last().find('button').first().click()

    cy.wait(1200)

    cy.get('.MuiList-root > .MuiListItem-root').should('have.length', 4)
    
  })

  it('Accept and decline booking', () => {

    cy.get('.MuiTabs-root button').last().click()
    cy.get('.MuiList-root > .MuiListItem-root').should('have.length', 4)
    
    for(let i = 0; i < 2; ++i) {
      cy.get('.MuiList-root > .MuiListItem-root').first().click()
      cy.wait(200)
      cy.get('div[role="presentation"] .MuiIconButton-root').first().click()
      cy.wait(500)
      cy.get('div[role="presentation"]').last().find('button').first().click()
      cy.wait(1000)
    }
    
    for (let i = 0; i < 2; ++i) {
      cy.get('.MuiList-root > .MuiListItem-root').first().click()
      cy.wait(200)
      cy.get('div[role="presentation"] .MuiIconButton-root').last().click()
      cy.wait(500)
      cy.get('div[role="presentation"]').last().find('button').first().click()
      cy.wait(1000)
    }

    cy.get('.MuiList-root > .MuiListItem-root').should('have.length', 0)
    cy.wait(500)

    cy.get('.MuiTabs-root button').first().click()
    cy.wait(1500)
    cy.get('.MuiList-root > .MuiListItem-root').should('have.length', 6)
  })

})

describe('Mobile tests - Team page', () => {

  beforeEach(() => {
    cy.viewport('iphone-8')
    cy.wait(1000)
  })

  it('Go to team page', () => {
    cy.visit(FRONTEND_URL + '/team')
    cy.wait(2000)
  })

  it('Check users', () => {
    cy.get('.MuiList-root > .MuiListItem-root').should('have.length', 2)
    cy.get('.MuiList-root > .MuiListItem-root').first().find('p.MuiTypography-root').should('have.text', adminEmail)
    cy.get('.MuiList-root > .MuiListItem-root').last().find('p.MuiTypography-root').should('have.text', invitedEmail)
    
    cy.get('.MuiList-root > .MuiListItem-root').last().click()
    cy.get('div[role="presentation"] button').first().click()  
  })

  it('Invite new user', () => {
    cy.get('.MuiFab-root').click()
    cy.get('div[role="presentation"] input').first().type(faker.unique(() => faker.internet.email()))
    cy.get('div[role="presentation"] button').click()
  })

})

describe('Mobile tests - Menu page', () => {

  beforeEach(() => {
    cy.viewport('iphone-8')
    cy.wait(1000)
  })

  it('Go to menu page', () => {
    cy.visit(FRONTEND_URL + '/menu')
    cy.wait(2000)
  })

  it('Add new item to category', () => {
    cy.get('.categories-holder .menu-card').should('have.length', 2)

    cy.get('.categories-holder .menu-card').last().click()
    cy.wait(500)
    cy.get('.items-holder .menu-card').first().click()

    cy.get('div[role="presentation"] input').eq(0).type(faker.unique(() => faker.random.words(3)))
    cy.get('div[role="presentation"] input').eq(1).type(faker.datatype.number({min: 15, max: 28}) * 100)
    cy.get('div[role="presentation"] input').eq(2).type("1")
    cy.get('div[role="presentation"] input').eq(3).type("db")
    cy.get('.menu-dialog button').first().click()

    cy.wait(500)
    cy.get('.menu .MuiCardContent-root').should('have.length', 7)
  })

  it('Create new category and delete it', () => {

    cy.get('.menu .MuiButtonBase-root').eq(0).click()
    
    cy.get('.categories-holder > div').first().click()

    cy.get('input').eq(0).clear().type("Desszertek")

    cy.get('.MuiFormControl-root').last().click(5, 5)
    cy.get('div[role="presentation"] ul > li').eq(4).click()
    cy.get('button').last().click()
    cy.wait(1500)
    cy.get('.menu .MuiCardContent-root').should('have.length', 3)
    
    cy.wait(1500)
    
    cy.get('.menu .MuiCardContent-root').eq(1).find('p').last().should('have.text', "Desszertek")
    cy.wait(300)
    
    cy.get('.categories-holder > div').eq(2).find('.MuiIconButton-root').first().click()
    cy.get('div[role="presentation"]').last().find('button').last().click()
    
    cy.get('.menu .MuiCardContent-root').should('have.length', 2)

  })
})

describe('Mobile tests - Editor page', () => {

  beforeEach(() => {
    cy.viewport('iphone-8')
    cy.wait(1000)
  })

  it('Navigate to editor page', () => {
    cy.visit(FRONTEND_URL + '/edit')
  })

  it('Modify table', () => {

    cy.get('.editor .draggable').last().find('button').first().click()

    cy.get('div[role="presentation"] button').eq(1).click()
    cy.get('div[role="presentation"]').click(0, 0)

    cy.get('.MuiFab-root').click()
    cy.get('div[role="presentation"] li').last().click()
    cy.wait(2000)

    cy.reload()

    cy.get('.editor .draggable').last().find('.table-count').should('have.text', '4')

  })
})

describe('Mobile tests - Invoices page', () => {

  beforeEach(() => {
    cy.viewport('iphone-8')
    cy.wait(1000)
  })

  it('Navigate to invoices page', () => {
    cy.visit(FRONTEND_URL + '/invoices')
  })

  it('Check invoices', () => {

    cy.get('.MuiList-root .MuiListItem-root').should('have.length', 5)
  
    cy.get('.navbar-toggler-icon').click()
    cy.get('.navbar-nav .nav-item').last().click()

  })
})

describe('Mobile tests - Invoices page as normal user', () => {

  beforeEach(() => {
    cy.viewport('iphone-8')
    cy.wait(1000)
  })

  it('Log in user and navigate to invoices page', () => {

    cy.get('input').eq(0).type(invitedEmail)
    cy.get('input').eq(1).type("123456")

    cy.get('form button').last().click()

    cy.wait(4500)

    cy.visit(FRONTEND_URL + '/invoices')
    cy.wait(1800)

  })

  it('Check invoices and log out', () => {

    cy.get('.MuiList-root .MuiListItem-root').should('have.length', 5)
  
    cy.get('.navbar-toggler-icon').click()
    cy.get('.navbar-nav .nav-item').last().click()

  })
})