# Requirements Document

## Introduction

This document specifies the requirements for the **Expense & Bookkeeping Module ("Pengeluaran")** of *Buku Keuangan Digital*, a pure-frontend Progressive Web App built with vanilla HTML/CSS/JavaScript and persisted entirely in the browser's `localStorage` (key `bukuKeuanganDigital:v1`). There is no backend, no build step, and no runtime framework dependency.

The module adds standalone money-out tracking that is independent of per-product cost (modal). It introduces expense capture with categories and recurring/monthly support, a filterable and searchable expense list, true net profit reporting (gross profit minus total expenses), expense category breakdown, expense-versus-revenue ratio, daily and monthly cashflow with surplus/deficit, per-category monthly budgets with progress-bar warnings, budget-versus-actual comparison, and extension of the Rekap view and CSV/JSON export/import. All data-schema additions are additive so that backups created before this feature remain importable.

These requirements are derived from and remain consistent with the approved design document, including its data model (`expenses` array and `budgets` object keyed `month -> category -> amount`), its algorithmic specifications, and its ten correctness properties.

## Glossary

- **App**: The Buku Keuangan Digital PWA as a whole, including its hash-router and persistence layer.
- **Expense_Store**: The `localStorage`-backed data layer (`db`) extended with the `expenses` array and the `budgets` object.
- **Expense_Form**: The add/edit expense view (`renderAddExpense`) that captures and validates expense input.
- **Expense_List**: The expense list view (`renderExpenses`) that displays, filters, searches, and sorts expenses.
- **Dashboard**: The dashboard view (`renderDashboard`) that displays net profit cards and expense insights.
- **Cashflow_View**: The cashflow view (`renderCashflow`) that displays money-in versus money-out over time.
- **Budget_View**: The budget view (`renderBudgets`) that manages per-category monthly budgets and budget-versus-actual comparison.
- **Recap_View**: The Rekap view (`renderRecap`) that displays the monthly bookkeeping summary and export controls.
- **Aggregator**: The set of pure read-only functions (`summarizeExpenses`, `netProfit`, `buildCashflow`, `budgetVsActual`, `getExpensesForMonth`).
- **Recurring_Service**: The `carryOverRecurring` routine that creates monthly instances from recurring expense templates.
- **Import_Service**: The JSON/CSV import routine that validates and loads backup data into the Expense_Store.
- **Export_Service**: The JSON/CSV export routine that serializes data for backup and download.
- **Expense**: A money-out record with `id`, `date`, `name`, `category`, `amount`, `payment`, `recurring`, optional `recurringFrom`, and `note`.
- **Expense_Category**: One of `Iklan/Ads`, `Langganan Tools`, `Kuota/Internet`, `Listrik`, `Operasional`, `Fee Platform`, `Gaji/Komisi`, `Lainnya`.
- **Budget**: A planned amount for a specific `Expense_Category` within a specific month, stored at `budgets[monthKey][category]`.
- **Month_Key**: A string in `"YYYY-MM"` format identifying a calendar month, derived from a date via `getMonthKey`.
- **Gross_Profit**: The existing sales-margin profit (`total - modal - discount - fee`), excluding refunds.
- **Net_Profit**: Gross_Profit minus total expenses for a month.
- **Active_Month**: The month currently selected in application state (`state.activeMonth`).
- **Refund**: A transaction marked as a refund, which is excluded from money-in totals.

## Requirements

### Requirement 1: Record and Validate Expenses

**User Story:** As a business owner, I want to record standalone expenses with a category and amount, so that I can track money leaving my business independently of product cost.

#### Acceptance Criteria

