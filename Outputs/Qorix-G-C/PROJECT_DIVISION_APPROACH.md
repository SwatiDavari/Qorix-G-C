# Qorix G-C: Project Division Architecture

**Goal:** Divide Qorix Classic, Adaptive, Bootloader, Developer, Performance, Lightweight, and Process Definition into independent product modules while maintaining shared components and utilities.

---

## 1. Current State

```
Qorix-G-C/
├── index.html                  (monolithic, references all products)
├── assets/
│   ├── data.js                 (all 7 products in one file)
│   ├── styles.css
│   └── [images, fonts, etc.]
├── js/
│   └── main.js                 (handles all product logic)
└── [other static files]
```

**Problem:** Single entry point, merged data/logic, hard to scale, team isolation difficult.

---

## 2. Target State Architecture

```
Qorix-G-C/
├── index.html                           (wrapper/router, loads product entry point)
├── core/                                (shared across all products)
│   ├── shared-components.js             (common UI components)
│   ├── utils.js                         (helpers: status labels, colors, date format)
│   ├── api-client.js                    (centralized JIRA/API calls)
│   └── styles/
│       └── core.css                     (shared typography, colors, grid)
│
├── data/                                (modular data layer)
│   ├── schema.js                        (shared product schema & types)
│   ├── products/
│   │   ├── classic-data.js              (Qorix Classic data only)
│   │   ├── adaptive-data.js
│   │   ├── bootloader-data.js
│   │   ├── developer-data.js
│   │   ├── performance-data.js
│   │   ├── lightweight-data.js
│   │   └── processdef-data.js
│   └── loader.js                        (dynamically loads product data)
│
├── products/                            (product-specific modules)
│   ├── classic/
│   │   ├── index.html
│   │   ├── classic.js                   (entry point)
│   │   ├── views/
│   │   │   ├── overview.js
│   │   │   ├── roadmap.js
│   │   │   └── team.js
│   │   ├── assets/
│   │   │   ├── styles.css               (classic-specific overrides)
│   │   │   └── icons.svg
│   │   └── README.md
│   │
│   ├── adaptive/
│   │   ├── index.html
│   │   ├── adaptive.js
│   │   ├── views/
│   │   │   ├── algorithm.js
│   │   │   └── timeline.js
│   │   ├── assets/
│   │   │   └── styles.css
│   │   └── README.md
│   │
│   ├── bootloader/
│   ├── developer/
│   ├── performance/
│   ├── lightweight/
│   └── processdef/
│
└── assets/                              (centralized, shared)
    ├── css/
    │   ├── variables.css                (color palette, typography)
    │   └── reset.css
    ├── fonts/
    ├── images/
    │   ├── qorix-logo.svg
    │   └── icons/
    └── README.md
```

---

## 3. Key Design Principles

### 3.1 Data Layer: Modular + Schema-Based

**Shared Schema** (`data/schema.js`):
```javascript
// Define the shape once, use everywhere
const ProductSchema = {
  id: String,
  name: String,
  abbr: String,
  color: String,
  tagline: String,
  pm: String,
  status: ['on-track', 'at-risk', 'delayed'],
  phase: ['Development', 'POC', 'Assessment'],
  metrics: { completion, budget, actual, forecast, fte },
  team: Array,
  roadmap: Array,
  risks: Array,
  compliance: Array,
  updated: String,
  description: String,
  tags: Array
};
```

**Product Data Files** (`data/products/classic-data.js`):
```javascript
// Import shared schema for type checking (optional, for documentation)
// Each product file contains ONLY its data

const CLASSIC = {
  product: {
    id: 'classic',
    name: 'Qorix Classic',
    // ... rest of classic data
  },
  team: [ /* classic team members */ ],
  roadmap: [ /* classic milestones */ ],
  risks: [ /* classic risks */ ],
  compliance: [ /* classic compliance */ ]
};

export { CLASSIC };
```

