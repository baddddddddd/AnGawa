from common import *
from authentication import *
from scheduler import *


@app.route("/api/ping", methods=["GET"])
def ping():
    return jsonify(msg="I'm alive!")


if __name__ == '__main__':
    app.run(debug=True)
    