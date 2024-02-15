import { expect, test } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";


test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/')
})

test('navigate to form page', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelecOption("test@test.com", "Welcome1", "Option 1")
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('Johnt Smith','joht@test.com', true)

    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(5)
    await pm.onDatepickerPage().SelectDatePickerWithRangeFromToday(6,10)
})




