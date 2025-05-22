# Alerts
Actionable items: Alerts are the things your Operations, Sales or CX teams need to intervene on.
Prioritization: Not every detractor is equal—“B2B_DETRACTOR” or “CONTACT_ME” might require SLA‑driven SLAs.
Tracking: You need to see which alerts are piling up, aging, or getting resolved.

## Alert Types and Their Signals
| Alert              | Description                                                                       |
|--------------------|-----------------------------------------------------------------------------------|
| **ALERT_CREATED**  | A new issue was detected (generic “flag” to investigate).                         |
| **B2B_DETRACTOR**  | A business customer gave a low score—high priority for your Enterprise team.      |
| **BAD_JOIN**       | The customer complains of poor network “join” (on‑boarding) performance.          |
| **CC_AGENT**       | Feedback points at a Contact‑Center agent interaction (good or bad).              |
| **CC_PROCESS**     | Feedback about your Contact‑Center process (e.g., long hold times, call transfers).|
| **CONTACT_ME**     | A “please call me back” request—an immediate sales or support follow‑up.          |
| **DETRACTOR**      | A plain detractor tag—generic low‑score customer, not otherwise categorized.      |
| **PRODUCT_PRICE**  | The customer cited price as their pain point.                                     |
| **RETAIL_AGENT**   | An in‑store/retail touchpoint (POS) is being praised or criticized.               |


## A. High‑Level KPIs
- **Total Open Alerts**: Count of alerts where `alert_status ≠ CLOSED`.
- **New Alerts This Period**: Alerts created in the last 7 days.
- **Average Age of Open Alerts**: `(current_timestamp – ingestion_dttm)`.

## B. Alert Volume by Type
- **Visualization**: Stacked bar chart showing the count of alerts by type.
- **Color‑coding**: Each bar is segmented by `alert_status` (NEW, IN_PROGRESS, OVERDUE, CLOSED).

## C. Alert Status Funnel
- **Visualization**: Funnel or donut chart showing the flow:
    - NEW → IN_PROGRESS → OVERDUE → CLOSED.
- **Purpose**: Identify where alerts are getting “stuck.”

## D. Regional Heatmap / Table
- **Option 1**: Heatmap on a territory map (or by `retail_region_name`) showing total alerts per region.
- **Option 2**: Sortable table with columns:
    - Region | # New | # In Progress | # Overdue | # Closed | Avg. Age.

## E. Alert Aging & SLA
- **Histogram**: Distribution of alert ages (in hours or days) to identify overdue alerts.
- **Box‑plot**: Age by alert type to highlight categories with the longest resolution times.

## F. Drill‑Down Table
- **Table Columns**:
    - `msisdn`, `alert`, `alert_status`, `ingestion_dttm`, `first_resp`, `nps_score`, `region`, `plan_desc`.
    - Example:  
        | msisdn   | alert        | alert_status | ingestion_dttm       | first_resp       | nps_score | region | plan_desc              |
        |----------|--------------|--------------|-----------------------|------------------|-----------|--------|------------------------|
        | 0555…    | CONTACT_ME   | NEW          | 2021-01-01 08:15:00  | 2021-01-01 08:17 | 8         | Alger  | Hayla Bezzef Prepaid_4G |
- **Filters**:
    - By alert type, `alert_status`, region, city, or segment.
- **Actions**: Link each row to a case‑management system or CRM workflow.

---

## 4. How to Wire It Up in Your Web App

### Back-End Queries
```sql
-- Volume by type & status
SELECT
    alert,
    alert_status,
    COUNT(*) AS cnt
FROM survey_data2
WHERE nps_score <= 6  -- usually only detractors generate alerts
GROUP BY alert, alert_status;
```

### API Endpoints
- `GET /api/alerts/summary`: Top‑level KPIs.
- `GET /api/alerts/by-type`: Counts by alert & status.
- `GET /api/alerts/list`: Paginated drill‑down table with filter/sort query parameters.

### Front-End
- **Page**: `/alerts` in your React (or Vue/Angular) router.
- **Components**:
    - `AlertKPIs`: Gauge + counters.
    - `AlertByTypeChart`: Stacked bar chart.
    - `AlertStatusFunnel`: Funnel chart.
    - `RegionHeatmap` or `AlertRegionTable`.
    - `AlertListTable`: Includes filter controls.

---

## Putting It All Together
The Alerts page serves as the nerve center for customer‑care operations:
- **Overview**: See volume & trends at a glance.
- **Drill‑down**: Explore problem areas by type or region.
- **Track SLAs**: Use aging charts to monitor performance.
- **Actionable Insights**: Assign & resolve alerts directly from the table.

---
