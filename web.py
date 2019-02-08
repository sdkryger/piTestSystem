from flask import Flask, session, redirect, url_for, render_template, request, jsonify
import random
import time
import json
from threading import Thread, Lock
import os
from multiprocessing import Queue

q = Queue()

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
count = 0

class Channel: #analog channel objects
    def __init__(self, name, color, address, rawLow=0.0, rawHigh=10.0, scaledLow=0.0, scaledHigh=10.0):
        self.name = name
        self.color = color
        self.address = address
        self.rawLow = rawLow
        self.rawHigh = rawHigh
        self.scaledLow = scaledLow
        self.scaledHigh = scaledHigh
    def serialize(self):
        return {
            'name':self.name,
            'color':self.color,
            'address':self.address,
            'rawLow':self.rawLow,
            'rawHigh':self.rawHigh,
            'scaledLow':self.scaledLow,
            'scaledHigh':self.scaledHigh
        }
        
class Instruction: #instruction object
    def __init__(self, header, body=''):
        self.header = header
        self.body = body
    def serialize(self):
        return {
            'header': self.header,
            'body': json.dumps(self.body)
        }

        
def scaleValue(rawValue, channel):
    m = (channel.scaledHigh - channel.scaledLow) / (channel.rawHigh - channel.rawLow)
    b = channel.scaledLow - m * channel.rawLow
    return m * rawValue + b

channels = [Channel('Inner temperature','#ff0000',1234),Channel('Outer temperature','#00ff00',1235)] #staring list of channels
latestValues = [] #list of the most recent values from the input cards
lock = Lock()
path = '/vagrant/www/data'


for ch in channels: #initialize the latestValues list
    latestValues.append(0.0)

@app.route("/")
def index():
    global count
    count = count +1
    if 'welcome' in session:
        return render_template('index.html')
    return redirect(url_for('splashScreen'))
    
@app.route('/settings')
def settings():
    return render_template('settings.html')
    
@app.route("/splashScreen")
def splashScreen():
    global count
    count = count +1
    session['welcome'] = 'true'
    return render_template('spinningLogo.html')
    #return "Welcome<br><a href='/'>Home</a>"
    
@app.route("/action/<action>", methods = ['GET','POST'])
def action(action):
    global channels, latestValues, q
    if(action == 'getLatestPoint'):
        return jsonify(error=False, values=latestValues)
    elif(action == 'getChannels'):
        return jsonify(channels = [ch.serialize() for ch in channels])
    elif(action == 'updateInputChannel'):
        index = int(request.form['index'])
        channels[index].name = request.form['name']
        channels[index].address = request.form['address']
        channels[index].color = request.form['color']
        channels[index].rawLow = float(request.form['rawLow'])
        channels[index].scaledLow = float(request.form['scaledLow'])
        channels[index].rawHigh = float(request.form['rawHigh'])
        channels[index].scaledHigh = float(request.form['scaledHigh'])
        return jsonify(error=False,channel=channels[index].serialize())
    elif(action == 'addInputChannel'):
        channel = Channel(request.form['name'],request.form['color'],request.form['address'],float(request.form['rawLow']),float(request.form['rawHigh']),float(request.form['scaledLow']),float(request.form['scaledHigh']))
        with lock:
            channels.append(channel)
            latestValues.append(0.0)
        return jsonify(error=False,channel=channel.serialize())
    elif(action == 'deleteChannel'):
        index = int(request.form['index'])
        with lock:
            del channels[index]
            del latestValues[index]
        return jsonify(error=False)
    elif(action == 'getFileList'):
        return jsonify(files=os.listdir(path))
    elif(action == 'startLogging'):
        filename = request.form['filename'] + '.csv'
        print "should start logging with filename: "+filename
        q.put(Instruction('openFile',filename))
        return jsonify(error=False)
    elif(action == 'stopLogging'):
        print "should close file"
        q.put(Instruction('closeFile'))
        return jsonify(error=False)
        
    else:
        return jsonify(error=True,message="Action "+action+" not recognized")
    
@app.route("/logging")
def logging():
    return render_template('logging.html')
    
def io(): #thread reading from the hardware inputs and outputs... Simulated values at this point...
    global channels, latestValues, q
    while True:
        x = 0
        with lock:
            try:
                for ch in channels:
                    latestValues[x] = scaleValue(random.randint(0,10),ch)
                    x += 1
                #print json.dumps(latestValues)
                q.put(Instruction('writeData',latestValues))
            except:
                print("Error writing to latestValues")
        time.sleep(0.5)
        
        
t = Thread(target=io)
t.start()



def fileModule():
    global q, channels, path
    f = None #file reference
    while True:
        i = q.get()
        if(i.header == 'writeData'):
            if f is not None:
                print "The file appears to be open so we'll try to write to it, "+json.dumps(i.body)
                contents = ''
                for value in i.body:
                    contents += str(value) + ','
                contents += '\n'
                print "contents: "+contents
                f.write(contents)
        elif (i.header == 'openFile'):
            filePath = path+'/'+i.body
            print "Will open filename: "+filePath
            
            f = open(filePath,"w+")
        elif (i.header == 'closeFile'):
            print "Will close file"
            f.close()
            f = None
            
        else:
            print "fileModule: unrecognized header..."+json.dumps(i.serialize())
        
fileThread = Thread(target=fileModule)
fileThread.start()



  
if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)

    
