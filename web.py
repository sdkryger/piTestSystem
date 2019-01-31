from flask import Flask, session, redirect, url_for, render_template, request
app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
count = 0

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
    
if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)