1. WHEN a user submits the Expense_Form with a non-empty description and an amount greater than zero, THE Expense_Form SHALL create an Expense and persist it to the Expense_Store.
2. IF a user submits the Expense_Form with an empty description, THEN THE Expense_Form SHALL reject the submission, display the message "Jumlah & deskripsi pengeluaran wajib diisi", and leave the Expense_Store unchanged.
3. IF a user submits the Expense_Form with an amount less than or equal to zero, THEN THE Expense_Form SHALL reject the submission, display the message "Jumlah & deskripsi pengeluaran wajib diisi", and leave the Expense_Store unchanged.
4. WHEN the Expense_Form normalizes a submission whose category is missing or not in the set of Expense_Category values, THE Expense_Form SHALL assign the category "Lainnya".
5. WHEN the Expense_Form normalizes a submission whose date is missing, THE Expense_Form SHALL assign the current date.
6. WHEN the Expense_Form normalizes a submission, THE Expense_Form SHALL trim the description and coerce the amount to a number greater than zero.
7. WHERE an existing Expense identifier is supplied during normalization, THE Expense_Form SHALL preserve the original `id` and `createdAt` value and refresh the `updatedAt` value.

### Requirement 2: Manage the Expense List

**User Story:** As a business owner, I want a filterable and searchable list of my expenses, so that I can review and manage money-out records the same way I manage transactions.

#### Acceptance Criteria

1. THE Expense_List SHALL display every Expense belonging to the Active_Month.
2. WHEN a user enters a search term, THE Expense_List SHALL display only expenses whose description matches the search term.
3. WHEN a user selects a category filter, THE Expense_List SHALL display only expenses whose category equals the selected category.
4. WHEN a user selects a payment-method filter, THE Expense_List SHALL display only expenses whose payment method equals the selected payment method.
5. WHEN a user selects a sort option, THE Expense_List SHALL order the displayed expenses by date or by amount according to the selected option.
6. WHEN a user requests deletion of an Expense, THE Expense_List SHALL remove that Expense from the Expense_Store.
7. WHEN a user requests duplication of an Expense, THE Expense_List SHALL create a new Expense with a new identifier copied from the selected Expense.
8. WHEN a user requests editing of an Expense, THE Expense_Form SHALL open populated with the selected Expense values.

### Requirement 3: Carry Over Recurring Expenses

**User Story:** As a business owner, I want recurring monthly expenses to appear automatically each month, so that I do not have to re-enter fixed costs like subscriptions and internet.

#### Acceptance Criteria

1. WHEN the App loads or the Active_Month changes, THE Recurring_Service SHALL ensure that each recurring expense template has exactly one instance for the Active_Month.
2. WHEN the Recurring_Service creates an instance from a recurring template, THE Recurring_Service SHALL assign a new identifier, set the date to the first day of the Month_Key, and set `recurringFrom` to the template identifier.
3. IF a recurring template already has an instance for the Active_Month, THEN THE Recurring_Service SHALL create no additional instance for that template and that month.
4. WHEN the Recurring_Service runs twice for the same Month_Key, THE Recurring_Service SHALL produce the same set of instances as running once for that Month_Key.
5. WHILE no instance is created during a run, THE Recurring_Service SHALL leave the Expense_Store unchanged.

### Requirement 4: Summarize Expenses by Category

**User Story:** As a business owner, I want to see how my expenses break down by category and which category is largest, so that I understand where my money goes.

#### Acceptance Criteria

1. WHEN the Aggregator summarizes a set of expenses, THE Aggregator SHALL compute a total equal to the sum of all expense amounts in that set.
2. WHEN the Aggregator summarizes a set of expenses, THE Aggregator SHALL compute a per-category breakdown whose summed values equal the total.
3. WHEN the Aggregator summarizes a set of expenses, THE Aggregator SHALL report the category with the greatest accumulated amount as the top category.
4. IF the set of expenses is empty, THEN THE Aggregator SHALL report a total of zero and a top category labelled "-" with value zero.
5. WHEN the Aggregator retrieves expenses for a Month_Key, THE Aggregator SHALL return only expenses whose date maps to that Month_Key.

### Requirement 5: Display True Net Profit

**User Story:** As a business owner, I want dashboard cards showing my true net profit with a profit-or-loss indicator, so that I know whether my business is actually making money after expenses.

#### Acceptance Criteria

