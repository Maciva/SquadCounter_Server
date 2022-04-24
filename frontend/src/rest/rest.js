import axios from "axios";

class Rest {

    subjects() {
        axios.get("/subjects").then(console.log, err => console.log(err.response))
    }
}

export default Rest