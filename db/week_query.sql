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
  SELECT employee_id, concat(first_name, ' ', last_name) 
         AS employee_name, occupation -- opt: SELECT first_name, last_name
    FROM employee
ORDER BY employee.last_name;

-- All employee activity information: employee name, cleaned bin, timestamp
-- -------------------------------------
  SELECT e.employee_id, concat(e.first_name, ' ', e.last_name) -- separate first and last name
         AS employee_name, b.name AS cleaned_bin, ea.activity_timestamp 
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

/*** Bar/Line Graph Queries ***/

-- total trash accumulated (in height) of the week/month/year
-- -------------------------------------
  SELECT sum(waste_height) AS waste_height
    FROM sensor_data
   WHERE week(data_timestamp) = week(CURRENT_TIMESTAMP); -- either input id from admin or each bin

-- total trash accumulated (in height) per week/month/year
-- -------------------------------------
  SELECT sum(waste_height) AS waste_height, 
		 week(data_timestamp, 2) AS week, 
	     monthname(data_timestamp) AS month, year(data_timestamp) AS year
    FROM sensor_data
GROUP BY week
ORDER BY week; -- change same as above

-- average trash accumulated (in height) of the week/month/year 
-- -------------------------------------
  SELECT avg(waste_height) AS waste_height
    FROM sensor_data
   WHERE week(data_timestamp) = week(CURRENT_TIMESTAMP);

-- average trash accumulated (in height) per week/month/year 
-- -------------------------------------
  SELECT avg(waste_height) AS waste_height, 
         week(data_timestamp, 2) AS week, 
	     monthname(data_timestamp) AS month, year(data_timestamp) AS year
    FROM sensor_data
GROUP BY week
ORDER BY week;

-- bin that has the top 10 most trash (in height) of the week/month/year
-- -------------------------------------
  SELECT b.bin_id, b.name AS bin_name, sd.waste_height
    FROM bin b, sensor_data sd
   WHERE b.bin_id = sd.bin_id
     AND week(sd.data_timestamp) = week(CURRENT_TIMESTAMP)
ORDER BY sd.waste_height DESC
   LIMIT 10;
   
-- bin that has the most trash (in height) per week/month/year -- not sure
-- -------------------------------------
  SELECT b.bin_id, b.name AS bin_name, max(sd.waste_height) AS waste_height, 
         week(sd.data_timestamp, 2) AS week, 
		 monthname(sd.data_timestamp) AS month, year(sd.data_timestamp) AS year
    FROM bin b, sensor_data sd
   WHERE b.bin_id = sd.bin_id
GROUP BY week
ORDER BY week;

-- bin that has the top 10 most odor of the week/month/year
-- -------------------------------------
  SELECT b.bin_id, b.name AS bin_name, sd.humidity
    FROM bin b, sensor_data sd
   WHERE b.bin_id = sd.bin_id
     AND week(sd.data_timestamp) = week(CURRENT_TIMESTAMP)
ORDER BY sd.humidity DESC
   LIMIT 10;

-- trash that has the most humid per week/month/year
-- -------------------------------------
  SELECT b.bin_id, b.name AS bin_name, max(sd.humidity) as humidity, 
         week(sd.data_timestamp, 2) AS week, 
		 monthname(sd.data_timestamp) AS month, year(sd.data_timestamp) AS year
    FROM bin b, sensor_data sd
   WHERE b.bin_id = sd.bin_id
GROUP BY week
ORDER BY week;

-- peak hour that reached trash threshold of the day
-- -------------------------------------
  SELECT hour(sd.data_timestamp) AS hour, 
         sd.waste_height, dayname(sd.data_timestamp) AS weekday
    FROM sensor_data sd, bin b
   WHERE dayofyear(sd.data_timestamp) = dayofyear(CURRENT_TIMESTAMP) 
     AND sd.waste_height > (b.height * 0.75)
ORDER BY hour(sd.data_timestamp) ASC
   LIMIT 1;

-- peak hour that reached trash threshold per day of the week/month/year -- peak day instead of peak hour
-- -------------------------------------
  SELECT hour(sd.data_timestamp) AS hour, 
         sd.waste_height, dayname(sd.data_timestamp) AS weekday,
         week(sd.data_timestamp, 2) AS week
    FROM sensor_data sd, bin b
   WHERE sd.waste_height > (b.height * 0.75) -- this might be a subquery to order first the hour(timestamp) ASC then from there order by asc week
	 AND hour(sd.data_timestamp) IN 
          (SELECT hour(sd.data_timestamp)
		     FROM sensor_data sd, bin b
		    WHERE sd.waste_height > (b.height * 0.75)
		 GROUP BY hour(sd.data_timestamp))