1. WHEN the Dashboard computes net profit for a Month_Key, THE Aggregator SHALL set Net_Profit equal to Gross_Profit minus total expenses for that Month_Key.
2. WHEN the Dashboard computes net profit for a Month_Key, THE Aggregator SHALL report the income, the Gross_Profit, and the total expenses for that Month_Key.
3. WHEN Net_Profit is greater than or equal to zero, THE Dashboard SHALL indicate a profit state.
4. WHEN Net_Profit is less than zero, THE Dashboard SHALL indicate a loss state.
5. THE Dashboard SHALL display the total income, total expenses, and Net_Profit as separate cards.

### Requirement 6: Display Expense-versus-Revenue Insights

**User Story:** As a business owner, I want to see my expense-to-revenue ratio and largest expense category, so that I can judge whether my spending is proportionate to my income.

#### Acceptance Criteria

1. WHEN income for the Active_Month is greater than zero, THE Dashboard SHALL display the expense-versus-revenue ratio as total expenses divided by income, expressed as a percentage.
2. IF income for the Active_Month is zero, THEN THE Dashboard SHALL display the expense-versus-revenue ratio as zero percent.
3. THE Dashboard SHALL display the label of the largest expense category for the Active_Month.

### Requirement 7: Display Cashflow with Surplus and Deficit

**User Story:** As a business owner, I want to see money in versus money out over days and months with surplus or deficit, so that I can understand my cash position over time.

#### Acceptance Criteria

1. WHERE the granularity is daily, THE Cashflow_View SHALL display one point per date within the Active_Month that has any income or expense.
2. WHERE the granularity is monthly, THE Cashflow_View SHALL display one point per Month_Key across all data that has any income or expense.
3. WHEN the Aggregator builds a cashflow point, THE Aggregator SHALL set the point's net value equal to its money-in value minus its money-out value.
4. THE Aggregator SHALL exclude Refund transactions from every cashflow money-in value.
5. WHEN the Aggregator builds a cashflow series, THE Aggregator SHALL order the points by their key in ascending order.
6. WHEN a cashflow point has a net value greater than or equal to zero, THE Cashflow_View SHALL present that point as a surplus.
7. WHEN a cashflow point has a net value less than zero, THE Cashflow_View SHALL present that point as a deficit.

### Requirement 8: Set Per-Category Monthly Budgets

**User Story:** As a business owner, I want to set a planned spending budget per category for each month, so that I can plan and control my expenses.

#### Acceptance Criteria

1. WHEN a user sets a Budget for an Expense_Category in a month, THE Budget_View SHALL store the planned amount at `budgets[monthKey][category]` in the Expense_Store.
2. WHEN the Budget_View reads a planned amount, THE Budget_View SHALL coerce the value to a number.
3. WHERE a planned amount is zero or blank, THE Budget_View SHALL treat the category as having no budget set.
4. THE Budget_View SHALL render budget controls only for the defined Expense_Category values.

### Requirement 9: Display Budget-versus-Actual with Progress Warnings

**User Story:** As a business owner, I want to compare actual spending against my budget with progress bars and warnings, so that I can see when I am approaching or exceeding my plan.

#### Acceptance Criteria

1. WHEN the Aggregator compares budget versus actual for a Month_Key, THE Aggregator SHALL produce one row per Expense_Category that has either a planned amount or actual spending.
2. WHEN a row has a planned amount greater than zero, THE Aggregator SHALL compute the percentage as actual spending divided by planned amount multiplied by one hundred.
3. IF a row has a planned amount of zero, THEN THE Aggregator SHALL set the percentage to zero and classify the level as "none".
4. WHEN actual spending exceeds a planned amount greater than zero, THE Aggregator SHALL classify the level as "over".
5. WHEN a planned amount is greater than zero and the percentage is at least eighty and at most one hundred, THE Aggregator SHALL classify the level as "warn".
6. WHEN a planned amount is greater than zero and the percentage is below eighty, THE Aggregator SHALL classify the level as "ok".
7. WHEN the Aggregator produces budget-versus-actual rows, THE Aggregator SHALL order the rows by actual spending in descending order.
8. THE Budget_View SHALL render a progress bar for each row reflecting its level and percentage.

