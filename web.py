from flask import Flask, session, redirect, url_for, render_template, request, jsonify
import random
app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
count = 0

class Channel:
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

channels = [Channel('Inner temperature','#ff0000',1234),Channel('Outer temperature','#00ff00',1235)]

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
    global channels
    if(action == 'getLatestPoint'):
        values = []
        for ch in channels:
            values.append(random.randint(1,20))
        return jsonify(error=False,values=values)
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
        channels.append(channel)
        return jsonify(error=False,channel=channel.serialize())
    elif(action == 'deleteChannel'):
        index = int(request.form['index'])
        del channels[index]
        return jsonify(error=False)
    else:
        return jsonify(error=True,message="Action "+action+" not recognized")
    
    
if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
    
