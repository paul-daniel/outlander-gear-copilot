-- ============================================
-- Outlander Gear Co. — Database Schema
-- Dialecte : PostgreSQL
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===================== CATEGORIES =====================
CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL UNIQUE,
    slug        VARCHAR(120)  NOT NULL UNIQUE,
    description TEXT,
    image_url   VARCHAR(500),
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ===================== PRODUCTS =====================
CREATE TABLE IF NOT EXISTS products (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255)   NOT NULL,
    slug            VARCHAR(280)   NOT NULL UNIQUE,
    description     TEXT,
    short_desc      VARCHAR(300),
    price           DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    compare_price   DECIMAL(10, 2) CHECK (compare_price IS NULL OR compare_price >= 0),
    stock_quantity  INTEGER        NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    category_id     INTEGER        REFERENCES categories(id) ON DELETE SET NULL,
    image_url       VARCHAR(500),
    images          TEXT[],
    weight_kg       DECIMAL(5, 2),
    is_featured     BOOLEAN        DEFAULT FALSE,
    is_active       BOOLEAN        DEFAULT TRUE,
    rating_avg      DECIMAL(2, 1)  DEFAULT 0 CHECK (rating_avg >= 0 AND rating_avg <= 5),
    rating_count    INTEGER        DEFAULT 0,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_active   ON products(is_active)   WHERE is_active = TRUE;

-- ===================== USERS =====================
CREATE TABLE IF NOT EXISTS users (
    id             SERIAL PRIMARY KEY,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL,
    phone          VARCHAR(30),
    role           VARCHAR(20)  DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ===================== ADDRESSES =====================
CREATE TABLE IF NOT EXISTS addresses (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label       VARCHAR(50)  DEFAULT 'Domicile',
    line1       VARCHAR(255) NOT NULL,
    line2       VARCHAR(255),
    city        VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20)  NOT NULL,
    country     VARCHAR(100) DEFAULT 'France',
    is_default  BOOLEAN      DEFAULT FALSE,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ===================== CART =====================
CREATE TABLE IF NOT EXISTS cart_items (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  INTEGER   NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity    INTEGER   NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- ===================== ORDERS =====================
CREATE TABLE IF NOT EXISTS orders (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          VARCHAR(30)    DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
    total_amount    DECIMAL(12, 2) NOT NULL CHECK (total_amount >= 0),
    shipping_address TEXT,
    payment_method  VARCHAR(50)    DEFAULT 'card',
    notes           TEXT,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  INTEGER        NOT NULL REFERENCES products(id) ON DELETE SET NULL,
    quantity    INTEGER        NOT NULL CHECK (quantity > 0),
    unit_price  DECIMAL(10, 2) NOT NULL,
    created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- ===================== REVIEWS =====================
CREATE TABLE IF NOT EXISTS reviews (
    id          SERIAL PRIMARY KEY,
    product_id  INTEGER   NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id     INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating      INTEGER   NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title       VARCHAR(200),
    comment     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id);

-- ===================== PRODUCT SPECIFICATIONS =====================
CREATE TABLE IF NOT EXISTS product_specifications (
    id          SERIAL PRIMARY KEY,
    product_id  INTEGER      NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    spec_key    VARCHAR(100) NOT NULL,
    spec_value  VARCHAR(255) NOT NULL,
    spec_unit   VARCHAR(50),
    spec_group  VARCHAR(50)  NOT NULL DEFAULT 'general',
    UNIQUE(product_id, spec_key)
);

CREATE INDEX idx_product_specs_product ON product_specifications(product_id);
CREATE INDEX idx_product_specs_group   ON product_specifications(spec_group);

-- ===================== PRODUCT TAGS =====================
CREATE TABLE IF NOT EXISTS product_tags (
    id          SERIAL PRIMARY KEY,
    product_id  INTEGER     NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag         VARCHAR(50) NOT NULL,
    UNIQUE(product_id, tag)
);

CREATE INDEX idx_product_tags_product ON product_tags(product_id);
CREATE INDEX idx_product_tags_tag     ON product_tags(tag);

-- ===================== WISHLIST =====================
CREATE TABLE IF NOT EXISTS wishlists (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  INTEGER   NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);
