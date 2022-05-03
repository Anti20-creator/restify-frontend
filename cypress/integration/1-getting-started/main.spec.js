/* eslint-disable jest/valid-title */
import data from '../../../src/communication/data.json'
const {faker} = require('@faker-js/faker')

Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

const getNextMonday = () => {
  const dateCopy = new Date(new Date().getTime())
  const nextMonday = new Date(dateCopy.setDate(dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7)))
  return nextMonday
}
const adminEmail = faker.internet.email()
const invitedEmail = faker.internet.email()
const appointmentDate = getNextMonday()
let globalRestaurantId = null

describe('Delete cookies', () => {
  it('', () => {
    cy.visit(data.base_uri)
    cy.clearCookies()
    cy.setCookie('Refresh-token', '')
    cy.setCookie('Authorization', '')
  })
})
  
Cypress.Cookies.defaults({
  preserve: ['Refresh-token', 'Authorization']
})

describe('Register a new user', () => {

  it('Registering the user', () => {
    cy.visit('http://localhost:3000/register')

    cy.get('input').eq(0).type(faker.name.findName())
    cy.get('input').eq(1).type(faker.company.companyName())
    cy.get('input').eq(2).type(adminEmail)
    cy.get('input').eq(3).type("123456")

    cy.get('button').last().click()
    cy.wait(800)
    cy.url().should('eq', 'http://localhost:3000/')


    const date = getNextMonday()
    date.setHours(15, 0, 0, 0)

    cy.log(date.toString())
  })
})

describe('Testing logging in', () => {

   it('Logging in', () => {
    cy.get('input').should('have.length', 2)

    cy.get('input[type="email"]').type(adminEmail)
    cy.get('input[type="password"]').type("123456")
    cy.get('button').last().click()

    cy.get('.sidebar-row').should('have.length', 8)

    cy.wait(2500)
  })

})

describe('Test settings page', () => {

  it('Go to settings page', () => {

    cy.visit('http://localhost:3000/settings')

    cy.wait(2500)

  })

  it('Add informations and modify opening times', () => {

    cy.wait(4000)

    const city = faker.address.city()

    cy.get('input').eq(0).type(city)
    cy.get('input').eq(1).type(faker.address.zipCode())
    cy.get('input').eq(2).type(faker.address.streetAddress())
    cy.get('input').eq(3).type(faker.datatype.number({min: 1000000, max: 100000000}))
    cy.get('input').eq(4).type(faker.phone.phoneNumber())

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
    cy.get('input').first().should('have.value', city)

  })

})

describe('Test editor', () => {

  it('Add table', () => {

    cy.visit('http://localhost:3000/edit')

    cy.get('.editor').rightclick(100, 100)
    cy.get('div[role="presentation"] .MuiList-root > div').eq(1).click()
    cy.get('.editor .draggable').eq(0).find('button').first().click()

    for(let i = 0; i < 7; ++i) {
      cy.get('div[role="presentation"] button').eq(1).click()
    }
    cy.get('div[role="presentation"]').click(0, 0)

    cy.get('.editor').rightclick(400, 200)
    cy.get('div[role="presentation"] .MuiList-root > div').eq(1).click()
    cy.get('.editor .draggable').eq(1).find('button').first().click()

    for(let i = 0; i < 4; ++i) {
      cy.get('div[role="presentation"] button').eq(1).click()
    }
    cy.get('div[role="presentation"]').click(0, 0)

    cy.get('.editor').rightclick(0, 0)
    cy.get('div[role="presentation"] ul li').last().click()
    cy.wait(2000)
  })

})

describe('Test Menu page', () => {

  it('Visit menu page', () => {
    cy.visit('http://localhost:3000/menu')
  })

  it('Check if only one category card are appearing', () => {
    cy.get('.menu .MuiCardContent-root').should('have.length', 1)
  })

  it('Check if only one category card are appearing', () => {
    cy.get('.menu .MuiCardContent-root').eq(0).click()
    cy.get('input').first().type("Főételek")
    cy.get('.MuiFormControl-root').last().click(5, 5)
    cy.get('div[role="presentation"] ul > li').eq(3).click()
    cy.get('button').last().click()
    cy.wait(1500)
  })

  it('Adding new item to first category', () => {
    cy.get('.menu .MuiCardContent-root').eq(1).click()

    for(let i = 0; i < 5; ++i) {
      cy.get('.menu .MuiCardContent-root').first().click()
      cy.get('input').eq(0).type(faker.random.words(3))
      cy.get('input').eq(1).type(faker.datatype.number({min: 15, max: 28}) * 100)
      cy.get('input').eq(2).type("1")
      cy.get('input').eq(3).type("db")
      cy.get('.menu-dialog button').first().click()

      cy.wait(200)
      cy.get('.menu .MuiCardContent-root').should('have.length', i+2)
    }
  })

  it('Modifying an item', () => {
    cy.get('.menu .MuiCardContent-root').eq(1).click()
    const newPrice = faker.datatype.number({min: 15, max: 28}) * 100
    cy.get('input').eq(1).clear().type(newPrice)
    cy.get('div[role="presentation"] button').first().click()

    cy.wait(700)

    cy.get('.menu .MuiCardContent-root').eq(1).find('p').last().contains(newPrice.toString())
  })

})

