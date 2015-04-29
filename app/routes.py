# CS421 Project
# Hareesh Nagaraj, Thomas Gill, Joe Soultanis (The Legend)
# Routes file for web app
from flask import Flask, render_template, request, jsonify
import psycopg2


#THIS IS THE CONNECTION TO THE CS COMP DATABASE ASSUMING LOCAL PORT
#PORT VALUE NEEDS TO BE CHANGED FOR DEPLOYMENT
DEC2FLOAT = psycopg2.extensions.new_type(
    psycopg2.extensions.DECIMAL.values,
    'DEC2FLOAT',
    lambda value, curs: float(value) if value is not None else None)

psycopg2.extensions.register_type(DEC2FLOAT)
conn = psycopg2.connect(database="nagaraj_weather", user="nagaraj", password="nagaraj", host="localhost", port="63333")
cur = conn.cursor() #used to perform ops on db

app = Flask(__name__)      
 
@app.route('/')
def home():
  print("home page rendering")
  return render_template('index.html')

# This grabs the data necessary for the gold page, averages it monthly
# the template is routed with the appropriate locations, that are to be
# queried asynchronously inside the UI
@app.route('/gold')
def gold():
  print("corn page rendering")
  queryOne = "SELECT * FROM location WHERE commodityName = 'gold'"
  queryTwo = "SELECT * FROM commodity WHERE commodityName='gold'"
  cur = conn.cursor()
  cur.execute(queryOne)
  results = cur.fetchall()
  # zipCodes = results
  zipCodes = results[0]
  zipCodesList = []
  # for code in zipCodes:
  print(zipCodes)
  zipCodesList.append(zipCodes[1])
  cur.execute(queryTwo)
  county = zipCodes[2]
  state = zipCodes[3]
  locationString = county + ", " + state
  resultsTwo = cur.fetchall()
  unitMeasure = resultsTwo[0][2]
  dataSource = str(resultsTwo[0][3])
  print(dataSource)
  print(unitMeasure)
  return render_template('gold.html',unit = unitMeasure, zipList = zipCodesList, source = dataSource, location=locationString)

# This grabs the data necessary for the corn page, averages it monthly
# the template is routed with the appropriate locations, that are to be
# queried asynchronously inside the UI
@app.route('/corn')
def corn():
  print("corn page rendering")
  queryOne = "SELECT * FROM location WHERE commodityName = 'corn'"
  queryTwo = "SELECT * FROM commodity WHERE commodityName='corn'"
  cur = conn.cursor()
  cur.execute(queryOne)
  results = cur.fetchall()
  # zipCodes = results
  zipCodes = results[0]
  zipCodesList = []
  # for code in zipCodes:
  print(zipCodes)
  zipCodesList.append(zipCodes[1])
  cur.execute(queryTwo)
  county = zipCodes[2]
  state = zipCodes[3]
  locationString = county + ", " + state
  resultsTwo = cur.fetchall()
  unitMeasure = resultsTwo[0][2]
  dataSource = str(resultsTwo[0][3])
  print(dataSource)
  print(unitMeasure)
  return render_template('corn.html',unit = unitMeasure, zipList = zipCodesList, source = dataSource, location=locationString)


# This grabs the data necessary for the coffee page, averages it monthly
# the template is routed with the appropriate locations, that are to be
# queried asynchronously inside the UI
@app.route('/coffee')
def coffee():
  print("coffee page rendering")
  queryOne = "SELECT * FROM location WHERE commodityName = 'coffee'"
  queryTwo = "SELECT * FROM commodity WHERE commodityName='coffee'"
  cur = conn.cursor()
  cur.execute(queryOne)
  results = cur.fetchall()
  # zipCodes = results
  zipCodes = results[0]
  zipCodesList = []
  # for code in zipCodes:
  print(zipCodes)
  zipCodesList.append(zipCodes[1])
  cur.execute(queryTwo)
  county = zipCodes[2]
  state = zipCodes[3]
  locationString = county + ", " + state
  resultsTwo = cur.fetchall()
  unitMeasure = resultsTwo[0][2]
  dataSource = str(resultsTwo[0][3])
  print(dataSource)
  print(unitMeasure)
  return render_template('coffee.html',unit = unitMeasure, zipList = zipCodesList, source = dataSource, location=locationString)