**Data Loader** (`data/loader.js`):
```javascript
// Single entry point for loading data
async function loadProductData(productId) {
  const dataMap = {
    classic: () => import('./products/classic-data.js'),
    adaptive: () => import('./products/adaptive-data.js'),
    // ...
  };
  
  const module = await dataMap[productId]();
  return module[productId.toUpperCase()] || {};
}

export { loadProductData };
```

### 3.2 Shared Components (`core/shared-components.js`)

```javascript
// Reusable UI building blocks
export const Components = {
  // Common card layouts
  MetricCard: (label, value, unit) => { /* returns HTML */ },
  StatusBadge: (status) => { /* returns HTML */ },
  ProgressBar: (current, total) => { /* returns HTML */ },
  
  // Common forms/inputs
  FilterDropdown: (options) => { /* returns HTML */ },
  
  // Navigation
  ProductTabs: (products, active) => { /* returns HTML */ }
};
```

### 3.3 Product-Specific Modules

Each product folder is **self-contained** but imports from `core/`:

```javascript
// products/classic/classic.js
import { Components } from '../../core/shared-components.js';
import { loadProductData } from '../../data/loader.js';
import { statusLabel, statusColor } from '../../core/utils.js';

class ClassicApp {
  constructor() {
    this.data = null;
  }
  
  async init(productId) {
    this.data = await loadProductData(productId);
    this.render();
  }
  
  render() {
    const overview = Components.MetricCard(
      'Completion',
      this.data.product.completion,
      '%'
    );
    // ... more rendering
  }
}

export { ClassicApp };
```

### 3.4 Asset Organization

**Centralized Shared** (`assets/css/variables.css`):
```css
:root {
  --color-qx-blue: #3C00FF;
  --color-qx-cyan: #00FFFF;
  --color-status-on-track: #22c55e;
  --color-status-at-risk: #f59e0b;
  
  --font-sans: 'Segoe UI', system-ui, sans-serif;
  --font-size-base: 14px;
  --spacing-unit: 8px;
}
```

**Product-Specific Overrides** (`products/classic/assets/styles.css`):
```css
/* Import shared variables first */
@import '../../assets/css/variables.css';

/* Classic-specific color scheme */
.classic-container {
  --primary-color: var(--color-qx-blue);
  background: linear-gradient(135deg, #3C00FF20, transparent);
}

.classic-header { /* product-specific styling */ }
```

---

## 4. Module Import Pattern (Plain HTML/JS)

Since this is plain HTML/JS without a bundler, use **ES6 modules**:

```html
<!-- Index wrapper / router -->
<script type="module">
  import { loadProductData } from './data/loader.js';
  import { ClassicApp } from './products/classic/classic.js';
  import { AdaptiveApp } from './products/adaptive/adaptive.js';

  const productId = new URLSearchParams(window.location.search).get('product') || 'classic';
  
  const apps = {
    classic: ClassicApp,
    adaptive: AdaptiveApp,
    // ...
  };
  
  const AppClass = apps[productId];
  const app = new AppClass();
  app.init(productId);
</script>
```

**Routes:**
- `index.html?product=classic` → loads Classic module
- `index.html?product=adaptive` → loads Adaptive module
- `products/classic/index.html` → standalone Classic view

---

## 5. Phased Migration Plan

### Phase 1: Prepare Infrastructure (Week 1)
- [ ] Create folder structure
- [ ] Extract `data/schema.js` (shared product type definitions)
- [ ] Create `core/utils.js` with shared helper functions
- [ ] Create `core/shared-components.js` with reusable UI components
- [ ] Set up `assets/` with centralized CSS variables

**Deliverable:** Folder structure + core utilities ready.

---

### Phase 2: Split Data Layer (Week 2)
- [ ] Move all product data from `data.js` into `data/products/*.js`
- [ ] Create `data/loader.js` to dynamically load product data
- [ ] Update references in existing code to use `loadProductData()`
- [ ] Test: Verify all 7 products load their own data correctly