describe('Test live view page', () => {

  it('Go to Restify home page', () => {
    cy.visit('http://localhost:3000/')
  })

  it('Find a table which is not in use', () => {

    cy.wait(1500)

    cy.get('.table-display:not(.in-use)').first().click()
    cy.get('.MuiDialogActions-root .MuiButtonBase-root').first().click()

  })

  it('Make orders', () => {

    cy.wait(1000)
    cy.get('.table-display.in-use').first().click()
    cy.wait(1000)

    for(let i = 0; i < 5; ++i) {
      cy.get('.MuiCardContent-root').eq(i).click()
      cy.wait(1500)
    }

    cy.get('.checkout .MuiList-root > div').should('have.length', 5)
  })

  it('Paying the bill', () => {
    
    cy.wait(2000)
    cy.get('.pay-button-holder button').first().click()
    cy.get('.MuiDialogContent-root button').first().click()

    cy.wait(2000)

    cy.get('.MuiDialogActions-root button').first().click()

  })

  it('Disclaim table', () => {
    
    cy.wait(500)
    cy.get('.table-display:not(.in-use)').first().click()
    cy.get('.MuiDialogActions-root .MuiButtonBase-root').first().click()    
    cy.wait(300)
    cy.get('.table-display.in-use').first().click()
    cy.wait(200)
    cy.get('.MuiToolbar-root button').eq(1).click()
    cy.wait(2500)

  })

  it('Find a table which is not in use #2', () => {

    cy.wait(1500)

    cy.get('.table-display:not(.in-use)').last().click()
    cy.get('.MuiDialogActions-root .MuiButtonBase-root').first().click()

    cy.wait(500)

  })

  it('Make orders #2 - complex', () => {

    cy.get('.table-display.in-use').first().click()
    cy.wait(1000)

    for(let i = 0; i < 5; ++i) {
      cy.get('.MuiCardContent-root').eq(i).click()
      cy.wait(2000)
    }
    cy.get('.checkout .MuiList-root > div').should('have.length', 5)

    
    cy.get('.checkout .MuiList-root > div').eq(0).find('button').eq(0).click()
    cy.wait(1000)

    for(let i = 0; i < 5; ++i) {
      cy.get('.checkout .MuiList-root > div').eq(1).find('button').eq(2).click()
      cy.wait(1500)
    }
    cy.wait(1000)
    cy.get('.checkout .MuiList-root > div').eq(1).find('div').last().should('have.text', '6')

    cy.get('.checkout .MuiList-root > div').eq(2).find('button').eq(1).click()
    cy.wait(500)

    cy.get('.checkout .MuiList-root > div').should('have.length', 3)
  })

  it('Paying the bill #2', () => {

    cy.get('.pay-button-holder button').first().click()
    cy.get('.MuiDialogContent-root button').first().click()

    cy.wait(1000)

    cy.get('.MuiDialogActions-root button').first().click()

  })

})

describe('Test team page', () => {

  it('Go to team page', () => {
    cy.visit('http://localhost:3000/team')
  })

  it('Invite new member', () => {

    cy.get('.team table tbody tr').should('have.length', 1)
    cy.get('.team .invite-box button').first().click()
    cy.intercept('POST', data.base_uri + '/api/users/send-invite').as('invite')
    cy.get('.MuiBox-root input').type(invitedEmail)
    cy.get('.MuiBox-root button').first().click()

    cy.wait('@invite')
    cy.get('.team table tbody tr').should('have.length', 2)

  })
})

