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
  # print("gold page rendering")
  queryOne = "SELECT zip FROM location WHERE commodityName = 'gold'";
  cur = conn.cursor()
  cur.execute(queryOne)
  zipCodes = cur.fetchall()[0]
  zipCodesList = []
  for code in zipCodes:
    zipCodesList.append(code)
  # print(zipCodesList)
  return render_template('gold.html',zipList = zipCodesList)

#Sends the weather data and commodity price back to commodity.js
#format for each zip code : mean_temp, mean_precipitation, mean_humidity, month, year (aggregated by month)
#format for commodity price : mean_price, month, year (aggregated by month)
#NOTE - the data does not cut off between months, that needs to be done in in the javascript
@app.route('/pagedata',methods=['POST'])
def weatherdata():
	print("weather request -- ")
	print(request.form)
	zipCodes = request.form.getlist('zipCodes[]')
	commodity = request.form.get('commodity')
	from_month = request.form.get('from_month')
	from_year = request.form.get('from_year')
	to_month = request.form.get('to_month')
	to_year = request.form.get('to_year')
	print(commodity)
	print(from_month)
	print(from_year)
	print(to_month)
	print(to_year)
	data = {}
	data['weather'] = {}
	for code in zipCodes:
		cur.execute("""SELECT AVG(a.mean_temp),AVG(a.precipitation), AVG(a.humidity), a.month,a.year \
			FROM weather a\
			 WHERE ((a.zip = %s AND a.year <= %s AND a.year >= %s)) GROUP BY a.month,a.year ORDER BY a.year, a.month\
		""", (code, to_year,from_year))
		data['weather'][code] = cur.fetchall()
	# print(weatherDict)
	
	cur.execute("""SELECT AVG(price), month, year FROM commodity_price\
			 WHERE ((commodityname = %s AND year <= %s AND year >= %s)) GROUP BY month,year ORDER BY year, month
		""", ("gold",to_year,from_year))
	data['commodityPrice'] = cur.fetchall()
	print(data)
	return jsonify(packet=data)

if __name__ == '__main__':
  app.run(debug=True)