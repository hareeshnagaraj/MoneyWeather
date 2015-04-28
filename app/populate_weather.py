#This script is used to populate the weather portion of our database

#URL FORMAT
# urlp1 = "http://www.wunderground.com/history/airport/KEKO/2000/3/2/CustomHistory.html?dayend=2&monthend=3&yearend=2015&req_city=&req_state=&req_statename=&reqdb.zip=&reqdb.magic=&reqdb.wmo=&format=1"

import psycopg2
import urllib2
import csv

#NOTE: THESE NEED UPDATING BEFORE EACH NEW QUERY
#UNCOMMENT APPROPRIATELY

#FOR NEVADA ---
# airport = "KEKO"
# ZIP = 89801
#--END NEVADA


#FOR IOWA ---
# airport = "KIOW"
# ZIP = 52246
#--END IOWA

#FOR ILLINOIS
# airport = "SPI"
# ZIP = 62707
#END ILLINOIS


#FOR Hawaii
#NOTE -- HAWAII CSVS ARE MESSED UP, MUST RE-RUN IF YOU WANT THEM BACK
# airport = "KOA"
# ZIP = 96740
#END Hawaii

#FOR TEXAS
# airport = "LBX"
# ZIP = 77515
#END TEXAS

#FOR kansas
airport = "FOE"
ZIP = 66409
#END kansas

tablename = "weather"

directory = "data/weather/"

urlp1 = "http://www.wunderground.com/history/airport/" 
urlp2 = "/3/2/CustomHistory.html?dayend=2&monthend=3&yearend=2015&req_city=&req_state=&req_statename=&reqdb.zip=&reqdb.magic=&reqdb.wmo=&format=1"

conn = psycopg2.connect(database="nagaraj_weather", user="nagaraj", password="nagaraj", host="localhost", port="63333")
cur = conn.cursor() #used to perform ops on db
conn.autocommit = True  #used to automatically commit updates to db

def getURL(a,b,c,d):
    return a + b + "/" + str(c) + d

#
#NOTE MAKE SURE TO CHANGE filename BEFORE MOVING
def populateWeatherCSV():
    year = 2000
    while(year < 2015):
        url = getURL(urlp1,airport,year,urlp2)
        csv = urllib2.urlopen(url)
        filename = "kansas"+str(year)+".csv"    #CHANGE THIS BEFORE EACH QUERY
        output = open(directory + filename,'wb')
        output.write(csv.read())
        output.close()
        updateDB(directory + filename)
        year += 1


#Weather CSV Notes
def updateDB(directoryAndfilename):
    prequery = "SELECT * FROM weather WHERE day = %s AND month = %s AND year = %s AND zip = %s"
    with open(directoryAndfilename, 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        x = 0
        for row in spamreader:
            if x > 1:
                date = row[0]
                dateparams = date.split("-")
                year = dateparams[0]
                month = dateparams[1]
                day = dateparams[2]
                meantemp = row[2]
                if meantemp == '':
                    meantemp = '-1'
                humidity = row[8]
                if humidity == '':
                    humidity = '-1'
                wind = row[17]
                if wind == '':
                    wind = '-1'
                precipitation = row[19]
                event = row[21]
                cur.execute(prequery, (day,month,year,ZIP)) 
                print(cur.rowcount) 
                if cur.rowcount == 0:
                    try:
                        cur.execute("""INSERT INTO weather \
                            (zip,day,month,year,mean_temp,precipitation,wind,humidity,event_type,event_severity) \
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""", \
                            (ZIP,day, month, year, meantemp, precipitation, wind, humidity, event, '0',))
                    except Exception:
                        pass
                x+=1
                # print day + "/" + month + "/" + year + "  meantemp:" + meantemp + "  humidity:" + humidity + " event:" + event
            x+=1


def main():
    print("Hi, it's time to grab some weather data!")
    print("Make sure you have the DB connected and configured")
    print("as well as the appropriate airport code - any mistakes will result in a cluttered database")
    populateWeatherCSV()

# Useful stuff: SQL select with params
# SQL = "SELECT * FROM weather WHERE day = %s AND month = %s AND year = %s"
# day = 23
# month = "July"
# year = 23
# data = ("O'Reilly", )
# cur.execute(SQL, (day,month,year))


# Functioning insert query:
# cur.execute("""INSERT INTO commodity (commodityname,unit_measure) VALUES (%s,%s)""",('42','34',))


main()