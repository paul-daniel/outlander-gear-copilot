-- ============================================
-- Outlander Gear Co. — Seed Data
-- ============================================

-- Clean slate (cascade deletes dependent rows)
TRUNCATE TABLE reviews, order_items, orders, cart_items, wishlists, addresses, product_specifications, product_tags, products, categories RESTART IDENTITY CASCADE;

-- ===================== CATEGORIES (9) =====================
INSERT INTO categories (name, slug, description, image_url) VALUES
('Camping',          'camping',          'Tents, sleeping bags, pads, and stoves — everything you need to sleep under the stars.',   'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600'),
('Hiking',           'hiking',           'Backpacks, trekking poles, and trail-running gear for every distance.',                    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600'),
('Clothing',         'clothing',         'Technical jackets, insulated layers, and convertible pants built for the outdoors.',       'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'),
('Footwear',         'footwear',         'Trail runners, hiking boots, mountaineering boots, and recovery sandals.',                'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600'),
('Accessories',      'accessories',      'Headlamps, knives, compasses, and essential small gear.',                                 'https://images.unsplash.com/photo-1550985543-49bee3167284?w=600'),
('Climbing',         'climbing',         'Harnesses, ropes, quickdraws, helmets, and climbing protection.',                         'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600'),
('Hydration',        'hydration',        'Insulated bottles, water filters, purifiers, and hydration bladders.',                    'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600'),
('Winter Sports',    'winter-sports',    'Ski goggles, insulated gloves, gaiters, and cold-weather essentials.',                    'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600'),
('Travel & Packing', 'travel-packing',   'Packing cubes, travel towels, compression sacks, and on-the-go organizers.',             'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600');

-- ===================== PRODUCTS (31) =====================
INSERT INTO products (name, slug, description, short_desc, price, compare_price, stock_quantity, category_id, image_url, weight_kg, is_featured, rating_avg, rating_count) VALUES

-- ── Camping (6) ──
('Alpine Pro Tent 2P',             'alpine-pro-tent-2p',
 'Lightweight 2-person, 3-season double-wall tent. 3000 mm waterproof fly, 5000 mm floor. DAC aluminum poles with hubbed cross design for fast setup. Two vestibules for gear storage. Packed size 45×15 cm.',
 '2P 3-season tent, 3000 mm fly',
 349.99, 429.99, 25, 1, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600', 2.10, TRUE, 4.7, 12),

('Alpine Pro Tent 4P',             'alpine-pro-tent-4p',
 'Spacious 4-person, 3-season tent with two doors and two vestibules. 3000 mm fly, 5000 mm floor. Color-coded DAC poles for intuitive setup. Interior pockets and gear loft included.',
 '4P 3-season tent, 3000 mm fly',
 499.00, 579.00, 15, 1, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600', 3.40, FALSE, 4.5, 7),

('Expedition Sleeping Bag -15°C',  'expedition-sleeping-bag-15',
 'Mummy sleeping bag filled with 800-fill-power RDS goose down. Comfort rating -5 °C, extreme -15 °C. Anti-snag zipper with insulated draft tube. Includes compression stuff sack.',
 '800 cuin goose down, comfort -5 °C',
 299.50, NULL, 18, 1, 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=600', 1.20, TRUE, 4.8, 9),

('Summer Sleeping Bag 5°C',        'summer-sleeping-bag-5',
 'Lightweight rectangular sleeping bag for warm-weather camping. 600-fill-power duck down, comfort 10 °C, lower limit 5 °C. Opens fully flat as a quilt. Weight just 750 g.',
 '600 cuin duck down, comfort 10 °C',
 149.00, 179.00, 30, 1, 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=600', 0.75, FALSE, 4.3, 5),

('UltraLight Sleeping Pad',        'ultralight-sleeping-pad',
 'Self-inflating sleeping pad with R-value 4.2. 8 cm thick, rapid-inflate valve. Weighs only 450 g. Packed size 23×10 cm. Ideal for 3-season backpacking and bivouac comfort.',
 'Self-inflating pad, R 4.2, 450 g',
 129.00, 159.00, 35, 1, 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600', 0.45, FALSE, 4.4, 6),

('GasPro Compact Stove',           'gaspro-compact-stove',
 'Ultralight canister stove weighing just 95 g. Integrated piezo ignition, 2800 W output, boils 1 L in 3 min. Supports pots up to 3 L. Compatible with standard threaded canisters.',
 'Canister stove 95 g, piezo, 2800 W',
 59.95, NULL, 50, 1, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 0.095, FALSE, 4.6, 8),

-- ── Hiking (4) ──
('Trekking Backpack 55L',          'trekking-backpack-55l',
 'Ergonomic 55-liter backpack with internal aluminum frame, padded hip belt, and integrated rain cover. U-zip front access, hydration sleeve, and multiple lash points.',
 '55 L backpack, alu frame, rain cover',
 189.95, 229.00, 40, 2, 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600', 1.80, TRUE, 4.5, 10),

('Day Hike Pack 28L',              'day-hike-pack-28l',
 'Streamlined 28-liter daypack with ventilated back panel, trekking-pole attachment loops, and stretch side pockets. Lightweight at 680 g. Perfect for day hikes and fast-packing.',
 '28 L daypack, ventilated, 680 g',
 89.95, NULL, 55, 2, 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600', 0.68, FALSE, 4.4, 6),

('Carbon Trekking Poles',          'carbon-trekking-poles',
 'Pair of telescopic carbon-fiber trekking poles. Cork grips, tungsten tips, FlickLock adjustment 65–135 cm. 380 g per pair. Includes rubber tips and snow baskets.',
 'Carbon poles 380 g, cork grips',
 89.95, NULL, 60, 2, 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600', 0.38, FALSE, 4.6, 7),

('Trail Running Vest 12L',         'trail-running-vest-12l',
 'Race-ready 12 L running vest with 1.5 L hydration bladder included. Elastic chest pockets for soft flasks, breathable mesh back panel. Weighs 320 g empty.',
 'Trail vest 12 L, bladder included',
 119.00, NULL, 45, 2, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 0.32, FALSE, 4.3, 4),

-- ── Clothing (4) ──
('StormShield Waterproof Jacket',  'stormshield-waterproof-jacket',
 '3-layer hardshell jacket with fully taped seams, helmet-compatible hood, and pit zips. 20 000 g/m²/24 h breathability. Packs into its own chest pocket. 420 g.',
 '3-layer hardshell, 20 k breathability',
 259.00, 319.00, 30, 3, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', 0.42, TRUE, 4.8, 14),

('Down Jacket 700 Fill',           'down-jacket-700-fill',
 'Lightweight down jacket with 700-fill-power RDS duck down. Packs into its own pocket. Elastic cuffs, adjustable hem. Ideal mid-layer or standalone on cool evenings.',
 'Down 700 cuin, packs into pocket',
 179.00, NULL, 22, 3, 'https://images.unsplash.com/photo-1614079290101-0c2181ac8ea3?w=600', 0.35, FALSE, 4.5, 8),

('Convertible Trek Pants',         'convertible-trek-pants',
 'Zip-off hiking pants that convert to shorts. Stretch water-repellent fabric with UPF 50+ sun protection. Four zippered pockets. Gusseted crotch for freedom of movement.',
 'Zip-off pants, stretch, UPF 50+',
 89.00, 109.00, 38, 3, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600', 0.34, FALSE, 4.2, 5),

('Merino Base Layer Top',          'merino-base-layer-top',
 '100 % Merino wool long-sleeve top, 185 g/m² weight. Naturally odor-resistant, moisture-wicking, and temperature-regulating. Flatlock seams prevent chafing.',
 '185 g/m² Merino wool, anti-odor',
 79.00, NULL, 40, 3, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', 0.22, FALSE, 4.6, 6),

-- ── Footwear (4) ──
('Trail Grip X Shoes',             'trail-grip-x-shoes',
 'Trail running shoes with Vibram Megagrip outsole, waterproof membrane, and reinforced toe cap. 8 mm drop, 22 mm stack height. Optimal grip on rocky terrain. Runs small — order half-size up.',
 'Vibram Megagrip trail, waterproof',
 159.99, NULL, 55, 4, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', 0.68, TRUE, 4.4, 11),

('Alpinist Mountaineering Boots',  'alpinist-mountaineering-boots',
 'Rigid mountaineering boots compatible with automatic crampons (C3 rated). Gore-Tex Insulated Comfort lining, Thinsulate 400 g insulation. Vibram Mulaz sole.',
 'Crampon-compatible, Gore-Tex Insulated',
 389.00, 449.00, 12, 4, 'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=600', 1.90, FALSE, 4.7, 5),

('Mid Hiking Boots',               'mid-hiking-boots',
 'Versatile mid-cut hiking boots with nubuck/mesh upper, EVA midsole, and Vibram outsole. Waterproof membrane, padded ankle collar. Great all-around boot for trails and light scrambles.',
 'Mid-cut, Vibram, waterproof',
 169.00, 199.00, 35, 4, 'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=600', 0.82, FALSE, 4.3, 7),

('Recovery Camp Sandals',          'recovery-camp-sandals',
 'Lightweight EVA sandals designed for post-hike recovery. Contoured footbed, quick-dry straps, 220 g per pair. Wear around camp to let your feet breathe.',
 'EVA recovery sandals, 220 g',
 39.95, NULL, 80, 4, 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600', 0.22, FALSE, 4.1, 3),

-- ── Accessories (3) ──
('Headlamp 600 Lumens',            'headlamp-600-lumens',
 'Rechargeable USB-C headlamp with 4 lighting modes and motion sensor. 600 lm max, 40 h runtime on eco mode. IPX6 water resistance. 75 g.',
 'USB-C headlamp 600 lm, IPX6',
 49.99, NULL, 75, 5, 'https://images.unsplash.com/photo-1550985543-49bee3167284?w=600', 0.075, FALSE, 4.5, 9),

('Multi-Tool Knife',               'multi-tool-knife',
 'Folding knife with 8 cm stainless-steel blade, can opener, screwdriver, bottle opener, saw, and awl. Wood/steel handle with liner lock. 120 g.',
 'Folding knife, 6 tools, liner lock',
 34.99, NULL, 65, 5, 'https://images.unsplash.com/photo-1582843117210-42646734ab9e?w=600', 0.12, FALSE, 4.3, 4),

('Sighting Compass Pro',           'sighting-compass-pro',
 'Mirror-sight compass with adjustable declination, 1:25 000 and 1:50 000 scales, luminous bezel, and oil-damped needle. Essential navigation tool. 60 g.',
 'Mirror compass, topo scales, 60 g',
 29.95, NULL, 40, 5, 'https://images.unsplash.com/photo-1505778276668-26b3ff7af103?w=600', 0.06, FALSE, 4.4, 3),

-- ── Climbing (3) ──
('ConfortPro Climbing Harness',    'confortpro-climbing-harness',
 'All-around climbing harness with 4 gear loops, adjustable leg loops, and wide padded waistbelt. CE EN 12277 certified. Suitable for sport, trad, and multipitch.',
 'Harness 4 gear loops, CE certified',
 79.95, 99.00, 28, 6, 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600', 0.38, TRUE, 4.6, 8),

('Dynamic Rope 70 m × 9.5 mm',    'dynamic-rope-70m-9-5mm',
 '70-meter dynamic single rope, 9.5 mm diameter. Dry-treated sheath for wet conditions. UIAA fall rating: 8. Impact force 8.2 kN. Middle mark for easy rappels.',
 'Dynamic 70 m, dry treatment, UIAA 8',
 189.00, NULL, 15, 6, 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600', 4.20, FALSE, 4.5, 5),

('Climbing Helmet AirFlow',        'climbing-helmet-airflow',
 'Lightweight hybrid-shell climbing helmet with 12 ventilation ports. CE EN 12492. Adjustable headband fits 52–62 cm. Headlamp clips on both sides. 250 g.',
 'Hybrid shell helmet, 250 g, CE',
 69.00, NULL, 30, 6, 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600', 0.25, FALSE, 4.4, 4),

-- ── Hydration (3) ──
('Insulated Bottle 1 L',           'insulated-bottle-1l',
 'Double-wall 18/8 stainless-steel bottle. Keeps drinks cold 24 h, hot 12 h. Leak-proof sport cap. BPA-free. Wide mouth for ice cubes and easy cleaning.',
 'Inox 1 L, cold 24 h, hot 12 h',
 32.95, NULL, 90, 7, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600', 0.35, FALSE, 4.3, 6),

('MiniPure Water Filter',          'minipure-water-filter',
 'Pocket water filter using hollow-fiber membrane. Removes 99.9999 % bacteria and 99.9 % protozoa. Flow rate 1 L/min. Lifetime: 4 000 L. Weighs only 60 g.',
 'Hollow-fiber filter, 4 000 L life',
 44.95, 54.00, 42, 7, 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600', 0.06, TRUE, 4.7, 10),

('Hydration Bladder 3 L',          'hydration-bladder-3l',
 'Wide-opening 3 L hydration bladder with magnetic bite valve and quick-disconnect hose. BPA-free TPU. Fits most backpack sleeves. Easy to fill and clean.',
 '3 L bladder, magnetic valve, BPA-free',
 29.95, NULL, 50, 7, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600', 0.18, FALSE, 4.2, 4),

-- ── Winter Sports (2) ──
('Alpine Ski Goggles',             'alpine-ski-goggles',
 'Dual-lens ski goggles with anti-fog coating, 100 % UV protection, and OTG (over-the-glasses) fit. Spherical lens for wide field of view. Helmet compatible.',
 'Dual lens, anti-fog, OTG, UV 100 %',
 89.00, 109.00, 40, 8, 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600', 0.19, FALSE, 4.5, 5),

('Insulated Mountain Gloves',      'insulated-mountain-gloves',
 'PrimaLoft Gold insulated gloves with Gore-Tex insert. Leather palm for grip, touchscreen-compatible index finger. Warm to -20 °C. Wrist leash included.',
 'PrimaLoft/Gore-Tex gloves, -20 °C',
 79.00, NULL, 35, 8, 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600', 0.16, FALSE, 4.6, 4),

-- ── Travel & Packing (2) ──
('Packing Cube Set (3-piece)',     'packing-cube-set-3',
 'Set of 3 lightweight ripstop nylon packing cubes (small, medium, large). Mesh top panel for visibility, dual-zip opening. Total weight 120 g.',
 '3-piece ripstop cubes, 120 g total',
 24.95, NULL, 100, 9, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 0.12, FALSE, 4.3, 3),

('Microfiber Travel Towel',        'microfiber-travel-towel',
 'Quick-dry microfiber towel, 130×60 cm. Absorbs 5× its weight in water. Antibacterial treatment. Packs into snap-loop pouch. 120 g.',
 'Quick-dry towel 130×60, 120 g',
 19.95, NULL, 90, 9, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 0.12, FALSE, 4.1, 2);

-- ===================== USERS (8) =====================
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('admin@outlander-gear.co',    crypt('Admin1234!', gen_salt('bf')), 'Admin',     'Outlander',  '+33600000000', 'admin'),
('marie.dupont@email.com',     crypt('Test1234!',  gen_salt('bf')), 'Marie',     'Dupont',     '+33612345678', 'customer'),
('jean.martin@email.com',      crypt('Test1234!',  gen_salt('bf')), 'Jean',      'Martin',     '+33623456789', 'customer'),
('sophie.bernard@email.com',   crypt('Test1234!',  gen_salt('bf')), 'Sophie',    'Bernard',    '+33634567890', 'customer'),
('lucas.moreau@email.com',     crypt('Test1234!',  gen_salt('bf')), 'Lucas',     'Moreau',     '+33645678901', 'customer'),
('emma.leroy@email.com',       crypt('Test1234!',  gen_salt('bf')), 'Emma',      'Leroy',      '+33656789012', 'customer'),
('thomas.petit@email.com',     crypt('Test1234!',  gen_salt('bf')), 'Thomas',    'Petit',      '+33667890123', 'customer'),
('camille.roux@email.com',     crypt('Test1234!',  gen_salt('bf')), 'Camille',   'Roux',       '+33678901234', 'customer')
ON CONFLICT (email) DO NOTHING;

-- ===================== REVIEWS (30) =====================
INSERT INTO reviews (product_id, user_id, rating, title, comment) VALUES
-- Alpine Pro Tent 2P (id=1)
(1, 2, 5, 'Best tent I have owned',        'Lightweight, quick setup, and held up in heavy rain all night. The two vestibules are a game changer.'),
(1, 3, 4, 'Great but tight for two',        'Perfect for solo use with gear inside. Two people is snug. Quality is excellent though.'),
(1, 5, 5, 'Solid 3-season tent',            'Used on GR20 in Corsica — wind, rain, everything. Not a drop inside.'),
-- Expedition Sleeping Bag (id=3)
(3, 2, 5, 'Incredibly warm',                'Tested at -10 °C and was perfectly comfortable. The draft tube does its job.'),
(3, 4, 5, 'Worth every euro',               'Down quality is outstanding. Packs smaller than expected.'),
-- Trekking Backpack 55L (id=7)
(7, 3, 5, 'Perfect for multi-day hikes',    'Carried 18 kg for a week in the Pyrenees. Hip belt distributes weight beautifully.'),
(7, 6, 4, 'A bit heavy empty',              'Lots of pockets and great organization but weighs 1.8 kg before you put anything in.'),
-- StormShield Jacket (id=11)
(11, 2, 5, 'Best jacket I have ever had',   'Six hours in pouring rain — completely dry underneath. Hood works great with a helmet.'),
(11, 4, 5, 'Breathable AND waterproof',     'Hiked uphill in the rain and was not clammy at all. Pit zips help too.'),
(11, 7, 4, 'Excellent, runs a bit large',   'Amazing waterproofing. I sized down and it fits perfectly now.'),
-- Trail Grip X (id=15)
(15, 3, 5, 'Incredible grip',               'Vibram Megagrip is no joke. Wet rocks, mud, scree — no slipping.'),
(15, 5, 4, 'Runs small!',                   'Definitely order half a size up as recommended. Otherwise a fantastic trail shoe.'),
(15, 8, 4, 'Great shoe, narrow fit',        'Love the grip and waterproofing. A little narrow for my wide feet but manageable.'),
-- ConfortPro Harness (id=22)
(22, 4, 5, 'Comfortable all day',           'Wore it for 8-hour multipitch sessions. Padding is generous, gear loops perfectly placed.'),
(22, 6, 4, 'Good value',                    'Solid harness at this price point. Easy to adjust, feels secure.'),
-- MiniPure Filter (id=26)
(26, 2, 5, 'Lifesaver on the trail',        'Used in Nepal and Morocco — never got sick. Flow rate is fast and it weighs nothing.'),
(26, 7, 5, 'Essential gear',                'Compact, reliable, and easy to backflush. Every hiker needs this.'),
-- Down Jacket 700 (id=12)
(12, 5, 5, 'Packs tiny, super warm',        'Stuffs into its own pocket smaller than a water bottle. Perfect camp layer.'),
(12, 8, 4, 'Good but not for heavy rain',   'Great insulation for the weight. Just add a shell if it is wet outside.'),
-- Carbon Trekking Poles (id=9)
(9, 3, 5, 'Light and sturdy',               'Carbon makes a huge difference on long days. Cork grips are comfortable even sweaty.'),
(9, 6, 4, 'FlickLock is reliable',          'Poles never collapsed on me, even on steep descents. Tungsten tips grip well on rock.'),
-- GasPro Stove (id=6)
(6, 4, 5, 'Tiny but powerful',              'Boils water in under 3 minutes. Piezo ignition has worked every time so far.'),
(6, 7, 4, 'Good for solo',                  'Great lightweight stove. Pot support is a bit small for my larger cookware.'),
-- Alpine Ski Goggles (id=29)
(29, 5, 4, 'No fog, great visibility',      'Dual lens anti-fog actually works. Wide lens gives excellent peripheral vision.'),
(29, 8, 5, 'Best goggles under 100 €',      'Fits over my glasses perfectly. Zero fogging even on hard runs.'),
-- Day Hike Pack 28L (id=8)
(8, 2, 4, 'Nice daypack',                   'Light, simple, ventilated. Just right for day hikes with lunch and extra layers.'),
-- Climbing Helmet AirFlow (id=24)
(24, 6, 5, 'Light and airy',                'You forget you are wearing it. Good ventilation in summer. Headlamp clips are handy.'),
-- Hydration Bladder 3L (id=27)
(27, 3, 4, 'Good budget bladder',           'Magnetic valve is a nice touch. Wide mouth makes it easy to fill and dry.'),
-- Convertible Trek Pants (id=13)
(13, 7, 4, 'Versatile pants',               'Use them as pants in the morning, shorts by noon. Zip-off is clean and quick.'),
-- Insulated Bottle 1L (id=25)
(25, 8, 4, 'Keeps tea hot all day',         'Still warm after 10 hours on the trail. A bit heavy but totally worth it.');

-- ===================== PRODUCT SPECIFICATIONS =====================
INSERT INTO product_specifications (product_id, spec_key, spec_value, spec_unit, spec_group) VALUES
-- 1: Alpine Pro Tent 2P
(1, 'capacity',          '2',        'persons',   'dimensions'),
(1, 'season_rating',     '3',        'season',    'performance'),
(1, 'fly_waterproof',    '3000',     'mm',        'performance'),
(1, 'floor_waterproof',  '5000',     'mm',        'performance'),
(1, 'packed_size',       '45×15',    'cm',        'dimensions'),
(1, 'pole_material',     'DAC Aluminum', '',       'materials'),
(1, 'fly_fabric',        '20D ripstop nylon', '',  'materials'),
(1, 'floor_fabric',      '40D ripstop nylon', '',  'materials'),
(1, 'vestibules',        '2',        '',           'dimensions'),
(1, 'doors',             '2',        '',           'dimensions'),
-- 2: Alpine Pro Tent 4P
(2, 'capacity',          '4',        'persons',   'dimensions'),
(2, 'season_rating',     '3',        'season',    'performance'),
(2, 'fly_waterproof',    '3000',     'mm',        'performance'),
(2, 'floor_waterproof',  '5000',     'mm',        'performance'),
(2, 'packed_size',       '55×20',    'cm',        'dimensions'),
(2, 'pole_material',     'DAC Aluminum', '',       'materials'),
(2, 'vestibules',        '2',        '',           'dimensions'),
(2, 'doors',             '2',        '',           'dimensions'),
-- 3: Expedition Sleeping Bag -15
(3, 'fill_type',         'RDS Goose Down', '',     'materials'),
(3, 'fill_power',        '800',      'cuin',      'performance'),
(3, 'comfort_temp',      '-5',       '°C',        'performance'),
(3, 'extreme_temp',      '-15',      '°C',        'performance'),
(3, 'shape',             'Mummy',    '',           'dimensions'),
(3, 'shell_fabric',      '15D Pertex Quantum', '', 'materials'),
(3, 'packed_size',       '22×40',    'cm',        'dimensions'),
-- 4: Summer Sleeping Bag 5°C
(4, 'fill_type',         'RDS Duck Down', '',      'materials'),
(4, 'fill_power',        '600',      'cuin',      'performance'),
(4, 'comfort_temp',      '10',       '°C',        'performance'),
(4, 'lower_limit_temp',  '5',        '°C',        'performance'),
(4, 'shape',             'Rectangular', '',        'dimensions'),
(4, 'packed_size',       '18×35',    'cm',        'dimensions'),
-- 5: UltraLight Sleeping Pad
(5, 'r_value',           '4.2',      '',           'performance'),
(5, 'thickness',         '8',        'cm',         'dimensions'),
(5, 'packed_size',       '23×10',    'cm',         'dimensions'),
(5, 'inflation',         'Self-inflating', '',      'performance'),
(5, 'fabric',            '30D ripstop nylon', '',   'materials'),
-- 6: GasPro Stove
(6, 'output',            '2800',     'W',          'performance'),
(6, 'boil_time_1l',      '3',        'min',        'performance'),
(6, 'fuel_type',         'Isobutane/propane canister', '', 'performance'),
(6, 'ignition',          'Piezo',    '',            'performance'),
(6, 'pot_support_max',   '3',        'L',           'dimensions'),
-- 7: Trekking Backpack 55L
(7, 'volume',            '55',       'L',           'dimensions'),
(7, 'frame',             'Internal aluminum', '',    'materials'),
(7, 'rain_cover',        'Integrated', '',           'features'),
(7, 'hydration_sleeve',  'Yes',      '',             'features'),
(7, 'torso_range',       '42–52',    'cm',           'dimensions'),
-- 8: Day Hike Pack 28L
(8, 'volume',            '28',       'L',           'dimensions'),
(8, 'back_panel',        'Ventilated mesh', '',      'features'),
(8, 'pole_attachment',   'Yes',      '',             'features'),
-- 9: Carbon Trekking Poles
(9, 'material',          'Carbon fiber', '',         'materials'),
(9, 'grip',              'Cork',     '',             'materials'),
(9, 'tip',               'Tungsten carbide', '',     'materials'),
(9, 'length_range',      '65–135',   'cm',           'dimensions'),
(9, 'lock_system',       'FlickLock', '',             'features'),
-- 10: Trail Running Vest 12L
(10, 'volume',           '12',       'L',            'dimensions'),
(10, 'bladder_included', '1.5',      'L',            'features'),
(10, 'back_panel',       'Breathable mesh', '',       'features'),
-- 11: StormShield Jacket
(11, 'layers',           '3',        '',             'materials'),
(11, 'waterproof_rating','20000',    'mm',           'performance'),
(11, 'breathability',    '20000',    'g/m²/24h',    'performance'),
(11, 'seam_type',        'Fully taped', '',           'features'),
(11, 'hood',             'Helmet-compatible', '',     'features'),
(11, 'pit_zips',         'Yes',      '',              'features'),
(11, 'outer_fabric',     '40D Gore-Tex 3L', '',       'materials'),
-- 12: Down Jacket 700
(12, 'fill_type',        'RDS Duck Down', '',         'materials'),
(12, 'fill_power',       '700',      'cuin',         'performance'),
(12, 'outer_fabric',     '20D ripstop nylon', '',     'materials'),
(12, 'packable',         'Yes — own pocket', '',      'features'),
-- 13: Convertible Trek Pants
(13, 'fabric',           'Stretch nylon', '',          'materials'),
(13, 'upf_rating',       '50+',      '',               'performance'),
(13, 'water_repellent',  'DWR treated', '',            'performance'),
(13, 'pockets',          '4 zippered', '',              'features'),
(13, 'convertible',      'Zip-off shorts', '',          'features'),
-- 14: Merino Base Layer Top
(14, 'fabric',           '100 % Merino wool', '',      'materials'),
(14, 'fabric_weight',    '185',      'g/m²',          'materials'),
(14, 'odor_resistant',   'Natural',  '',               'performance'),
(14, 'seams',            'Flatlock', '',                'features'),
-- 15: Trail Grip X
(15, 'outsole',          'Vibram Megagrip', '',        'materials'),
(15, 'waterproof',       'Yes — membrane', '',         'performance'),
(15, 'drop',             '8',        'mm',             'dimensions'),
(15, 'stack_height',     '22',       'mm',             'dimensions'),
(15, 'toe_protection',   'Reinforced rubber', '',      'features'),
(15, 'sizing_note',      'Runs small — order 0.5 up', '', 'features'),
-- 16: Alpinist Boots
(16, 'outsole',          'Vibram Mulaz', '',            'materials'),
(16, 'lining',           'Gore-Tex Insulated Comfort', '', 'materials'),
(16, 'insulation',       'Thinsulate 400 g', '',        'materials'),
(16, 'crampon_rating',   'C3 — automatic', '',          'performance'),
(16, 'upper',            'Full-grain leather + synthetic', '', 'materials'),
-- 17: Mid Hiking Boots
(17, 'outsole',          'Vibram',   '',                'materials'),
(17, 'waterproof',       'Yes — membrane', '',          'performance'),
(17, 'upper',            'Nubuck/mesh', '',             'materials'),
(17, 'ankle_support',    'Mid-cut padded collar', '',   'features'),
(17, 'midsole',          'EVA',      '',                'materials'),
-- 18: Recovery Camp Sandals
(18, 'sole',             'EVA',      '',                'materials'),
(18, 'quick_dry',        'Yes',      '',                'features'),
(18, 'footbed',          'Contoured', '',               'features'),
-- 19: Headlamp 600 Lumens
(19, 'max_lumens',       '600',      'lm',             'performance'),
(19, 'battery',          'Rechargeable USB-C', '',      'features'),
(19, 'runtime_eco',      '40',       'h',              'performance'),
(19, 'modes',            '4',        '',                'features'),
(19, 'water_resistance', 'IPX6',     '',                'performance'),
(19, 'sensor',           'Motion on/off', '',           'features'),
-- 20: Multi-Tool Knife
(20, 'blade_length',     '8',        'cm',             'dimensions'),
(20, 'blade_material',   'Stainless steel', '',         'materials'),
(20, 'tools',            '6',        '',                'features'),
(20, 'lock',             'Liner lock', '',              'features'),
(20, 'handle',           'Wood/stainless steel', '',    'materials'),
-- 21: Sighting Compass Pro
(21, 'type',             'Mirror sighting', '',         'features'),
(21, 'scales',           '1:25 000, 1:50 000', '',     'features'),
(21, 'declination',      'Adjustable', '',              'features'),
(21, 'needle',           'Oil-damped', '',              'features'),
(21, 'bezel',            'Luminous', '',                'features'),
-- 22: ConfortPro Harness
(22, 'gear_loops',       '4',        '',                'features'),
(22, 'leg_loops',        'Adjustable', '',              'features'),
(22, 'certification',    'CE EN 12277', '',             'performance'),
(22, 'use_type',         'Sport / Trad / Multipitch', '', 'features'),
-- 23: Dynamic Rope 70m
(23, 'diameter',         '9.5',      'mm',             'dimensions'),
(23, 'length',           '70',       'm',              'dimensions'),
(23, 'uiaa_falls',       '8',        '',               'performance'),
(23, 'impact_force',     '8.2',      'kN',             'performance'),
(23, 'treatment',        'Dry-treated sheath', '',      'performance'),
(23, 'type',             'Dynamic single', '',          'features'),
-- 24: Climbing Helmet AirFlow
(24, 'construction',     'Hybrid shell', '',            'materials'),
(24, 'certification',    'CE EN 12492', '',             'performance'),
(24, 'vents',            '12',       '',                'features'),
(24, 'headband_range',   '52–62',    'cm',             'dimensions'),
(24, 'headlamp_clips',   'Yes',      '',                'features'),
-- 25: Insulated Bottle 1L
(25, 'material',         '18/8 stainless steel', '',    'materials'),
(25, 'insulation',       'Double-wall vacuum', '',      'performance'),
(25, 'cold_retention',   '24',       'h',              'performance'),
(25, 'hot_retention',    '12',       'h',              'performance'),
(25, 'bpa_free',         'Yes',      '',                'features'),
(25, 'mouth',            'Wide',     '',                'features'),
-- 26: MiniPure Filter
(26, 'filter_type',      'Hollow-fiber membrane', '',   'materials'),
(26, 'bacteria_removal', '99.9999',  '%',              'performance'),
(26, 'protozoa_removal', '99.9',     '%',              'performance'),
(26, 'flow_rate',        '1',        'L/min',          'performance'),
(26, 'lifetime',         '4000',     'L',              'performance'),
-- 27: Hydration Bladder 3L
(27, 'volume',           '3',        'L',              'dimensions'),
(27, 'material',         'BPA-free TPU', '',            'materials'),
(27, 'valve',            'Magnetic bite valve', '',     'features'),
(27, 'opening',          'Wide-mouth slide-top', '',    'features'),
-- 28: Alpine Ski Goggles
(28, 'lens',             'Dual spherical', '',          'features'),
(28, 'anti_fog',         'Yes',      '',                'performance'),
(28, 'uv_protection',    '100 %',    '',                'performance'),
(28, 'otg_fit',          'Yes',      '',                'features'),
(28, 'helmet_compatible','Yes',      '',                'features'),
-- 29: Insulated Mountain Gloves
(29, 'insulation',       'PrimaLoft Gold', '',          'materials'),
(29, 'membrane',         'Gore-Tex insert', '',         'materials'),
(29, 'palm',             'Leather',  '',                'materials'),
(29, 'touchscreen',      'Index finger', '',            'features'),
(29, 'temp_rating',      '-20',      '°C',             'performance'),
-- 30: Packing Cube Set
(30, 'pieces',           '3',        '',                'dimensions'),
(30, 'fabric',           'Ripstop nylon', '',           'materials'),
(30, 'sizes',            'S / M / L', '',               'dimensions'),
(30, 'mesh_panel',       'Yes',      '',                'features'),
-- 31: Microfiber Travel Towel
(31, 'size',             '130×60',   'cm',             'dimensions'),
(31, 'fabric',           'Microfiber', '',              'materials'),
(31, 'absorption',       '5× its weight', '',           'performance'),
(31, 'antibacterial',    'Yes',      '',                'features'),
(31, 'packed',           'Snap-loop pouch', '',         'features');

-- ===================== PRODUCT TAGS =====================
INSERT INTO product_tags (product_id, tag) VALUES
-- Camping
(1,'3-season'),(1,'ultralight'),(1,'best-seller'),(1,'backpacking'),
(2,'3-season'),(2,'family'),(2,'car-camping'),
(3,'winter'),(3,'premium'),(3,'expedition'),(3,'best-seller'),
(4,'summer'),(4,'budget'),(4,'ultralight'),
(5,'3-season'),(5,'ultralight'),(5,'backpacking'),
(6,'ultralight'),(6,'budget'),(6,'backpacking'),
-- Hiking
(7,'multi-day'),(7,'best-seller'),(7,'trekking'),
(8,'day-hike'),(8,'ultralight'),(8,'budget'),
(9,'ultralight'),(9,'premium'),(9,'trekking'),
(10,'trail-running'),(10,'ultralight'),
-- Clothing
(11,'waterproof'),(11,'best-seller'),(11,'premium'),(11,'3-season'),
(12,'insulation'),(12,'packable'),(12,'3-season'),
(13,'summer'),(13,'versatile'),(13,'budget'),
(14,'base-layer'),(14,'merino'),(14,'all-season'),
-- Footwear
(15,'trail-running'),(15,'waterproof'),(15,'best-seller'),
(16,'mountaineering'),(16,'winter'),(16,'premium'),(16,'crampon-compatible'),
(17,'hiking'),(17,'waterproof'),(17,'versatile'),
(18,'recovery'),(18,'camp'),(18,'budget'),
-- Accessories
(19,'essential'),(19,'rechargeable'),
(20,'essential'),(20,'multi-tool'),
(21,'navigation'),(21,'essential'),
-- Climbing
(22,'sport-climbing'),(22,'trad'),(22,'best-seller'),(22,'beginner-friendly'),
(23,'sport-climbing'),(23,'trad'),(23,'multipitch'),
(24,'safety'),(24,'beginner-friendly'),(24,'ultralight'),
-- Hydration
(25,'insulated'),(25,'eco-friendly'),
(26,'essential'),(26,'ultralight'),(26,'best-seller'),(26,'backpacking'),
(27,'hydration'),(27,'budget'),
-- Winter
(28,'winter'),(28,'skiing'),(28,'otg'),
(29,'winter'),(29,'mountaineering'),(29,'premium'),
-- Travel
(30,'travel'),(30,'organization'),(30,'budget'),
(31,'travel'),(31,'quick-dry'),(31,'ultralight');
