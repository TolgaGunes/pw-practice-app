import { Page, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";
import { FormnLayoutsPage } from "../page-objects/formLayoutPage";
import { DatePickerPage } from "../page-objects/datepickerPage";

export class PageManager {

    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formLayoutPage: FormnLayoutsPage
    private readonly datepickerPage:DatePickerPage


    constructor(page: Page) {
        this.page = page
        this.navigationPage= new NavigationPage(this.page)
        this.formLayoutPage= new FormnLayoutsPage(this.page)
        this.datepickerPage= new DatePickerPage(this.page)
    }

    navigateTo(){
        return this.navigationPage
    }

    onFormLayoutsPage(){
        return this.formLayoutPage
    }

    onDatepickerPage(){
        return this.datepickerPage
    }



}