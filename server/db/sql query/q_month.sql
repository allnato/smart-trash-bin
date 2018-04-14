/*** Initial Queries ***/

USE trash;

SELECT * FROM bin b;
SELECT * FROM employee e;
SELECT * FROM employee_activity ea;
SELECT * FROM location l;
SELECT * FROM sensor_data sa;

/*** Bar/Line Graph Queries ***/

-- average trash accumulated (in height) of the month 
-- --------------------------------------------------------------------------
  SELECT avg(waste_height) AS waste_height
    FROM sensor_data
   WHERE month(data_timestamp) = month(CURRENT_TIMESTAMP);

-- average trash accumulated (in height) per month 
-- --------------------------------------------------------------------------
  SELECT avg(waste_height) AS waste_height, 
         month(data_timestamp) AS month, 
	     monthname(data_timestamp) AS month_name, year(data_timestamp) AS year
    FROM sensor_data
   WHERE year(data_timestamp) = year(CURRENT_TIMESTAMP)
GROUP BY month
ORDER BY month;

-- bin that has the top 10 most trash (in height) of the month
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, dt.name AS bin_name, dt_waste_height AS waste_height
    FROM (
		   SELECT b.bin_id, b.name, max(sd.waste_height) AS dt_waste_height
             FROM bin b, sensor_data sd
            WHERE b.bin_id = sd.bin_id
              AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
              AND sd.waste_height != 0
         GROUP BY day(sd.data_timestamp)
         ) AS dt
ORDER BY waste_height DESC
   LIMIT 10;
   
-- bin that has the most trash (in height) per month
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, bin_name, dt_waste_height AS waste_height, 
         month, month_name, year
    FROM (
		   SELECT b.bin_id, b.name AS bin_name, max(sd.waste_height) AS dt_waste_height, 
                  month(sd.data_timestamp) AS month, monthname(sd.data_timestamp) 
				  AS month_name, year(sd.data_timestamp) AS year
             FROM bin b, sensor_data sd
			WHERE b.bin_id = sd.bin_id
	          AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
              AND sd.waste_height != 0
		 GROUP BY day(sd.data_timestamp)
	     ) AS dt
GROUP BY month
ORDER BY month;

-- bin that has the top 10 most humid of the month
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, dt.name AS bin_name, dt_humidity AS humidity
    FROM (
		   SELECT b.bin_id, b.name, max(sd.humidity) AS dt_humidity
             FROM bin b, sensor_data sd
            WHERE b.bin_id = sd.bin_id
              AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
              AND sd.humidity != 0
         GROUP BY day(sd.data_timestamp)
         ) AS dt
ORDER BY humidity DESC
   LIMIT 10;

-- trash that has the most humid per month
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, bin_name, dt_humidity AS humidity, month, month_name, year
    FROM (
		   SELECT b.bin_id, b.name AS bin_name, max(sd.humidity) AS dt_humidity, 
                  month(sd.data_timestamp) AS month, monthname(sd.data_timestamp) 
				  AS month_name, year(sd.data_timestamp) AS year
             FROM bin b, sensor_data sd
			WHERE b.bin_id = sd.bin_id
	          AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
              AND sd.humidity != 0
		 GROUP BY day(sd.data_timestamp)
	     ) AS dt
GROUP BY month
ORDER BY month;

-- peak week that reached trash threshold of the month
-- --------------------------------------------------------------------------
  SELECT week(sd.data_timestamp) AS week, max(sd.waste_height) AS waste_height
    FROM sensor_data sd, bin b
   WHERE month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
     AND sd.waste_height > (b.height * 0.75);

-- peak week that reached trash threshold per month
-- --------------------------------------------------------------------------
  SELECT week(sd.data_timestamp) AS week, max(sd.waste_height) AS waste_height,
         month(sd.data_timestamp) AS month, monthname(sd.data_timestamp) AS month_name
    FROM sensor_data sd, bin b
   WHERE year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
     AND sd.waste_height > (b.height * 0.75)
GROUP BY month
ORDER BY month;

-- top 10 employees that has the most cleaning performed on the month
-- --------------------------------------------------------------------------
  SELECT e.employee_id, e.first_name, e.last_name, 
         count(ea.activity_timestamp) AS times_cleaned
    FROM employee e, employee_activity ea
   WHERE month(ea.activity_timestamp) = month(CURRENT_TIMESTAMP)
	 AND e.employee_id = ea.employee_id
ORDER BY times_cleaned DESC
   LIMIT 10;
   
-- employee that has the most cleaning performed per month
-- --------------------------------------------------------------------------
  SELECT dt.employee_id, dt.first_name, dt.last_name, 
	     max(clean_count) AS times_cleaned, month
    FROM (
	       SELECT count(ea.activity_timestamp) AS clean_count, e.employee_id,
				  e.first_name AS first_name, e.last_name AS last_name,
                  month(ea.activity_timestamp) AS month
             FROM employee e, employee_activity ea
			WHERE year(ea.activity_timestamp) = year(CURRENT_TIMESTAMP)
              AND e.employee_id = ea.employee_id
		 GROUP BY month(ea.activity_timestamp)
         ) AS dt
GROUP BY month
ORDER BY month;