describe('Get tables', () => {

  it('Get tables', () => {

    cy.request('GET', data.base_uri + '/api/users/restaurant-id').then((response) => {

      const restaurantId = response.body.message
      globalRestaurantId = restaurantId
      cy.request('GET', data.base_uri + '/api/layouts').then((response) => {
        const tableIds = response.body.message.map(table => table.TableId)

        for(const tableId of tableIds) {

          const date = getNextMonday()
          date.setHours(15, 0, 0, 0)

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

})

describe('Test appointments', () => {

  it('Go to appointments', () => {
    cy.visit('http://localhost:3000/appointments')
  })

  it('Go to unconfirmed bookings', () => {

    cy.get('.MuiTabs-root button').last().click()
    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 2)

  })

  it('Accept and decline booking', () => {

    cy.get('.MuiTableContainer-root tbody tr').first().find('button').first().click()
    cy.wait(500)
    cy.get('div[role="presentation"] button').first().click()
    cy.wait(1500)

    cy.get('.MuiTableContainer-root tbody tr').first().find('button').last().click()
    cy.wait(500)
    cy.get('div[role="presentation"] button').first().click()
    cy.wait(1500)

    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 0)

  })

  it('Look up for booking', () => {

    cy.get('.MuiTabs-root button').first().click()

    const month = appointmentDate.getMonth() < 9 ? '0' + parseInt(appointmentDate.getMonth() + 1) : appointmentDate.getMonth() + 1
    const day = appointmentDate.getDate() < 10 ? '0' + appointmentDate.getDate() : appointmentDate.getDate()
    cy.get('#date-picker-inline').clear().type(month + day + appointmentDate.getFullYear())

    cy.wait(400)

    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 1)
    
    cy.get('.MuiTableContainer-root tbody tr').find('button').click()
    cy.get('div[role="presentation"] button').first().click()
    cy.wait(2000)
    
    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 0)

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

    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 1)
  })

})

describe('Test invoices page', () => {

  it('Go to invoices page', () => {

    cy.visit('http://localhost:3000/invoices')
    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 2)

  })

})



describe('Logout', () => {
  it('Logging out', () => {
    cy.get('.sidebar-row').last().click()
    cy.wait(5000)
  })
})

describe('Registering employee', () => {
  it('Register employee', () => {

    cy.visit('http://localhost:3000/invite/' + globalRestaurantId)

    cy.get('input').eq(0).type(faker.name.findName())
    cy.get('input').eq(1).type(invitedEmail)
    cy.get('input').eq(2).type("123456")
    cy.get('input').eq(3).type("123456")

    cy.get('button').last().click()

    cy.wait(2000)

  })

  it('Logging him/her in', () => {

    cy.get('input').eq(0).type(invitedEmail)
    cy.get('input').eq(1).type("123456")

    cy.get('button').last().click()

    cy.wait(1200)

    cy.get('.sidebar-row').should('have.length', 5)

  })

  it('Check no invoice', () => {
    cy.visit('http://localhost:3000/invoices')

    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 0)
  })

  it('Log out', () => {
    cy.get('.sidebar-row').last().click()
    cy.wait(4000)
  })
})

describe('Mobile tests', () => {

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
    cy.get('.MuiList-root li').should('have.length', 2)

    cy.get('.MuiList-root li').first().click()
    cy.get('div[role="presentation"] button').first().click()
    cy.wait(1000)
    
    cy.get('.MuiList-root li').first().click()

  })

  it('Live view tests - Order food', () => {

    for(let i = 0; i < 5; ++i) {
      cy.get('.MuiCardContent-root').eq(i).click()
      cy.wait(1500)
    }
    
    cy.wait(3000)
    cy.get('.MuiFab-root').first().click()
    cy.get('.checkout .MuiList-root > div').should('have.length', 5)
    
    cy.get('.checkout .MuiList-root > div').first().find('button').first().click()
    cy.wait(1000)
    cy.get('.checkout .MuiList-root > div').first().find('button').eq(1).click()
    cy.wait(1000)
    cy.get('.checkout .MuiList-root > div').should('have.length', 3)
    
    cy.get('.checkout .MuiList-root > div').first().find('button').eq(2).click()
    cy.get('.checkout .MuiList-root > div').first().find('button').eq(2).click()

    cy.get('.pay-button-holder button').click()
    cy.get('div[role="presentation"]').last().find('button').eq(1).click()
    cy.get('div[role="presentation"]').last().find('input').type("2")
    cy.get('div[role="presentation"]').last().find('button').first().click()
    cy.wait(1000)
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

          const date = getNextMonday()
          date.setHours(15, 0, 0, 0)

          cy.log(date.toString())

          cy.request('POST', data.base_uri + '/api/appointments/book', {
            restaurantId: restaurantId,
            tableId: tableId,
            date: date.toString(),
            peopleCount: faker.datatype.number({min: 1, max: 5}),
            email: faker.internet.email(),
            lang: 'en'
          })

          cy.wait(700)
        }
      })
    })
  })

  it('Go to appointments page', () => {
    cy.get('.navbar-toggler-icon').click()
    cy.get('.navbar-nav .nav-item').eq(1).click()
    cy.reload()
  })

  it('Find previously made appointments', () => {

    const month = appointmentDate.getMonth() < 9 ? '0' + parseInt(appointmentDate.getMonth() + 1) : appointmentDate.getMonth() + 1
    const day = appointmentDate.getDate() < 10 ? '0' + appointmentDate.getDate() : appointmentDate.getDate()
    cy.get('#date-picker-inline').clear().type(month + day + appointmentDate.getFullYear())

    cy.wait(400)

    cy.get('.MuiList-root > .MuiListItem-root').should('have.length', 1)

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

    cy.get('.MuiList-root > .MuiListItem-root').should('have.length', 2)
    
  })

  it('Accept and decline booking', () => {

    cy.get('.MuiTabs-root button').last().click()
    cy.get('.MuiList-root > .MuiListItem-root').should('have.length', 2)
    
    cy.get('.MuiList-root > .MuiListItem-root').first().click()
    cy.wait(200)
    cy.get('div[role="presentation"] .MuiIconButton-root').first().click()
    cy.wait(500)
    cy.get('div[role="presentation"]').last().find('button').first().click()
    cy.wait(1000)
    
    cy.get('.MuiList-root > .MuiListItem-root').first().click()
    cy.wait(200)
    cy.get('div[role="presentation"] .MuiIconButton-root').last().click()
    cy.wait(500)
    cy.get('div[role="presentation"]').last().find('button').first().click()
    cy.wait(1000)

    cy.get('.MuiList-root > .MuiListItem-root').should('have.length', 0)
    
    cy.get('.MuiTabs-root button').first().click()
    cy.wait(1500)
    cy.get('.MuiList-root > .MuiListItem-root').should('have.length', 3)
  })

})