### Requirement 10: Extend the Rekap View

**User Story:** As a business owner, I want the Rekap view to include expenses and net profit alongside revenue, so that I have a single combined bookkeeping summary per month.

#### Acceptance Criteria

1. THE Recap_View SHALL display, for the Active_Month, the omzet, the Gross_Profit, the total expenses, and the Net_Profit.
2. THE Recap_View SHALL provide a control to export the Active_Month expenses as CSV.
3. THE Recap_View SHALL provide a control to export all expenses as CSV.
4. THE Recap_View SHALL retain the existing transaction export controls.

### Requirement 11: Export Expenses and Backups

**User Story:** As a business owner, I want to export my expenses and full backup, so that I can keep records and move my data safely.

#### Acceptance Criteria

1. WHEN a user exports a full JSON backup, THE Export_Service SHALL serialize the transactions, products, targets, expenses, budgets, and settings.
2. WHEN a user exports expenses as CSV, THE Export_Service SHALL produce rows with the columns Tanggal, Deskripsi, Kategori, Jumlah, Metode Pembayaran, Berulang, and Catatan.
3. WHEN an expense's recurring flag is true, THE Export_Service SHALL write "Ya" in the Berulang column, and otherwise SHALL write "Tidak".
4. THE Export_Service SHALL leave the income CSV format unchanged.

### Requirement 12: Import Backups with Backward Compatibility

**User Story:** As a business owner, I want to import previous backups including ones created before this feature, so that I never lose access to my historical data.

#### Acceptance Criteria

1. WHEN a user imports a JSON backup that contains an `expenses` array and a `budgets` object, THE Import_Service SHALL load those values into the Expense_Store.
2. IF an imported JSON backup omits the `expenses` key or provides a non-array value, THEN THE Import_Service SHALL set `db.expenses` to an empty array.
3. IF an imported JSON backup omits the `budgets` key or provides a non-object value, THEN THE Import_Service SHALL set `db.budgets` to an empty object.
4. WHEN a user imports a backup created before this feature, THE Import_Service SHALL preserve all legacy transactions, products, targets, and settings intact.
5. WHEN the App loads stored data that lacks the `expenses` or `budgets` keys, THE Expense_Store SHALL supply an empty array for `expenses` and an empty object for `budgets`.
6. WHEN a user exports a backup and then imports that same backup, THE Import_Service SHALL reproduce the transactions, expenses, budgets, targets, and settings equivalently.
7. IF an import file fails JSON parsing or its transactions value is not an array, THEN THE Import_Service SHALL display the message "Import gagal: file JSON tidak valid" and leave the Expense_Store unchanged.

### Requirement 13: Handle Storage and Calculation Error Conditions

**User Story:** As a business owner, I want the app to handle storage limits and zero-division gracefully, so that the app never breaks or shows nonsensical values.

#### Acceptance Criteria

1. IF persisting to the Expense_Store fails because storage is full, THEN THE App SHALL display the message "Penyimpanan penuh, export & hapus data lama" and preserve the previously stored data.
2. IF a planned budget amount is zero when computing a percentage, THEN THE Aggregator SHALL return zero rather than a non-finite value.
3. IF income is zero when computing the expense-versus-revenue ratio, THEN THE Aggregator SHALL return zero rather than a non-finite value.

### Requirement 14: Render Safely and Preserve Offline Behavior

**User Story:** As a business owner, I want the new expense views to be safe and work offline like the rest of the app, so that my data is protected and available without a connection.

#### Acceptance Criteria

1. WHEN the App renders any user-supplied expense description, category, or note, THE App SHALL escape that text to prevent HTML injection.
2. THE App SHALL render the Expense_List as a table layout on desktop widths and as cards on mobile widths.
3. THE App SHALL operate the expense module without making any network request.
