const {faker} = require('@faker-js/faker')


const adminEmail = faker.internet.email()
const invitedEmail = faker.internet.email()
const appointmentDate = new Date(new Date().getTime() + 3_600_000 * 48)
let globalRestaurantId = null

describe('Delete cookies', () => {
    it('', () => {
      cy.visit('https://192.168.31.214:4000')
      cy.clearCookies()
    })
})

describe('Register a new user', () => {

  it('Registering the user', () => {
    cy.visit('http://192.168.31.161:3000/register')

    cy.get('input').eq(0).type(faker.name.findName())
    cy.get('input').eq(1).type(faker.company.companyName())
    cy.get('input').eq(2).type(adminEmail)
    cy.get('input').eq(3).type("123456")

    cy.get('button').click()
    cy.wait(800)
    cy.url().should('eq', 'http://192.168.31.161:3000/')
  })
})

describe('Testing logging in', () => {

   it('Logging in', () => {
    cy.get('input').should('have.length', 2)

    cy.get('input[type="email"]').type(adminEmail)
    cy.get('input[type="password"]').type("123456")
    cy.get('button').click()

    cy.get('.sidebar-row').should('have.length', 8)
  })

})

describe('Test editor', () => {

  it('Add table', () => {

    cy.visit('http://192.168.31.161:3000/edit')

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
    cy.visit('http://192.168.31.161:3000/menu')
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
    cy.get('button').last().click()

    cy.wait(700)

    cy.get('.menu .MuiCardContent-root').eq(1).find('p').last().contains(newPrice.toString())
  })

})

describe('Test live view page', () => {

  it('Go to Restify home page', () => {
    cy.visit('http://192.168.31.161:3000/')
  })

  it('Find a table which is not in use', () => {

    cy.wait(1500)

    cy.get('.table-display:not(.in-use)').first().click()
    cy.get('.MuiDialogActions-root .MuiButtonBase-root').first().click()

  })

  it('Make orders', () => {

    cy.get('.table-display.in-use').first().click()
    cy.wait(1000)

    for(let i = 0; i < 5; ++i) {
      cy.get('.MuiCardContent-root').eq(i).click()
      cy.wait(300)
    }

    cy.get('.checkout tbody tr').should('have.length', 5)
  })

  it('Paying the bill', () => {

    cy.get('.pay-button-holder button').first().click()
    cy.get('.MuiDialogContent-root button').first().click()

    cy.wait(1000)

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
    cy.wait(500)

  })

  it('Find a table which is not in use #2', () => {

    cy.wait(1500)

    cy.get('.table-display:not(.in-use)').last().click()
    cy.get('.MuiDialogActions-root .MuiButtonBase-root').first().click()

  })

  it('Make orders #2 - complex', () => {

    cy.get('.table-display.in-use').first().click()
    cy.wait(1000)

    for(let i = 0; i < 5; ++i) {
      cy.get('.MuiCardContent-root').eq(i).click()
      cy.wait(500)
    }
    cy.get('.checkout tbody tr').should('have.length', 5)

    
    cy.get('.checkout tbody tr').eq(0).find('button').eq(0).click()
    cy.wait(500)

    for(let i = 0; i < 5; ++i) {
      cy.get('.checkout tbody tr').eq(1).find('button').eq(2).click()
      cy.wait(500)
    }
    cy.get('.checkout tbody tr').eq(1).find('td').first().should('have.text', '6')

    cy.get('.checkout tbody tr').eq(2).find('button').eq(1).click()
    cy.wait(500)

    cy.get('.checkout tbody tr').should('have.length', 3)
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
    cy.visit('http://192.168.31.161:3000/team')
  })

  it('Invite new member', () => {

    cy.get('.team table tbody tr').should('have.length', 1)
    cy.get('.team .invite-box button').first().click()
    cy.intercept('POST', 'https://192.168.31.214:4000/api/users/send-invite').as('invite')
    cy.get('.MuiBox-root input').type(invitedEmail)
    cy.get('.MuiBox-root button').first().click()

    cy.wait('@invite')
    cy.get('.team table tbody tr').should('have.length', 2)

  })
})

