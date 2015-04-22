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
    try:
      cur.execute("""SELECT AVG(mean_temp) FROM weather WHERE zip=%s GROUP BY year""", (code, ))
    except Exception:
      print(Exception)
      print("query error")
      pass
  return("hi")

if __name__ == '__main__':
  app.run(debug=True)