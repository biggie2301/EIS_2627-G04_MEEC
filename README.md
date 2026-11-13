# Courier Management System (CMS) — Enterprise Information Systems (EIS)

> **Course:** Mestrado em Engenharia Eletrotécnica e de Computadores (MEEC)  
> **Institution:** Faculdade de Engenharia da Universidade do Porto (FEUP)  
> **Sprint 1 Submission Deadline:** November 15 at 23:59 (Moodle Time)

---

## 1. Project Overview
The primary objective of this project is to develop a Web-based Enterprise Information System (IS) for courier and logistics management. Sprint 1 covers defining global system requirements, creating the conceptual database architecture (ER Diagram), and implementing a functional, navigable static user interface prototype utilizing standard Web technologies (HTML5, CSS3, and JavaScript form validations).
---

## 2. Repository Structure

```
EIS_2627-G04_MEEC/
├── nbproject/              NetBeans HTML5/JavaScript project (open this folder in NetBeans)
├── public_html/            Site root — static Sprint 1 prototype
│   ├── index.html          Home / Portal (public)
│   ├── login.html          Login / Register (public)
│   ├── team.html           Team page (public)
│   ├── client.html         Client page
│   ├── courier.html        Courier page
│   ├── staff.html          Staff panel
│   ├── admin.html          Admin panel
│   ├── css/                base.css (shared) + one stylesheet per page
│   ├── js/                 validation.js + login.js (fast login), client.js, courier.js (maps)
│   └── img/                logo
└── docs/                   requirements, use cases, sketches, ER model
```

### How to run
Open the repository folder in Apache NetBeans (**File → Open Project**) and press **Run Project (F6)**, or open `public_html/index.html` in a browser. The maps use Leaflet.js and OpenStreetMap tiles, so they need an internet connection.

### Sprint 1 scope
The pages are static and show sample data. Only navigation works: the navbar, the side menus, and the **fast login** on the login page. An empty field shows a validation error, and a demo account (`client@cms.pt`, `courier@cms.pt`, `staff@cms.pt`, `admin@cms.pt`, any password) opens that area. All other buttons and fields are disabled, and the maps only display the FEUP marker and the route. Everything becomes active in Sprint 2.

---

## 3. Core System Requirements & Actors
* **Clients:** Register products and place orders specifying Origin and Destination locations using individual GPS coordinates (Latitude and Longitude), view active order statuses, and access completed order histories.
* **Couriers:** Manage fleet vehicles, select appropriate vehicles for orders, execute a "single active task" or consolidate multiple active orders into a single route, transition order statuses sequentially (`Initiated` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`/`Cancelled`), submit mandatory Electronic Proof of Delivery (e-POD via digital canvas signature or delivery photo), return cancelled orders to the pool, and view completed orders.
* **Staff:** Validate courier accounts and approve individual vehicles before allocation by verifying valid insurance and inspection certificates, with visual alerts for updated or outdated information.
* **Administrators:** Validate new staff members, edit personal information, and access an operational KPI analytics dashboard displaying metrics such as counts of couriers, staff, clients, and route statistics.

---

## 4. Technical Stack & Constraints
* **Frontend Technologies:** HTML5, CSS3, and JavaScript (with mandatory client-side empty field prevention and error alerts).
* **Mapping API:** Leaflet.js library and OpenStreetMap (OSM) tiles for client order map creation and courier navigation cockpit marker placement.
* **Version Control:** Git and GitHub, using the mandatory repository naming convention: `EIS_2627-GXXX_MXXX` (e.g., `EIS_2627-G01_MEEC`).

---

## 5. Deliverables & Evaluation Breakdown
The Sprint 1 submission is a single `.zip` file submitted by the team leader on Moodle containing:
1. HTML/CSS/JS source code with sample test data.
2. High-resolution Entity-Relationship (ER) Diagram image.
3. Self and hetero evaluation using the official Moodle template.
4. Academic Report in `.pdf` using the official Moodle template.
