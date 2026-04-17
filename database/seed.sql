-- ============================================
-- Outlander Gear Co. — Seed Data
-- ============================================

-- Clean slate (cascade deletes dependent rows)
TRUNCATE TABLE reviews, order_items, orders, cart_items, wishlists, addresses, products, categories RESTART IDENTITY CASCADE;

-- ===================== CATEGORIES =====================
INSERT INTO categories (name, slug, description, image_url) VALUES
('Camping',      'camping',      'Tentes, sacs de couchage et tout le nécessaire pour camper.',    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600'),
('Randonnée',    'randonnee',    'Sacs à dos, bâtons et accessoires de randonnée.',                'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600'),
('Vêtements',    'vetements',    'Vestes, pantalons techniques et couches de base.',               'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'),
('Chaussures',   'chaussures',   'Chaussures de trail, randonnée et approche.',                    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600'),
('Accessoires',  'accessoires',  'Lampes, gourdes, couteaux et petits équipements.',               'https://images.unsplash.com/photo-1550985543-49bee3167284?w=600'),
('Escalade',     'escalade',     'Harnais, mousquetons, cordes et équipement d''escalade.',        'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600'),
('Hydratation',  'hydratation',  'Gourdes, filtres à eau et systèmes d''hydratation.',             'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600');

-- ===================== PRODUCTS =====================
INSERT INTO products (name, slug, description, short_desc, price, compare_price, stock_quantity, category_id, image_url, weight_kg, is_featured) VALUES
-- Camping
(
    'Tente Alpine Pro 3 Saisons',
    'tente-alpine-pro-3-saisons',
    'Tente légère pour 2 personnes, double paroi, imperméable 3000mm. Idéale pour le trekking en montagne du printemps à l''automne. Arceaux en aluminium DAC, sol renforcé 5000mm.',
    'Tente 2P légère, imperméable 3000mm',
    349.99, 429.99, 25, 1,
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600',
    2.10, TRUE
),
(
    'Sac de Couchage Expédition -15°C',
    'sac-couchage-expedition-15',
    'Sac de couchage momie garni de duvet d''oie 800 cuin. Température confort -5°C, extrême -15°C. Poids : 1.2 kg. Zip anti-accroche avec rabat isolant.',
    'Duvet d''oie 800 cuin, confort -5°C',
    299.50, NULL, 18, 1,
    'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=600',
    1.20, TRUE
),
(
    'Matelas Gonflable UltraLight',
    'matelas-gonflable-ultralight',
    'Matelas auto-gonflant R-value 4.2. Épaisseur 8 cm, poids plume 450g. Valve à gonflage rapide. Parfait pour les nuits confortables en bivouac.',
    'Matelas auto-gonflant R4.2, 450g',
    129.00, 159.00, 35, 1,
    'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600',
    0.45, FALSE
),
(
    'Réchaud Compact GasPro',
    'rechaud-compact-gaspro',
    'Réchaud à gaz ultraléger (95g) avec allumage piézo intégré. Puissance 2800W, porte jusqu''à 3L. Compatible cartouches à vis standard.',
    'Réchaud gaz 95g, allumage piézo',
    59.95, NULL, 50, 1,
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
    0.095, FALSE
),

-- Randonnée
(
    'Sac à Dos Randonnée 55L',
    'sac-a-dos-randonnee-55l',
    'Sac à dos ergonomique 55 litres avec armature interne en aluminium, ceinture ventrale rembourrée et housse de pluie intégrée. Accès frontal zip en U.',
    'Sac 55L, armature alu, housse pluie',
    189.95, 229.00, 40, 2,
    'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600',
    1.80, TRUE
),
(
    'Bâtons de Marche Carbone Ultra',
    'batons-marche-carbone-ultra',
    'Paire de bâtons télescopiques en carbone, poignées liège, pointes tungstène. Poids : 380g la paire. Longueur ajustable 65-135 cm. Système de serrage FlickLock.',
    'Bâtons carbone 380g, poignées liège',
    89.95, NULL, 60, 2,
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600',
    0.38, FALSE
),
(
    'Sac à Dos Trail Running 12L',
    'sac-trail-running-12l',
    'Sac vest 12L conçu pour le trail et l''ultra. Poche à eau 1.5L incluse, poches poitrine élastiques pour flasques, filet dorsal ventilé.',
    'Vest trail 12L avec poche à eau',
    119.00, NULL, 45, 2,
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    0.32, FALSE
),

-- Vêtements
(
    'Veste Imperméable StormShield',
    'veste-impermeable-stormshield',
    'Veste hardshell 3 couches avec coutures étanchées, capuche ajustable et ventilation sous les bras. Respirante (20 000 g/m²/24h) et coupe-vent.',
    'Hardshell 3 couches, respirante',
    259.00, 319.00, 30, 3,
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600',
    0.42, TRUE
),
(
    'Doudoune Duvet 700 Cuin',
    'doudoune-duvet-700-cuin',
    'Doudoune légère garnie de duvet 700 cuin RDS. Compressible dans sa propre poche. Idéale comme mid-layer ou seule en soirée fraîche au camp.',
    'Doudoune compressible duvet 700',
    179.00, NULL, 22, 3,
    'https://images.unsplash.com/photo-1614079290101-0c2181ac8ea3?w=600',
    0.35, FALSE
),
(
    'Pantalon Convertible Trek',
    'pantalon-convertible-trek',
    'Pantalon de randonnée convertible en short via zips. Tissu stretch déperlant avec protection UV 50+. 4 poches zippées.',
    'Convertible short, stretch UV50+',
    89.00, 109.00, 38, 3,
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600',
    0.34, FALSE
),

-- Chaussures
(
    'Chaussures Trail Grip X',
    'chaussures-trail-grip-x',
    'Chaussures de trail running avec semelle Vibram® Megagrip, membrane imperméable et renfort orteil. Accroche optimale sur terrain technique. Drop 8mm.',
    'Trail Vibram® Megagrip, imperméable',
    159.99, NULL, 55, 4,
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600',
    0.68, TRUE
),
(
    'Bottes Haute Montagne Alpinist',
    'bottes-haute-montagne-alpinist',
    'Bottes rigides pour alpinisme et haute montagne. Compatibles crampons automatiques. Isolation Thinsulate 400g, membrane Gore-Tex Insulated.',
    'Bottes alpinisme, crampons auto',
    389.00, 449.00, 12, 4,
    'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=600',
    1.90, FALSE
),
(
    'Sandales de Récupération Camp',
    'sandales-recuperation-camp',
    'Sandales légères pour la récupération après une longue journée de marche. Semelle EVA amortissante, séchage rapide.',
    'Sandales EVA récupération rapide',
    39.95, NULL, 80, 4,
    'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600',
    0.22, FALSE
),

-- Accessoires
(
    'Lampe Frontale 600 Lumens',
    'lampe-frontale-600-lumens',
    'Lampe frontale rechargeable USB-C avec 4 modes d''éclairage, capteur de mouvement et autonomie jusqu''à 40h en mode éco. Résistance IPX6.',
    'Frontale USB-C 600lm, IPX6',
    49.99, NULL, 75, 5,
    'https://images.unsplash.com/photo-1550985543-49bee3167284?w=600',
    0.075, FALSE
),
(
    'Couteau Pliant Multi-Fonctions',
    'couteau-pliant-multi-fonctions',
    'Couteau pliant avec lame inox 8 cm, ouvre-boîte, tournevis, décapsuleur et scie. Manche bois/inox. Verrouillage liner lock.',
    'Couteau pliant 6 fonctions, inox',
    34.99, NULL, 65, 5,
    'https://images.unsplash.com/photo-1582843117210-42646734ab9e?w=600',
    0.12, FALSE
),
(
    'Boussole de Visée Pro',
    'boussole-visee-pro',
    'Boussole à visée avec miroir de relèvement, déclinaison ajustable, échelle 1:25000 et 1:50000. Flotteur à bain d''huile.',
    'Boussole miroir, échelles topo',
    29.95, NULL, 40, 5,
    'https://images.unsplash.com/photo-1505778276668-26b3ff7af103?w=600',
    0.06, FALSE
),

-- Escalade
(
    'Harnais Escalade ConfortPro',
    'harnais-escalade-confortpro',
    'Harnais d''escalade 4 boucles de matériel, tours de cuisse réglables, ceinture rembourrée large. Certifié CE EN 12277.',
    'Harnais 4 portes-matériel, CE',
    79.95, 99.00, 28, 6,
    'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600',
    0.38, TRUE
),
(
    'Corde Dynamique 70m 9.5mm',
    'corde-dynamique-70m-9-5mm',
    'Corde d''escalade dynamique 70 mètres, diamètre 9.5mm. Traitement dry pour usage en conditions humides. Nombre de chutes UIAA : 8.',
    'Corde dynamique 70m, dry treatment',
    189.00, NULL, 15, 6,
    'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600',
    4.20, FALSE
),

-- Hydratation
(
    'Gourde Isotherme 1L Inox',
    'gourde-isotherme-1l-inox',
    'Gourde double paroi acier inoxydable 18/8. Garde froid 24h, chaud 12h. Bouchon sport anti-fuite. Sans BPA.',
    'Gourde inox 1L, froid 24h',
    32.95, NULL, 90, 7,
    'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600',
    0.35, FALSE
),
(
    'Filtre à Eau Portable MiniPure',
    'filtre-eau-portable-minipure',
    'Filtre à eau de poche éliminant 99.9999% des bactéries et 99.9% des protozoaires. Débit 1L/min. Durée de vie : 4000 litres.',
    'Filtre poche, 4000L de durée de vie',
    44.95, 54.00, 42, 7,
    'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600',
    0.06, TRUE
);

-- ===================== DEMO USER =====================
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('admin@outlander-gear.co', crypt('Admin1234!', gen_salt('bf')), 'Admin', 'Outlander', '+33600000000', 'admin'),
('marie.dupont@email.com',  crypt('Test1234!',  gen_salt('bf')), 'Marie', 'Dupont',    '+33612345678', 'customer')
ON CONFLICT (email) DO NOTHING;

-- ===================== DEMO REVIEWS =====================
INSERT INTO reviews (product_id, user_id, rating, title, comment) VALUES
(1,  2, 5, 'Excellente tente !',         'Légère, facile à monter et elle a tenu sous une pluie battante. Parfaite pour mes randos.'),
(5,  2, 4, 'Bon sac, un peu lourd vide',  'L''organisation est top avec plein de poches. Un peu lourd quand même pour du fast hiking.'),
(8,  2, 5, 'Meilleure veste que j''ai eue', 'Portée sous la pluie pendant 6h, complètement sèche dessous. La capuche tient bien avec le casque.'),
(11, 2, 4, 'Bon grip, taille un peu petit', 'Semelle Vibram au top sur les pierriers. Commander une demi-taille au-dessus.'),
(17, 2, 5, 'Indispensable',                'Utilisé au Népal pour filtrer l''eau des rivières. Jamais eu de problème. Léger et fiable.');

-- Update rating averages
UPDATE products SET rating_avg = 5.0, rating_count = 1 WHERE id = 1;
UPDATE products SET rating_avg = 4.0, rating_count = 1 WHERE id = 5;
UPDATE products SET rating_avg = 5.0, rating_count = 1 WHERE id = 8;
UPDATE products SET rating_avg = 4.0, rating_count = 1 WHERE id = 11;
UPDATE products SET rating_avg = 5.0, rating_count = 1 WHERE id = 17;
