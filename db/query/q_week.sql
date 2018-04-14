/*** Initial Queries ***/

USE trash;

SELECT * FROM bin b;
SELECT * FROM employee e;
SELECT * FROM employee_activity ea;
SELECT * FROM location l;
SELECT * FROM sensor_data sa;

/*** Bar/Line Graph Queries ***/

-- total trash accumulated (in height) of the week/month/year
-- -------------------------------------
  SELECT sum(waste_height) AS waste_height
    FROM sensor_data
   WHERE week(data_timestamp, 2) = week(CURRENT_TIMESTAMP, 2)
     AND bin_id = 1;

-- total trash accumulated (in height) per week/month/year
-- -------------------------------------
  SELECT sum(waste_height) AS waste_height, 
		 week(data_timestamp, 2) AS week, 
	     monthname(data_timestamp) AS month, year(data_timestamp) AS year
    FROM sensor_data
   WHERE bin_id = 1
     AND month(data_timestamp) = month(CURRENT_TIMESTAMP)
GROUP BY week
ORDER BY week;

-- average trash accumulated (in height) of the week/month/year 
-- -------------------------------------
  SELECT avg(waste_height) AS waste_height
    FROM sensor_data
   WHERE week(data_timestamp, 2) = week(CURRENT_TIMESTAMP, 2);

-- average trash accumulated (in height) per week/month/year 
-- -------------------------------------
  SELECT avg(waste_height) AS waste_height, 
         week(data_timestamp, 2) AS week, 
	     monthname(data_timestamp) AS month, year(data_timestamp) AS year
    FROM sensor_data
   WHERE month(data_timestamp) = month(CURRENT_TIMESTAMP)
GROUP BY week
ORDER BY week;

-- bin that has the top 10 most trash (in height) of the week/month/year
-- -------------------------------------
  SELECT b.bin_id, b.name AS bin_name, sd.waste_height
    FROM bin b, sensor_data sd
   WHERE b.bin_id = sd.bin_id
     AND week(sd.data_timestamp, 2) = week(CURRENT_TIMESTAMP, 2)
ORDER BY sd.waste_height DESC
   LIMIT 10;
   
-- bin that has the most trash (in height) per week/month/year
-- -------------------------------------
  SELECT b.bin_id, b.name AS bin_name, max(sd.waste_height) AS waste_height, 
         week(sd.data_timestamp, 2) AS week, 
		 monthname(sd.data_timestamp) AS month, year(sd.data_timestamp) AS year
    FROM bin b, sensor_data sd
   WHERE b.bin_id = sd.bin_id
     AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
GROUP BY week
ORDER BY week;

-- bin that has the top 10 most odor of the week/month/year
-- -------------------------------------
  SELECT b.bin_id, b.name AS bin_name, sd.humidity
    FROM bin b, sensor_data sd
   WHERE b.bin_id = sd.bin_id
     AND week(sd.data_timestamp, 2) = week(CURRENT_TIMESTAMP, 2)
ORDER BY sd.humidity DESC
   LIMIT 10;

-- trash that has the most humid per week/month/year
-- -------------------------------------
  SELECT b.bin_id, b.name AS bin_name, max(sd.humidity) as humidity, 
         week(sd.data_timestamp, 2) AS week, 
		 monthname(sd.data_timestamp) AS month, year(sd.data_timestamp) AS year
    FROM bin b, sensor_data sd
   WHERE b.bin_id = sd.bin_id
     AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
GROUP BY week
ORDER BY week;

-- peak day that reached trash threshold of the week
-- -------------------------------------
  SELECT day(sd.data_timestamp) AS day, 
		 max(sd.waste_height) AS waste_height, dayname(sd.data_timestamp) AS weekday
    FROM sensor_data sd, bin b
   WHERE week(sd.data_timestamp, 2) = week(CURRENT_TIMESTAMP, 2)
     AND sd.waste_height > (b.height * 0.75);

-- peak day that reached trash threshold per week/month/hour
-- -------------------------------------
  SELECT day(sd.data_timestamp) AS day, max(sd.waste_height) AS waste_height,
         dayname(sd.data_timestamp) AS weekday, week(sd.data_timestamp, 2) AS week
    FROM sensor_data sd, bin b
   WHERE month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
     AND sd.waste_height > (b.height * 0.75)
GROUP BY week
ORDER BY week;

-- top 10 employees that has the most cleaning performed on the week/month/year
-- -------------------------------------
  SELECT e.employee_id, e.first_name, e.last_name, 
	     count(ea.activity_timestamp) AS times_cleaned
    FROM employee e, employee_activity ea
   WHERE week(ea.activity_timestamp) = week(CURRENT_TIMESTAMP)
	 AND e.employee_id = ea.employee_id
ORDER BY times_cleaned DESC
   LIMIT 10;
   
-- employee that has the most cleaning performed per week/month/year
-- -------------------------------------
  SELECT dt.employee_id, dt.first_name, dt.last_name, 
	     max(clean_count) AS times_cleaned, week
    FROM (
	       SELECT count(ea.activity_timestamp) AS clean_count, e.employee_id,
				  e.first_name AS first_name, e.last_name AS last_name,
                  week(ea.activity_timestamp, 2) AS week
             FROM employee e, employee_activity ea
			WHERE month(ea.activity_timestamp) = month(CURRENT_TIMESTAMP)
              AND e.employee_id = ea.employee_id
		 GROUP BY day(ea.activity_timestamp)
         ) AS dt
GROUP BY week
ORDER BY week;

-- top 10 employees that has the least cleaning performed in the current week/month/year
-- -------------------------------------
  SELECT e.employee_id, e.first_name, e.last_name, 
	     count(ea.activity_timestamp) AS times_cleaned
    FROM employee e, employee_activity ea
   WHERE week(ea.activity_timestamp) = week(CURRENT_TIMESTAMP)
	 AND e.employee_id = ea.employee_id
ORDER BY times_cleaned ASC
   LIMIT 10;
   
-- employees that has the least cleaning performed per week/month/year
-- -------------------------------------
  SELECT dt.employee_id, dt.first_name, dt.last_name, 
	     min(clean_count) AS times_cleaned, week
    FROM (
	       SELECT count(ea.activity_timestamp) AS clean_count, e.employee_id,
				  e.first_name AS first_name, e.last_name AS last_name,
                  week(ea.activity_timestamp, 2) AS week
             FROM employee e, employee_activity ea
			WHERE month(ea.activity_timestamp) = month(CURRENT_TIMESTAMP)
              AND e.employee_id = ea.employee_id
		 GROUP BY day(ea.activity_timestamp)
         ) AS dt
GROUP BY week
ORDER BY week;
