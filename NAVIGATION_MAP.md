# PERI COLLECTION - Navigation Map

## Application Architecture

### Customer Portal
\`\`\`
/customer
├── / (Home)
│   └── Featured collections, promotions, AR try-on intro
├── /catalog
│   ├── Product listing with filters
│   ├── Category browsing
│   └── Search functionality
├── /product/[id]
│   ├── Product details
│   ├── Virtual try-on (AR)
│   ├── Reviews & ratings
│   └── Add to cart
├── /cart
│   ├── View items
│   ├── Update quantities
│   └── Proceed to checkout
├── /checkout
│   ├── Shipping address
│   ├── Payment method
│   └── Order confirmation
├── /orders
│   ├── Order history
│   ├── Order tracking
│   └── Order details
├── /returns
│   ├── Request return
│   ├── Return status
│   └── Return history
├── /login
│   └── Email/password authentication
├── /register
│   └── Create new account
└── /account
    ├── Profile information
    ├── Saved addresses
    ├── Payment methods
    └── Preferences
\`\`\`

### Admin Portal
\`\`\`
/admin
├── /dashboard
│   ├── Sales overview
│   ├── Revenue metrics
│   ├── Recent orders
│   ├── Inventory status
│   └── Key performance indicators
├── /products
│   ├── Product listing
│   ├── Add new product
│   ├── Edit product
│   ├── Manage inventory
│   └── Product categories
├── /orders
│   ├── Order listing
│   ├── Order details
│   ├── Update order status
│   ├── Generate invoices
│   └── Shipping management
├── /returns
│   ├── Return requests
│   ├── Process returns
│   ├── Refund management
│   └── Return history
├── /customers
│   ├── Customer list
│   ├── Customer details
│   ├── Purchase history
│   └── Communication
├── /analytics
│   ├── Sales reports
│   ├── Customer analytics
│   ├── Product performance
│   └── Traffic analysis
└── /settings
    ├── Store information
    ├── Shipping settings
    ├── Payment configuration
    ├── Tax settings
    └── User management
\`\`\`

## Design System

### Color Palette (Boutique Style)
- **Primary**: Black (#1a1a1a) - Main text and primary actions
- **Secondary**: Beige (#f5f1ed) - Backgrounds and accents
- **Accent**: Gold (#d4af37) - Highlights and interactive elements
- **Neutral**: White (#ffffff) - Card backgrounds
- **Muted**: Gray (#888888) - Secondary text

### Typography
- **Headings**: Geist (Bold, 24px-48px)
- **Body**: Geist (Regular, 14px-16px)
- **Mono**: Geist Mono (Code, 12px-14px)

### Component Hierarchy
- **Header**: Logo, search, navigation, cart, user menu
- **Sidebar (Admin)**: Navigation items, user info, logout
- **Footer**: Links, company info, social media
- **Cards**: Product cards, order cards, stat cards
- **Forms**: Login, register, checkout, product management

## Route Structure

### Customer Routes
- Public: `/`, `/customer/login`, `/customer/register`, `/customer/catalog`
- Protected: `/customer/cart`, `/customer/checkout`, `/customer/orders`, `/customer/account`

### Admin Routes
- Protected: All `/admin/*` routes require authentication
- Role-based: Admin-only access control

## Key Features

### Customer Features
- Product browsing and search
- Virtual try-on with AR
- Shopping cart management
- Secure checkout
- Order tracking
- Return management
- User account management

### Admin Features
- Product management (CRUD)
- Inventory tracking
- Order management
- Return processing
- Customer management
- Analytics and reporting
- Store settings
