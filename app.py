from flask import Flask, render_template, redirect, url_for, request
from werkzeug.utils import secure_filename
from youtube_dl.utils import DownloadError
import secret
import youtube_dl
import requests
import random
import os
import os.path
import time

url = "https://deezerdevs-deezer.p.rapidapi.com/search"

headers = secret.headers

app = Flask(__name__, static_url_path='/static')
url_map = app.url_map

try:
    for rule in url_map.iter_rules('static'):
        url_map._rules.remove(rule)
except ValueError:
    pass

app.add_url_rule(
    app.static_url_path + '/<path:filename>',
    endpoint='static', view_func=app.send_static_file
)

@app.route('/')
def home():
    return render_template('search.html') 

@app.route('/search/<term>')
def search(term):
    response = requests.request("GET", "https://deezerdevs-deezer.p.rapidapi.com/search", headers=headers, params={'q': term})
    response = response.json()
    return render_template('search.html', items=response['data'])

@app.route('/search')
def searchbar():
    query = request.args.get('q')
    return redirect(url_for('search', term=query)) 

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/upload/play', methods=['POST'])
def uploader():
    if request.method == 'POST':
        f = request.files['file']
        if(os.path.splitext(f.filename)[1] == ".mp3"):
            n = random.randint(0, 10)
            f.save('static/userContent/' + secure_filename(str(n) + ".mp3"))
            return render_template('visual.html', audioUrl=getUserContent(str(n) + ".mp3"))
    return render_template('upload.html', err="Must be an mp3 file.")

@app.route('/url')
def url():
    return render_template('paste.html')

@app.route('/url/play')
def playfromurl():
    query = request.args.get('q')
    return render_template('visual.html', audioUrl=query)

@app.route('/play/<id>')
def player(id): 
    url = "https://deezerdevs-deezer.p.rapidapi.com/track/" + id
    response = requests.request("GET", url, headers=headers)
    response = response.json()
    link = response['preview']
    return render_template('visual.html', audioUrl=link)

@app.route('/youtube')
def fetchFromYoutube():
    url = request.args.get('q')
    fileid = 0# random.randint(0, 10)
    filepath = 'static/userContent/' + str(fileid) + '.mp3'
    if os.path.isfile(filepath):
        os.remove(filepath)

    ydlOptions = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': filepath,
        'nopostoverwrites': True
    }
    try:
        with youtube_dl.YoutubeDL(ydlOptions) as ydl:
            ydl.download([url])
    except DownloadError:
        time.sleep(1)
    return redirect(url_for('playfromurl', q=getUserContent(str(fileid) + ".mp3")))

def getUserContent(name):
    return "/static/userContent/" + name + "?t=" + str(int(time.time()))

if __name__ == '__main__':
    app.run(debug=True)