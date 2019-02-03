from flask import Flask, session, redirect, url_for, render_template, request, jsonify
import random
app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
count = 0

class Channel:
    def __init__(self, name, color, address, rawLow=0, rawHigh=10, scaledLow=0, scaledHigh=10):
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

channels = [Channel('Inner temperature','#ff0000',1234),Channel('Outer temperature','#00ff00',1235)]

@app.route("/")
def index():
    global count
    count = count +1
    if 'welcome' in session:
        return render_template('index.html')
    return redirect(url_for('splashScreen'))
    
@app.route("/splashScreen")
def splashScreen():
    global count
    count = count +1
    session['welcome'] = 'true'
    return render_template('spinningLogo.html')
    #return "Welcome<br><a href='/'>Home</a>"
    
@app.route("/action/<action>", methods = ['GET','POST'])
def action(action):
    global channels
    if(action == 'getLatestPoint'):
        values = []
        for ch in channels:
            values.append(random.randint(1,20))
        return jsonify(error=False,values=values)
    elif(action == 'getChannels'):
        return jsonify(channels = [ch.serialize() for ch in channels])
    else:
        return jsonify(error=True,message="Action "+action+" not recognized")
    
    
if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
    
