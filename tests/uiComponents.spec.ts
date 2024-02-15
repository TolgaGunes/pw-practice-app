import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200')
})

test.describe('Form Layouts page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" })

        await usingTheGridEmailInput.fill('test@gmail.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 500 })

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')

    })
    test('radio buttons', async ({ page }) => {
        const usingTheGridEmailForm = page.locator('nb-card', { hasText: "Using the Grid" })

        //await usingTheGridEmailForm.getByLabel('Option 1').check({force:true}) // 1st way to check radiobutton
        await usingTheGridEmailForm.getByRole('radio', { name: 'Option 1' }).check({ force: true })   // 2nd way to check radiobutton

        const radioStatus = await usingTheGridEmailForm.getByRole('radio', { name: 'Option 1' }).isChecked() // returns the element whether is checked. (a way for assertion)
        expect(radioStatus).toBeTruthy()
        await expect(usingTheGridEmailForm.getByRole('radio', { name: "Option 1" })).toBeChecked()

        await usingTheGridEmailForm.getByRole('radio', { name: "Option 2" }).check({ force: true })
        expect(await usingTheGridEmailForm.getByRole('radio', { name: "Option 1" }).isChecked()).toBeFalsy()
        expect(await usingTheGridEmailForm.getByRole('radio', { name: "Option 2" }).isChecked()).toBeTruthy()
    })

    test('checkboxes', async ({ page }) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()

        await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true })
        await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true })

        const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()) {
            await box.uncheck({ force: true })
            expect(await box.isChecked()).toBeFalsy()
        }
    })

    test('list and dropdowns', async ({ page }) => {
        const dropDownMenu = page.locator('ngx-header nb-select')
        await dropDownMenu.click()

        page.getByRole('list') // list property is used when the list has a 'UL' tag
        page.getByRole('listitem') //listItem property is used when the list has a 'LI' tag

        //const optionList = page.getByRole('list').locator('nb-option')
        const optionList = page.locator('nb-option-list nb-option')
        await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
        await optionList.filter({ hasText: 'Cosmic' }).click()
        const header = page.locator('nb-layout-header')
        await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

        const colors = {
            "Light": "rgb(255, 255, 255)",
            "Dark": "rgb(34, 43, 69)",
            "Cosmic": "rgb(50, 50, 89)",
            "Corporate": "rgb(255, 255, 255)"
        }

        await dropDownMenu.click()
        for (const color in colors) {
            await optionList.filter({ hasText: color }).click()
            await expect(header).toHaveCSS('background-color', colors[color]) // colors[color] will read and return as value of object in colors array
            await dropDownMenu.click()
            if (color != "Corporate")
                await dropDownMenu.click()
        }

    })

    test('tooltips', async ({ page }) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Tooltip').click()

        const toolTipCard = page.locator('nb-card', { hasText: "Tooltip Placements" })
        await toolTipCard.getByRole('button', { name: "Top" }).hover()

        page.getByRole('tooltip') //if you have a role tooltip created
        const tooltip = await page.locator('nb-tooltip').textContent()
        expect(tooltip).toEqual('This is a tooltip')
    })


    test('dialog box', async ({ page }) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Are you sure you want to delete?')
            dialog.accept()
        })

        await page.getByRole('table').locator('tr', { hasText: "mdo@gmail.com" }).locator('.nb-trash').click()
        await expect(page.locator('table-tr').first()).not.toHaveText('mdo@gmail.com')

    })

    test('web tables', async ({ page }) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        // 1 get the row by any test in this row
        const targetRow = page.getByRole('row', { name: 'twitter@outlook.com' })
        await targetRow.locator('.nb-edit').click()

        await page.locator('input-editor').getByPlaceholder('Age').clear()
        await page.locator('input-editor').getByPlaceholder('Age').fill('35')
        await page.locator('.nb-checkmark').click()


        //2 get the row based on the value in the specific column
        await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
        const targetRowById = page.getByRole('row', { name: "11" }).filter({ has: page.locator('td').nth(1).getByText('11') })
        await targetRowById.locator('.nb-edit').click() // here we click on edit sign

        await page.locator('input-editor').getByPlaceholder('E-mail').clear()
        await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
        await page.locator('.nb-checkmark').click()

        await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

        // 3 Test filter of the table

        const ages = ["20", "30", "40", "200"]
        for (let age of ages) {
            await page.locator('input-filter').getByPlaceholder('Age').clear()
            await page.locator('input-filter').getByPlaceholder('Age').fill(age)
            await page.waitForTimeout(500)
            const ageRows = page.locator('tbody tr')

            for (let row of await ageRows.all()) {
                const cellValue = await row.locator('td').last().textContent()
                if (age == "200") {
                    expect(await page.getByRole('table').textContent()).toContain('No data found')

                } else {
                    expect(cellValue).toEqual(age)
                }
            }
        }
    })

    test('date picker', async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Datepicker').click()


        const calendarInputField = page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        let date = new Date()
        date.setDate(date.getDate() + 14)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' })
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"] ').click()
            calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        }

        await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
        await expect(calendarInputField).toHaveValue(dateToAssert)
    })

    

    test('sliders', async ({ page }) => {
        await page.getByText('IoT Dashboard').click()
        // update attribute
        const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
        await tempGauge.evaluate(node => {
            node.setAttribute('cx', '232.630')
            node.setAttribute('cy', '232.630')
        })
        await tempGauge.click()


        //mouse movement
        const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
        await tempBox.scrollIntoViewIfNeeded()

        const box = await tempBox.boundingBox() // x,y coordinates..alwas start from the top left from the initial coordinates
        const x = box.x + box.width / 2
        const y = box.y + box.height/ 2
        await page.mouse.move(x,y) // mouse cursor goes to the x,y positiob
        await page.mouse.down()  //click left mouse
        await page.mouse.move(x+100, y) // to move horizion, increase x ´coordinate and keep y same
        await page.mouse.move(x+100, y+100) // moving mouse to down from (x+100, y)
        await page.mouse.up() // release the mouse
        await expect(tempBox).toContainText('30')
    })

    




})