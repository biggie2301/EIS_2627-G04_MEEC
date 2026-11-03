# CMS — Conceptual ER model

Notation: crow's foot. PK = primary key, FK = foreign key, UK = unique.

## Entities

| Entity | Main attributes | Role |
|---|---|---|
| **USER** | user_id, username, password_hash, email, name, phone, nif, role, account_status, validated_by, validated_at, created_at | One entity for the four roles (`client`, `courier`, `staff`, `admin`). `account_status` + `validated_by` record the validation workflow (staff validates couriers, admin validates staff). |
| **VEHICLE_TYPE** | type_id, type_name | Standard categories (Bike, Moto, Van, Truck) used for capacity checks. |
| **VEHICLE** | vehicle_id, courier_id, type_id, license_plate, model, max_weight_kg, max_vol_m3, insurance_expiry_date, inspection_expiry_date, insurance_expiry_doc, inspection_expiry_doc, approval_status, approved_by, docs_updated_at, created_at | Fleet asset registered by a courier and audited by staff. |
| **PRODUCT** | product_id, client_id, description, category, weight_kg, volume_m3, created_at | Cargo item registered by a client. |
| **ORDER** | order_id, client_id, route_id, origin_lat, origin_long, dest_lat, dest_long, status, attempt, price_eur, created_at, completed_at | Delivery request with GPS coordinates. `attempt` counts re-tries after cancellations. |
| **ORDER_PRODUCT** | order_id, product_id, quantity | Associative entity: an order has one or more products, and a product can be in many orders (M:N). |
| **ROUTE** | route_id, courier_id, vehicle_id, status, started_at, completed_at, created_at | Delivery assignment linking one courier, one vehicle and one or more orders (consolidation). |
| **PROOF_OF_DELIVERY** | pod_id, order_id, pod_type, file_path, recipient_name, submitted_at | Mandatory e-POD (signature or photo) of a completed order (1:0..1). |
| **ORDER_STATUS_HISTORY** | history_id, order_id, changed_by, old_status, new_status, note, changed_at | Audit trail of the sequential status transitions. Feeds the tracking timeline and statistics. |
| **VEHICLE_ALERT** | alert_id, vehicle_id, alert_type, message, resolved_by, created_at, resolved_at | Alerts for staff: documents updated, insurance/inspection expired or expiring soon. |

## Relationships

| Relationship | Cardinality |
|---|---|
| USER (client) *registers* PRODUCT | 1 : 0..N |
| USER (client) *places* ORDER | 1 : 0..N |
| USER (courier) *owns* VEHICLE | 1 : 0..N |
| USER (staff) *approves* VEHICLE | 0..1 : 0..N |
| USER (courier) *executes* ROUTE | 1 : 0..N |
| USER *validates* USER (recursive) | 0..1 : 0..N |
| VEHICLE_TYPE *classifies* VEHICLE | 1 : 0..N |
| VEHICLE *is used in* ROUTE | 1 : 0..N |
| ROUTE *groups* ORDER | 0..1 : 1..N |
| ORDER *contains* PRODUCT (via ORDER_PRODUCT) | M : N |
| ORDER *is confirmed by* PROOF_OF_DELIVERY | 1 : 0..1 |
| ORDER *logs* ORDER_STATUS_HISTORY | 1 : 1..N |
| USER *changes* ORDER_STATUS_HISTORY | 1 : 0..N |
| VEHICLE *raises* VEHICLE_ALERT | 1 : 0..N |
| USER (staff) *resolves* VEHICLE_ALERT | 0..1 : 0..N |

## Business rules (enforced in the prototype's JavaScript)

1. **Single active task:** a courier has at most one ROUTE with status `initiated` or `in_progress`.
2. **Capacity:** for a route, Σ(weight_kg × quantity) ≤ VEHICLE.max_weight_kg and Σ(volume_m3 × quantity) ≤ VEHICLE.max_vol_m3, counting every order in the route.
3. **Eligibility (STF-04):** a vehicle can be allocated only if `approval_status = approved`, both documents exist, neither expiry date has passed, and the owner courier is validated.
4. **Sequential status:** `pending → initiated → in_progress → completed | cancelled`. A cancelled order returns to `pending`, with `route_id = NULL` and `attempt + 1`.
5. **e-POD:** an order can only become `completed` when a PROOF_OF_DELIVERY is submitted.
6. **Validation:** couriers are validated by staff, staff by admins. Clients are active right after registering.
7. Updating vehicle documents puts the vehicle back to `pending` and raises a `doc_updated` alert.