describe('Get tables', () => {

  it('Get tables', () => {

    cy.request('GET', 'https://192.168.31.214:4000/api/users/restaurant-id').then((response) => {

      const restaurantId = response.body.message
      globalRestaurantId = restaurantId
      cy.request('GET', 'https://192.168.31.214:4000/api/layouts').then((response) => {
        const tableIds = response.body.message.map(table => table.TableId)

        for(const tableId of tableIds) {

          cy.request('POST', 'https://192.168.31.214:4000/api/appointments/book', {
            restaurantId: restaurantId,
            tableId: tableId,
            date: appointmentDate,
            peopleCount: 2,
            email: faker.internet.email()
          })

          cy.wait(700)
        }
      })

    })
  })

})

describe('Test appointments', () => {

  it('Go to appointments', () => {
    cy.visit('http://192.168.31.161:3000/appointments')
  })

  it('Go to unconfirmed bookings', () => {

    cy.get('.MuiTabs-root button').last().click()
    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 2)

  })

  it('Accept and decline booking', () => {

    cy.get('.MuiTableContainer-root tbody tr').first().find('button').first().click()
    cy.wait(500)
    cy.get('div[role="presentation"] button').first().click()
    cy.wait(1000)

    cy.get('.MuiTableContainer-root tbody tr').first().find('button').last().click()
    cy.wait(500)
    cy.get('div[role="presentation"] button').first().click()
    cy.wait(1000)

    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 0)

  })

  it('Look up for booking', () => {

    cy.get('.MuiTabs-root button').first().click()

    const month = appointmentDate.getMonth() < 9 ? '0' + parseInt(appointmentDate.getMonth() + 1) : appointmentDate.getMonth() + 1
    const day = appointmentDate.getDate() < 10 ? '0' + appointmentDate.getDate() : appointmentDate.getDate()
    cy.get('#date-picker-inline').clear().type(month + day + appointmentDate.getFullYear())

    cy.wait(400)

    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 1)
  })

  it('Booking by modal', () => {

    const month = appointmentDate.getMonth() < 9 ? '0' + parseInt(appointmentDate.getMonth() + 1) : appointmentDate.getMonth() + 1
    const day = appointmentDate.getDate() < 10 ? '0' + appointmentDate.getDate() : appointmentDate.getDate()
    cy.get('.invite-box button').click()
    cy.get('div[role="presentation"] input').eq(0).type("amtmannkristof@gmail.com")
    cy.get('div[role="presentation"] input').eq(1).type(month + day + appointmentDate.getFullYear() + faker.datatype.number({min: 10, max: 20}) + faker.random.arrayElement(['00', 15, 30, 45]))
    cy.get('div[role="presentation"] input').eq(2).type(2)
    cy.get('div[role="presentation"] .MuiFormControl-root').last().click(30, 30)
    cy.get('div[role="presentation"] ul li').last().click()
    cy.get('div[role="presentation"]').last().click(0, 0)
    cy.get('div[role="presentation"] button').last().click()
    
    cy.wait(1000)

    cy.get('div[role="presentation"]').last().find('button').first().click()

    cy.wait(1200)

    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 2)
  })

})

describe('Test invoices page', () => {

  it('Go to invoices page', () => {

    cy.visit('http://192.168.31.161:3000/invoices')
    cy.get('.MuiTableContainer-root tbody tr').should('have.length', 2)

  })

})

describe('Logout', () => {
  it('Logging out', () => {
    cy.get('.sidebar-row').last().click()
    cy.wait(2000)
  })
})

describe('Registering employee', () => {
  it('Register employee', () => {

    cy.visit('http://192.168.31.161:3000/invite/' + globalRestaurantId)

    cy.get('input').eq(0).type(faker.name.findName())
    cy.get('input').eq(1).type(invitedEmail)
    cy.get('input').eq(2).type("123456")
    cy.get('input').eq(3).type("1234")

    cy.get('button').last().click()

    cy.wait(2000)

  })

  it('Logging him/her in', () => {

    cy.get('input').eq(0).type(invitedEmail)
    cy.get('input').eq(1).type("123456")

    cy.get('button').last().click()

    cy.wait(1200)

    cy.get('.sidebar-row').should('have.length', 6)

  })
})



