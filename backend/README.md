# FreshFlow Backend

Express + MongoDB API for FreshFlow quick-commerce.

## Endpoints
- `GET /health` – service health
- `POST /api/auth/register` – signup
- `POST /api/auth/login` – login
- `GET /api/products` – list products (q, size, type, minPrice, maxPrice)
- `POST /api/products` – create product (admin)
- `PUT /api/products/:id` – update product (admin)
- `DELETE /api/products/:id` – delete product (admin)
- `POST /api/orders` – create order (user)
- `GET /api/orders` – list my orders (user)
- `GET /api/orders/all` – list all orders (admin)
- `PUT /api/orders/:id` – update order status (admin)
- `DELETE /api/orders/:id` – delete/cancel order (admin)
- `POST /api/contact` – submit contact form
- `GET /api/contact` – list contacts (admin)
- `POST /api/upload` – upload product image (admin) → returns `{ url }`, served under `/uploads/*`

## Order Status Flow
Statuses are admin-controlled only. Flow:
`Pending → Confirmed → Preparing → Out for Delivery → Delivered`.
User order creation starts at `Pending`.

## Env
See `.env.example`.

## Run locally
```bash
npm install
npm run dev
```

## Deployment
Use `render.yaml` with Render. Set `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`.
