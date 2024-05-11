from flask import Flask, request, jsonify
from model import get_recommendations

app = Flask(__name__)

@app.route("/getrecommendations", methods=["GET"])
def getRecommendations():
    if request.method == "GET":
        # get json data from req body   
        terms = request.get_json()
        terms = get_recommendations(terms['Terms'])
        return terms, 200;




if __name__ == "__main__":
    app.run(debug=True)