const path = require('node:path');
const mysql = require('mysql');
const fs = require('fs');
const readline = require('readline');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bike_db'
})

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ', err);
  } else {
    console.log('connection successful');
  }
});

connection.query('DROP TABLE IF EXISTS bike_data', (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log(res.message);
  }
})

connection.query('DROP TABLE IF EXISTS wx_data', (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log(res.message);
  }
})

connection.query('SET GLOBAL local_infile=true;')
connection.query('CREATE TABLE bike_data (\
  month INTEGER,\
  day INTEGER,\
  year INTEGER,\
  start_time VARCHAR(5),\
  duration_minutes INTEGER,\
  bikeid INTEGER,\
  start_station_id VARCHAR(16),\
  start_station_name VARCHAR(256),\
  end_station_id VARCHAR(16),\
  end_station_name VARCHAR(256),\
  INDEX(start_station_name),\
  INDEX(YEAR),\
  INDEX(MONTH),\
  INDEX(DAY)\
  );', (err, res) => {
    if (err) {
      console.log('error creating bike_data table:', err);
    } else {
      console.log('bike_data table created successfully.  ', res.message);
      connection.query(`LOAD DATA LOCAL INFILE '${trip_file}' INTO TABLE bike_data FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES;`, (err, res) => {
        if (err) {
          console.log('bike_data load unsuccessful: ', err);
        } else {
          console.log(res.message)
        }
      })
    }
});

connection.query('CREATE TABLE wx_data (\
  Date VARCHAR(16),\
  TempHigh_F INTEGER,\
  TempAvg_F INTEGER,\
  TempLow_F INTEGER,\
  HumidityHigh_Percent INTEGER,\
  HumidityAvg_Percent INTEGER,\
  HumidityLow_Percent INTEGER,\
  VisibilityHigh_Miles INTEGER,\
  VisibilityAvg_Miles INTEGER,\
  VisibilityLow_Miles INTEGER,\
  WindHigh_MPH INTEGER,\
  WindAvg_MPH INTEGER,\
  WindGust_MPH INTEGER,\
  Precipitation_Inches VARCHAR(16),\
  Events VARCHAR(256),\
  PRIMARY KEY(Date),\
  INDEX(DATE)\
  );', (err, res) => {
  if (err) {
    console.log('error creating wx_data table:', err);
  } else {
    console.log('wx_data table created successfully.  ', res.message);
    connection.query(`LOAD DATA LOCAL INFILE '${wx_file}' INTO TABLE wx_data FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES;`, (err, res) => {
      if (err) {
        console.log('wx_data load unsuccessful: ', err);
      } else {
        console.log(res.message);
        connection.end();
      }
    })
  }
});

let trip_file = path.join(__dirname, 'data', 'bike_trip_data.csv');
let wx_file = path.join(__dirname, 'data', 'weather_data.csv');

let trip_data = [];
let trip = {
  month: 0,
  day: 0,
  year: 0,
  start_time: "",
  duration_minutes: 0,
  bikeid: 0,
  start_station_id: 0,
  start_station_name: "",
  end_station_id: 0,
  end_station_name: ""
}
