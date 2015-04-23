# CS421 Project
# Hareesh Nagaraj, Thomas Gill, Joe Soultanis
# Routes file for web app
from flask import Flask, render_template, request
import psycopg2


#THIS IS THE CONNECTION TO THE CS COMP DATABASE ASSUMING LOCAL PORT
#PORT VALUE NEEDS TO BE CHANGED FOR DEPLOYMENT
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
def tool():
  print("tool page rendering")
  queryOne = "SELECT zip FROM location WHERE commodityName = 'gold'";
  cur = conn.cursor()
  cur.execute(queryOne)
  zipCodes = cur.fetchall()[0]
  zipCodesList = []
  for code in zipCodes:
    zipCodesList.append(code)
  print(zipCodesList)
  return render_template('gold.html',zipList = zipCodesList)

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
	for code in zipCodes:
		print(code)
		# try:  #TODO - double check and make sure that this is an accurate query - it should be, but worth checking
		# NOTE : range must be determined INSIDE the APP 
		cur.execute("""SELECT AVG(a.mean_temp),AVG(a.precipitation), AVG(a.humidity), a.month,a.year \
			FROM weather a\
			 WHERE ((a.year <= %s AND a.year >= %s)) GROUP BY a.month,a.year ORDER BY a.year, a.month
		""", (to_year,from_year))

		x = 0
		for a in cur.fetchall():
			print(a)
		x += 1
		print("total rows : " + str(x))
		# except Exception:
		#   print(Exception)
		#   print("query error")
		#   pass
	return("hi")

if __name__ == '__main__':
  app.run(debug=True)