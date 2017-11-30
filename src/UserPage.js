import React, { Component } from "react";
import axios from "axios";


class UserPage extends Component {
  constructor(props) {
    super(props);
    this.dataSet = [];
    axios
      .get("http://localhost:80/last/backend/query_artist.php", {
        params: {
          user: this.props.match.params.user
        }
      })
      .then(response => {
        this.dataSet = response.data;
        console.dir(this.dataSet);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    return <div>Page of {this.props.match.params.user}
    		
    	   </div>;
  }
}
export default UserPage;
