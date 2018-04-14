/*** Initial Queries ***/

USE trash;

SELECT * FROM bin b;
SELECT * FROM employee e;
SELECT * FROM employee_activity ea;
SELECT * FROM location l;
SELECT * FROM sensor_data sa;

/*** Table Queries ***/

-- All bin information: name, height, location
-- -------------------------------------
  SELECT b.bin_id, b.name AS bin_name, 
         b.height AS bin_height, l.address, l.city, l.state
    FROM bin b, location l
   WHERE b.location_id = l.location_id;

-- All employee information: name and occupation
-- -------------------------------------
  SELECT employee_id, first_name, last_name
    FROM employee
ORDER BY employee.last_name;

-- All employee activity information: employee name, cleaned bin, timestamp
-- -------------------------------------
  SELECT e.employee_id, e.first_name, e.last_name, 
         b.name AS cleaned_bin, ea.activity_timestamp 
    FROM bin b, employee e, employee_activity ea
   WHERE b.bin_id = ea.bin_id 
     AND ea.employee_id = e.employee_id
ORDER BY ea.activity_timestamp;

-- All sensor data information: bin name, temperature, humidity, lid status, timestamp
-- -------------------------------------
  SELECT sd.data_id, b.name AS bin_name, 
         sd.waste_height, sd.temperature, 
         sd.humidity, sd.is_open AS lid_status, sd.data_timestamp
    FROM bin b, sensor_data sd
   WHERE b.bin_id = sd.bin_id
ORDER BY sd.data_timestamp;

-- get num of bins, employees
-- 
