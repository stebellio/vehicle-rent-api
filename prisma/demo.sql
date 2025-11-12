-- Users
INSERT INTO User (email, name) VALUES ('example1@email.com', 'Example1');
INSERT INTO User (email, name) VALUES ('example2@email.com', 'Example2');

-- Enums
INSERT INTO Site (name) VALUES ('Milano'), ('Roma'), ('Torino');
INSERT INTO VehicleType (name, description) VALUES ('Auto', 'Automobile'),
                                                   ('Scooter', 'Scooter'),
                                                   ('Bici', 'Bicicletta');

-- Vehicles
INSERT INTO Vehicle (name, vehicleTypeId, currentSiteId) VALUES ('Fiat Panda', 1, 1);
INSERT INTO Vehicle (name, vehicleTypeId, currentSiteId) VALUES ('Honda Sh', 2, 2);
INSERT INTO Vehicle (name, vehicleTypeId, currentSiteId) VALUES ('Atala', 3, 3);
