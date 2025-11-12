-- Users
INSERT INTO User (email, name) VALUES ('example1@email.com', 'Example1');
INSERT INTO User (email, name) VALUES ('example2@email.com', 'Example2');

-- Enums
INSERT INTO Site (name) VALUES ('Milano'), ('Roma'), ('Torino');
INSERT INTO VehicleType (name, description) VALUES ('Auto', 'Automobile'),
                                                   ('Scooter', 'Scooter'),
                                                   ('Bici', 'Bicicletta');

-- Vehicles
INSERT INTO Vehicle (name, vehicleTypeId, currentSiteId, dailyRate) VALUES ('Fiat Panda', 1, 1, 100);
INSERT INTO Vehicle (name, vehicleTypeId, currentSiteId, dailyRate) VALUES ('Honda Sh', 2, 2, 50);
INSERT INTO Vehicle (name, vehicleTypeId, currentSiteId, dailyRate) VALUES ('Atala', 3, 3, 10);
