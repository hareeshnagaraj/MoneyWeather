#This app is used to populate the weather portion of our database

#URL FORMAT
# urlp1 = "http://www.wunderground.com/history/airport/KEKO/2000/3/2/CustomHistory.html?dayend=2&monthend=3&yearend=2015&req_city=&req_state=&req_statename=&reqdb.zip=&reqdb.magic=&reqdb.wmo=&format=1"

import psycopg2
import urllib2
import csv

#NOTE: THESE NEED UPDATING BEFORE EACH NEW QUERY
airport = "KEKO"
ZIP = 89801

directory = "data/weather/"


urlp1 = "http://www.wunderground.com/history/airport/" 
urlp2 = "/3/2/CustomHistory.html?dayend=2&monthend=3&yearend=2015&req_city=&req_state=&req_statename=&reqdb.zip=&reqdb.magic=&reqdb.wmo=&format=1"


def getURL(a,b,c,d):
    return a + b + "/" + str(c) + d

def populateWeather():
    year = 2000
    while(year < 2015):
        url = getURL(urlp1,airport,year,urlp2)
        csv = urllib2.urlopen(url)
        output = open(directory + "nevada"+str(year)+".csv",'wb')
        output.write(csv.read())
        output.close()
        year += 1


#Weather CSV Notes
def updateDB():
    with open(directory + 'nevada2001.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        x = 0
        for row in spamreader:
            if x > 0:
                date = row[0]
                dateparams = date.split("-")
                print(dateparams)
                year = dateparams[0]
                month = dateparams[1]
                day = dateparams[2]
                meantemp = row[2]
                humidity = row[8]
                wind = row[17]
                precipitation = row[19]
                event = row[21]
                print day + "/" + month + "/" + year + "  meantemp:" + meantemp + "  humidity:" + humidity + " event:" + event
            x+=1


def main():
    print("Hi, it's time to grab some weather data!")
    print("Make sure you have the DB connected and configured")
    print("as well as the appropriate airport code - any mistakes will result in a cluttered database")
    # year = 2001
    # url = getURL(urlp1,airport,year,urlp2)
    # csv = urllib2.urlopen(url)
    # output = open(directory + "nevada"+str(year)+".csv",'wb')
    # output.write(csv.read())
    # output.close()
    updateDB()





main()