# This grabs the data necessary for the wheat page, averages it monthly
# the template is routed with the appropriate locations, that are to be
# queried asynchronously inside the UI
@app.route('/wheat')
def wheat():
  print("wheat page rendering")
  queryOne = "SELECT * FROM location WHERE commodityName = 'wheat'"
  queryTwo = "SELECT * FROM commodity WHERE commodityName='wheat'"
  cur = conn.cursor()
  cur.execute(queryOne)
  results = cur.fetchall()
  # zipCodes = results
  zipCodes = results[0]
  zipCodesList = []
  # for code in zipCodes:
  print(zipCodes)
  zipCodesList.append(zipCodes[1])
  cur.execute(queryTwo)
  county = zipCodes[2]
  state = zipCodes[3]
  locationString = county + ", " + state
  resultsTwo = cur.fetchall()
  unitMeasure = resultsTwo[0][2]
  dataSource = str(resultsTwo[0][3])
  print(dataSource)
  print(unitMeasure)
  return render_template('wheat.html',unit = unitMeasure, zipList = zipCodesList, source = dataSource, location=locationString)

# This grabs the data necessary for the naturalgas page, averages it monthly
# the template is routed with the appropriate locations, that are to be
# queried asynchronously inside the UI
@app.route('/naturalgas')
def naturalgas():
  print("naturalgas page rendering")
  queryOne = "SELECT * FROM location WHERE commodityName = 'natural gas'"
  queryTwo = "SELECT * FROM commodity WHERE commodityName='natural gas'"
  cur = conn.cursor()
  cur.execute(queryOne)
  results = cur.fetchall()
  # zipCodes = results
  zipCodes = results[0]
  zipCodesList = []
  # for code in zipCodes:
  print(zipCodes)
  zipCodesList.append(zipCodes[1])
  cur.execute(queryTwo)
  county = zipCodes[2]
  state = zipCodes[3]
  locationString = county + ", " + state
  resultsTwo = cur.fetchall()
  unitMeasure = resultsTwo[0][2]
  dataSource = str(resultsTwo[0][3])
  print(dataSource)
  print(unitMeasure)
  return render_template('natural_gas.html',unit = unitMeasure, zipList = zipCodesList, source = dataSource, location=locationString)


#Sends the weather data and commodity price back to commodity.js
#format for each zip code : mean_temp, mean_precipitation, mean_humidity, month, year (aggregated by month)
#format for commodity price : mean_price, month, year (aggregated by month)
#NOTE - the data does not cut off between months, that needs to be done in in the javascript
@app.route('/pagedata',methods=['POST'])
def weatherdata():
	print("weather request -- ")
	# print(request.form)
	zipCodes = request.form.getlist('zipCodes[]')
	commodity = request.form.get('commodity')
	from_month = request.form.get('from_month')
	from_year = request.form.get('from_year')
	to_month = request.form.get('to_month')
	to_year = request.form.get('to_year')
	data = {}
	data['weather'] = {}
	for code in zipCodes:
		cur.execute("""SELECT AVG(a.mean_temp),AVG(a.precipitation), AVG(a.humidity), a.month,a.year \
			FROM weather a\
			 WHERE ((a.zip = %s AND a.year <= %s AND a.year >= %s)) GROUP BY a.month,a.year ORDER BY a.year, a.month\
		""", (code, to_year,from_year))
		data['weather'][code] = cur.fetchall()
	print(data['weather'])
	
	cur.execute("""SELECT AVG(price), month, year FROM commodity_price\
			 WHERE ((commodityname = %s AND year <= %s AND year >= %s)) GROUP BY month,year ORDER BY year, month
		""", ("gold",to_year,from_year))
	data['commodityPrice'] = cur.fetchall()
	# print(data)
	return jsonify(packet=data)

if __name__ == '__main__':
  app.run(debug=True)