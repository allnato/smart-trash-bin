/*** Initial Queries ***/

USE trash;

SELECT * FROM bin b;
SELECT * FROM employee e;
SELECT * FROM employee_activity ea;
SELECT * FROM location l;
SELECT * FROM sensor_data sa;

/*** Bar/Line Graph Queries ***/

-- average trash accumulated (in height) of the year 
-- --------------------------------------------------------------------------
  SELECT avg(waste_height) AS waste_height
    FROM sensor_data
   WHERE year(data_timestamp) = year(CURRENT_TIMESTAMP);

-- average trash accumulated (in height) per year 
-- --------------------------------------------------------------------------
  SELECT avg(waste_height) AS waste_height, 
         year(data_timestamp) AS year
    FROM sensor_data
GROUP BY year
ORDER BY year;

-- bin that has the top 10 most trash (in height) of the year
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, dt.name AS bin_name, dt_waste_height AS waste_height
    FROM (
		   SELECT b.bin_id, b.name, max(sd.waste_height) AS dt_waste_height
             FROM bin b, sensor_data sd
            WHERE b.bin_id = sd.bin_id
              AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
              AND sd.waste_height != 0
         GROUP BY dayofyear(sd.data_timestamp)
         ) AS dt
ORDER BY waste_height DESC
   LIMIT 10;
   
-- bin that has the most trash (in height) per year
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, bin_name, max(dt_waste_height) AS waste_height, year
    FROM (
		   SELECT b.bin_id, b.name AS bin_name, max(sd.waste_height) AS dt_waste_height, 
                  (year(sd.data_timestamp) * 1000) + dayofyear(sd.data_timestamp) AS year_day,
                  year(sd.data_timestamp) AS year
             FROM bin b, sensor_data sd
			WHERE b.bin_id = sd.bin_id
              AND sd.waste_height != 0
		 GROUP BY year_day
	     ) AS dt
GROUP BY year
ORDER BY year;

-- bin that has the top 10 most humid of the year
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, dt.name AS bin_name, dt_humidity AS humidity
    FROM (
		   SELECT b.bin_id, b.name, max(sd.humidity) AS dt_humidity
             FROM bin b, sensor_data sd
            WHERE b.bin_id = sd.bin_id
              AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
              AND sd.humidity != 0
         GROUP BY dayofyear(sd.data_timestamp)
         ) AS dt
ORDER BY humidity DESC
   LIMIT 10;

-- trash that has the most humid per year
-- --------------------------------------------------------------------------
  SELECT dt.bin_id, bin_name, max(dt_humidity) AS humidity, year
    FROM (
		   SELECT b.bin_id, b.name AS bin_name, max(sd.humidity) AS dt_humidity, 
                  (year(sd.data_timestamp) * 1000) + dayofyear(sd.data_timestamp) AS year_day,
                  year(sd.data_timestamp) AS year
             FROM bin b, sensor_data sd
			WHERE b.bin_id = sd.bin_id
              AND sd.humidity != 0
		 GROUP BY year_day
	     ) AS dt
GROUP BY year
ORDER BY year;

-- peak day that reached trash threshold of the year
-- --------------------------------------------------------------------------
  SELECT day, max(ctr_waste_height) AS peak_waste_count, day_name
    FROM (
           SELECT dayofyear(sd.data_timestamp) AS day, count(sd.waste_height) AS ctr_waste_height,
				  (year(sd.data_timestamp) * 1000) + dayofyear(sd.data_timestamp) AS year_day,
                  dayname(sd.data_timestamp) AS day_name
             FROM sensor_data sd, bin b
            WHERE year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
              AND sd.waste_height > (b.height * 0.75)
         GROUP BY year_day
		 ) AS dt;

-- peak day that reached trash threshold per year
-- --------------------------------------------------------------------------
  SELECT day, max(ctr_waste_height) AS peak_waste_count, year, day_name
    FROM (
           SELECT dayofyear(sd.data_timestamp) AS day, year(sd.data_timestamp) AS year,
                  count(sd.waste_height) AS ctr_waste_height,
                  dayname(sd.data_timestamp) AS day_name,
				  (year(sd.data_timestamp) * 1000) + dayofyear(sd.data_timestamp) AS year_day
             FROM sensor_data sd, bin b
            WHERE sd.waste_height > (b.height * 0.75)
         GROUP BY year_day
		 ) AS dt
GROUP BY year
ORDER BY year;

-- top 10 employees that has the most cleaning performed on the year
-- --------------------------------------------------------------------------
  SELECT e.employee_id, e.first_name, e.last_name, 
         count(ea.activity_timestamp) AS times_cleaned
    FROM employee e, employee_activity ea
   WHERE year(ea.activity_timestamp) = year(CURRENT_TIMESTAMP)
	 AND e.employee_id = ea.employee_id
GROUP BY ea.employee_id
ORDER BY times_cleaned DESC
   LIMIT 10;
   
-- employee that has the most cleaning performed per year
-- --------------------------------------------------------------------------
  SELECT dt.employee_id, dt.first_name, dt.last_name, 
	     max(clean_count) AS times_cleaned, year
    FROM (
	       SELECT count(ea.activity_timestamp) AS clean_count, e.employee_id,
				  e.first_name AS first_name, e.last_name AS last_name,
                  year(ea.activity_timestamp) AS year
             FROM employee e, employee_activity ea
			WHERE e.employee_id = ea.employee_id
		 GROUP BY ea.employee_id
         ) AS dt
GROUP BY year
ORDER BY year;