GROUP BY week
ORDER BY week;

-- -----------------------------------------------------------------------------------

SELECT hour(sd.data_timestamp)
		     FROM sensor_data sd, bin b
		    WHERE sd.waste_height > (b.height * 0.75)
		 GROUP BY hour(sd.data_timestamp);

SELECT hour(sd.data_timestamp) AS peak_hour, count(hour(sd.data_timestamp))) AS hour_count
FROM bin b, sensor_data sd
WHERE sd.waste_height > (b.height * 0.75)
GROUP BY dayofyear(sd.data_timestamp)
ORDER BY dayofyear(sd.data_timestamp) ASC;

-- -----------------------------------------------------------------------------------

  SELECT ddd.day, eee.rush_hour, ddd.numrow_count AS peak_count
    FROM (SELECT day, max(num_rows) as numrow_count 
            FROM (SELECT date(sd.data_timestamp) as day, 
                         hour(sd.data_timestamp) as rush_hour, 
                         count(1) as num_rows 
                    FROM sensor_data sd, bin b
                   WHERE sd.waste_height > (b.height * 0.75)
			    GROUP BY date(sd.data_timestamp), hour(sd.data_timestamp)) 
                      AS groupo 
			GROUP BY day) 
	  AS ddd

LEFT JOIN

  (SELECT date(sd.data_timestamp) as day, 
 	      hour(sd.data_timestamp) as rush_hour, 
          count(1) as num_rows 
     FROM sensor_data sd, bin b
    WHERE sd.waste_height > (b.height * 0.75)
 GROUP BY date(sd.data_timestamp), hour(sd.data_timestamp)) 
       AS eee
      
       ON ddd.day=eee.day and ddd.numrow_count=eee.num_rows;

-- top 10 employees that has the most cleaning performed on the week/month/year
-- -------------------------------------
  SELECT e.employee_id, concat(e.first_name, ' ', e.last_name) AS employee_name, 
	     count(ea.activity_timestamp) AS times_cleaned
    FROM employee e, employee_activity ea
   WHERE week(ea.activity_timestamp) = week(CURRENT_TIMESTAMP)
	 AND e.employee_id = ea.employee_id
ORDER BY times_cleaned DESC
   LIMIT 10;
   
-- employee that has the most cleaning performed per week/month/year
-- -------------------------------------
  SELECT e.employee_id, concat(e.first_name, ' ', e.last_name) AS employee_name, 
	     count(ea.activity_timestamp) AS times_cleaned, 
         week(ea.activity_timestamp, 2) AS week
    FROM employee e, employee_activity ea
   WHERE e.employee_id = ea.employee_id
GROUP BY week
ORDER BY times_cleaned DESC;

-- top 10 employees that has the least cleaning performed in the current week/month/year
-- -------------------------------------
  SELECT e.employee_id, concat(e.first_name, ' ', e.last_name) AS employee_name, 
	     count(ea.activity_timestamp) AS times_cleaned
    FROM employee e, employee_activity ea
   WHERE week(ea.activity_timestamp) = week(CURRENT_TIMESTAMP)
	 AND e.employee_id = ea.employee_id
ORDER BY times_cleaned ASC
   LIMIT 10;
   
-- employees that has the least cleaning performed per week/month/year
-- -------------------------------------
  SELECT e.employee_id, concat(e.first_name, ' ', e.last_name) AS employee_name, 
	     count(ea.activity_timestamp) AS times_cleaned, 
         week(ea.activity_timestamp, 2) AS week
    FROM employee e, employee_activity ea
   WHERE e.employee_id = ea.employee_id
GROUP BY week(ea.activity_timestamp, 2)
ORDER BY times_cleaned ASC;

-- correlation between it is actively used times, and times that it has reached peak times so that the janitors would know what is the
-- most optimized time to pick up the trash

-- questions:
-- is the per week only considers the current month? yes only the current month
-- change the is_open variable to counter from which it is used on an hour on a day -- to be put on sensor data?