describe('Mobile tests - Team page', () => {

  beforeEach(() => {
    cy.viewport('iphone-8')
    cy.wait(1000)
  })

  it('Go to team page', () => {
    cy.get('.navbar-toggler-icon').click()
    cy.get('.navbar-nav .nav-item').eq(2).click()
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
    cy.get('div[role="presentation"] input').first().type(faker.internet.email())
    cy.get('div[role="presentation"] button').click()
  })

})

describe('Mobile tests - Menu page', () => {

  beforeEach(() => {
    cy.viewport('iphone-8')
    cy.wait(1000)
  })

  it('Go to menu page', () => {
    cy.get('.navbar-toggler-icon').click()
    cy.get('.navbar-nav .nav-item').eq(3).click()
    cy.wait(2000)
  })

  it('Add new item to category', () => {
    cy.get('.categories-holder .menu-card').should('have.length', 2)

    cy.get('.categories-holder .menu-card').last().click()
    cy.wait(500)
    cy.get('.items-holder .menu-card').first().click()

    cy.get('div[role="presentation"] input').eq(0).type(faker.random.words(3))
    cy.get('div[role="presentation"] input').eq(1).type(faker.datatype.number({min: 15, max: 28}) * 100)
    cy.get('div[role="presentation"] input').eq(2).type("1")
    cy.get('div[role="presentation"] input').eq(3).type("db")
    cy.get('.menu-dialog button').first().click()

    cy.wait(200)
    cy.get('.menu .MuiCardContent-root').should('have.length', 7)
  })
})

describe('Mobile tests - Editor page', () => {

  beforeEach(() => {
    cy.viewport('iphone-8')
    cy.wait(1000)
  })

  it('Navigate to editor page', () => {
    cy.visit('http://localhost:3000/edit')
  })

  it('Modify table', () => {

    cy.get('.editor .draggable').last().find('button').first().click()

    cy.get('div[role="presentation"] button').eq(1).click()
    cy.get('div[role="presentation"]').click(0, 0)

    cy.get('.MuiFab-root').click()
    cy.get('div[role="presentation"] li').last().click()
    cy.wait(2000)

    cy.reload()

    cy.get('.editor .draggable').last().find('.table-count').should('have.text', '6')

  })
})

describe('Mobile tests - Invoices page', () => {

  beforeEach(() => {
    cy.viewport('iphone-8')
    cy.wait(1000)
  })

  it('Navigate to invoices page', () => {
    cy.visit('http://localhost:3000/invoices')
  })

  it('Check invoices', () => {

    cy.get('.MuiList-root .MuiListItem-root').should('have.length', 3)
    
  })
  
  it('Log out', () => {

    cy.get('.navbar-toggler-icon').click()
    cy.get('.navbar-nav .nav-item').last().click()

  })
})