**Deliverable:** Data layer fully modularized; single entry point still works.

---

### Phase 3: Extract Product Modules (Week 3-4)
- [ ] Create `products/classic/classic.js` → move Classic-specific logic
- [ ] Create `products/adaptive/adaptive.js` → move Adaptive logic
- [ ] Repeat for remaining 5 products
- [ ] Each module imports from `core/` and `data/loader.js`
- [ ] Test: Each product module can be loaded independently

**Deliverable:** All 7 products have independent modules.

---

### Phase 4: Product-Specific Assets (Week 5)
- [ ] Create `products/*/assets/styles.css` for product overrides
- [ ] Move product-specific icons/images to respective `assets/` folders
- [ ] Centralize shared assets to top-level `assets/`
- [ ] Test: Products render with correct styling

**Deliverable:** Asset organization complete; no duplication of shared resources.

---

### Phase 5: Product Entry Points (Week 6)
- [ ] Create `products/classic/index.html` (standalone)
- [ ] Create `products/adaptive/index.html` (standalone)
- [ ] Repeat for remaining products
- [ ] Each `index.html` can load its product module independently

**Deliverable:** Each product has its own standalone entry point.

---

### Phase 6: Router & Integration (Week 7)
- [ ] Update root `index.html` to be a router/wrapper
- [ ] Add product switcher UI
- [ ] Implement URL-based routing (`?product=classic`)
- [ ] Test: All products accessible from main dashboard

**Deliverable:** Single entry point that routes to any product.

---

## 6. File Naming Conventions

| Location | Naming | Example |
|----------|--------|---------|
| Data files | `{product}-data.js` | `classic-data.js`, `adaptive-data.js` |
| Product entry | `{product}.js` | `classic.js`, `adaptive.js` |
| Views/Pages | `{view-name}.js` | `overview.js`, `roadmap.js`, `team.js` |
| Styles | `styles.css` (product override) | `products/classic/assets/styles.css` |
| Shared utilities | `{feature}.js` | `utils.js`, `api-client.js`, `shared-components.js` |

---

## 7. Responsibilities & Boundaries

| Layer | Responsibility | Owns |
|-------|-----------------|------|
| **Core** | Shared logic, reusable components, helpers | `core/`, `assets/`, `data/schema.js` |
| **Data** | Product data, loading strategy | `data/products/`, `data/loader.js` |
| **Product Modules** | Product-specific logic, UI, styling | `products/{id}/` |
| **Entry Points** | Routing, initialization | `index.html`, `products/{id}/index.html` |

---

## 8. Key Migration Gotchas

1. **Avoid circular imports:** Core utilities should NOT import from product modules.
2. **Shared data reference:** All products reference `PHASES` and color palette from core—don't duplicate in product data.
3. **JIRA config:** Keep `JIRA_CFG` centralized; products access via `core/api-client.js`.
4. **localStorage persistence:** Keep global prefix `qx_` but scope product-specific keys to product ID:
   - `qx_jira_data_classic` (current)
   - `qx_jira_cfg_classic` (current)
5. **Module loading timing:** Ensure data is loaded BEFORE rendering UI to avoid "undefined" errors.

---

## 9. Benefits of This Approach

✅ **Independent teams:** Each product team owns `products/{id}/`  
✅ **Scalability:** New product? Copy `products/template/` folder, add to `data/loader.js`  
✅ **Code reuse:** Shared components in `core/` prevent duplication  
✅ **No build step:** Plain ES6 modules work in browser  
✅ **Gradual migration:** Can move to this structure incrementally  
✅ **Standalone products:** Each product is independently deployable  

---

## 10. Next Steps

1. **Review** this architecture with your team
2. **Assign** a lead for each phase
3. **Create** the folder structure (Phase 1)
4. **Start** with data layer (Phase 2)
5. **Iterate** on shared components as products extract their logic

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-28  
**Author:** HTML/UX Architecture Review
